/**
 * The /admin page saves by committing to the site's GitHub repository with the
 * owner's personal access token. Each push to main rebuilds and republishes
 * the site (.github/workflows/deploy.yml), so a save goes live in a minute or two.
 */

import type { SiteData } from "@/content/site";

export const repo = { owner: "EXULT777", name: "speedster-website", branch: "main" };
export const dataPath = "src/content/site-data.json";
/** Uploaded photos live here; their site paths are "/photos/<file>". */
export const photosDir = "public/photos";

const api = `https://api.github.com/repos/${repo.owner}/${repo.name}`;

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

/** Someone (or another tab) saved since this page loaded the data. */
export class ConflictError extends Error {}

async function call<T>(token: string, path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${api}${path}`, {
      method: init?.method ?? "GET",
      cache: "no-store",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(init?.body !== undefined && { "Content-Type": "application/json" }),
      },
      body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new GitHubError("Couldn't reach GitHub. Check your internet connection and try again.", 0);
  }
  if (!response.ok) {
    const detail = ((await response.json().catch(() => null)) as { message?: string } | null)?.message;
    throw new GitHubError(explain(response.status, detail), response.status);
  }
  return (await response.json()) as T;
}

function explain(status: number, detail?: string) {
  if (status === 401) return "GitHub didn't accept this token. It may be mistyped, expired or deleted.";
  if (status === 403) return "This token isn't allowed to do that. Check that it has Contents: Read and write access to the speedster-website repository.";
  if (status === 404) return "GitHub couldn't find the speedster-website repository with this token. Check that the token includes that repository.";
  return `GitHub returned an error (${status}${detail ? `: ${detail}` : ""}).`;
}

function decodeBase64(base64: string) {
  const bytes = Uint8Array.from(atob(base64.replace(/\s/g, "")), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function serialize(data: SiteData) {
  return `${JSON.stringify(data, null, 2)}\n`;
}

/** Reads site-data.json as it is on GitHub right now (newer than this build if saves are still deploying). */
export async function loadData(token: string, ref = repo.branch) {
  const file = await call<{ content: string }>(token, `/contents/${dataPath}?ref=${encodeURIComponent(ref)}`).catch((error) => {
    // The token can read the repository (checked at sign-in), so a 404 here means the file itself is missing.
    if (error instanceof GitHubError && error.status === 404)
      throw new GitHubError(`The website's data file (${dataPath}) isn't on GitHub yet. Push the latest website code, wait for it to deploy, then try again.`, 404);
    throw error;
  });
  const text = decodeBase64(file.content);
  return { text, data: JSON.parse(text) as SiteData };
}

export type Upload = { path: string; base64: string };

/**
 * Writes the new data file, adds uploaded photos and removes deleted ones in a
 * single commit (so one save means one rebuild). Refuses with ConflictError if
 * the data file changed on GitHub since `loadedText` was read.
 */
export async function saveData(
  token: string,
  { data, loadedText, uploads, removals, message }: { data: SiteData; loadedText: string; uploads: Upload[]; removals: string[]; message: string },
) {
  const head = await call<{ object: { sha: string } }>(token, `/git/ref/heads/${repo.branch}`);
  const headSha = head.object.sha;
  const current = await loadData(token, headSha);
  if (current.text !== loadedText) throw new ConflictError();

  const blobs = await Promise.all(
    uploads.map((upload) => call<{ sha: string }>(token, "/git/blobs", { method: "POST", body: { content: upload.base64, encoding: "base64" } })),
  );
  return commitTree(token, headSha, message, [
    { path: dataPath, mode: "100644", type: "blob", content: serialize(data) },
    ...uploads.map((upload, i) => ({ path: upload.path, mode: "100644", type: "blob", sha: blobs[i].sha })),
    ...removals.map((path) => ({ path, mode: "100644", type: "blob", sha: null })),
  ]);
}

/** Writes one text file in its own commit. */
export async function saveFile(token: string, path: string, content: string, message: string) {
  const head = await call<{ object: { sha: string } }>(token, `/git/ref/heads/${repo.branch}`);
  return commitTree(token, head.object.sha, message, [{ path, mode: "100644", type: "blob", content }]);
}

type TreeEntry = { path: string; mode: string; type: string; content?: string; sha?: string | null };

/** Commits `entries` on top of `headSha` and moves main to it. */
async function commitTree(token: string, headSha: string, message: string, entries: TreeEntry[]) {
  const commit = await call<{ tree: { sha: string } }>(token, `/git/commits/${headSha}`);
  const tree = await call<{ sha: string }>(token, "/git/trees", {
    method: "POST",
    body: { base_tree: commit.tree.sha, tree: entries },
  });
  const created = await call<{ sha: string }>(token, "/git/commits", {
    method: "POST",
    body: { message, tree: tree.sha, parents: [headSha] },
  });
  try {
    await call(token, `/git/refs/heads/${repo.branch}`, { method: "PATCH", body: { sha: created.sha, force: false } });
  } catch (error) {
    // 422: main moved on between reading it and saving.
    if (error instanceof GitHubError && error.status === 422) throw new ConflictError();
    throw error;
  }
  return created.sha;
}

/** Checks the token can read the repository. */
export async function checkToken(token: string) {
  await call(token, "");
}

export type DeployState = "waiting" | "building" | "live" | "failed" | "unknown";

/** Progress of the site rebuild started by a commit. "unknown" when the token can't read Actions. */
export async function deployState(token: string, sha: string): Promise<DeployState> {
  try {
    const { workflow_runs: runs } = await call<{ workflow_runs: { status: string; conclusion: string | null }[] }>(
      token,
      `/actions/runs?head_sha=${sha}&per_page=1`,
    );
    const run = runs[0];
    if (!run) return "waiting";
    if (run.status !== "completed") return "building";
    return run.conclusion === "success" ? "live" : "failed";
  } catch {
    return "unknown";
  }
}

/** Where the admin page previews a saved photo: straight from the repository, so it shows before the rebuild finishes. */
export function photoPreviewUrl(src: string) {
  return `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/public${src}`;
}
