"use client";

import { Building2, ExternalLink, Hash, Image as ImageIcon, Inbox, KeyRound, LoaderCircle, LogOut, MessageSquareQuote, Save, Trash2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import type { SiteData } from "@/content/site";
import { cn } from "@/lib/cn";
import { leadsAdminEmail, leadsEnabled } from "@/lib/leads";
import { Notice } from "./admin-ui";
import { BusinessTab, businessErrors } from "./business-tab";
import { ClearAllTab } from "./clear-all-tab";
import { AccountTab } from "./account-tab";
import { signInLeads, signOutLeads } from "./firebase";
import { ConflictError, GitHubError, deployState, loadData, photoPreviewUrl, saveData, serialize, type DeployState } from "./github";
import { Login, Setup } from "./login";
import { LeadsTab } from "./leads-tab";
import { PhotosTab, photoErrors, type PendingPhoto } from "./photos-tab";
import { ReviewsTab, reviewErrors } from "./reviews-tab";
import { StatsTab, statErrors } from "./stats-tab";
import { USER_KEY, clearStored, readStored, writeStored } from "./storage";
import { builtVault } from "./vault";

const TOKEN_KEY = "speedster-admin-github";

const tabs = [
  { id: "business", label: "Business", icon: Building2 },
  { id: "reviews", label: "Reviews", icon: MessageSquareQuote },
  { id: "photos", label: "Photos", icon: ImageIcon },
  { id: "stats", label: "Stats", icon: Hash },
  { id: "leads", label: "Leads", icon: Inbox },
  { id: "account", label: "Password", icon: KeyRound },
  { id: "clear", label: "Clear all", icon: Trash2 },
] as const;
type Tab = (typeof tabs)[number]["id"];

const hasError = (errors: Record<string, string | undefined>) => Object.values(errors).some(Boolean);

/** The first tab holding a field that blocks saving, if any. */
function invalidTab(data: SiteData): Tab | null {
  if (hasError(businessErrors(data))) return "business";
  if (data.reviews.some((r) => hasError(reviewErrors(r)))) return "reviews";
  if (data.photos.some((p) => hasError(photoErrors(p)))) return "photos";
  if (data.stats.some((s) => hasError(statErrors(s)))) return "stats";
  return null;
}

/** Trims text and writes keys in a steady order so saved diffs stay small. */
function tidy(data: SiteData): SiteData {
  const opt = (text?: string) => text?.trim() || undefined;
  return {
    phone: data.phone.trim(),
    email: data.email.trim(),
    hours: { opens: data.hours.opens, closes: data.hours.closes },
    licenseNumber: data.licenseNumber.trim(),
    googleReviewUrl: data.googleReviewUrl.trim(),
    reviewsTotal: data.reviewsTotal.trim(),
    stats: data.stats.map((s) => ({ value: s.value.trim(), label: s.label.trim() })),
    reviews: data.reviews.map((r) => ({ author: r.author.trim(), date: opt(r.date), rating: r.rating, source: opt(r.source), text: r.text.trim() })),
    photos: data.photos.map((p) => ({ src: p.src, alt: p.alt.trim(), width: p.width, height: p.height, caption: opt(p.caption) })),
  };
}

/** "Admin: update business info and reviews" */
function commitMessage(before: SiteData, after: SiteData) {
  const changed = [
    JSON.stringify([before.phone, before.email, before.hours, before.licenseNumber, before.googleReviewUrl, before.reviewsTotal]) !==
      JSON.stringify([after.phone, after.email, after.hours, after.licenseNumber, after.googleReviewUrl, after.reviewsTotal]) && "business info",
    JSON.stringify(before.reviews) !== JSON.stringify(after.reviews) && "reviews",
    JSON.stringify(before.photos) !== JSON.stringify(after.photos) && "photos",
    JSON.stringify(before.stats) !== JSON.stringify(after.stats) && "stats",
  ].filter(Boolean) as string[];
  const list = changed.length > 1 ? `${changed.slice(0, -1).join(", ")} and ${changed.at(-1)}` : (changed[0] ?? "site data");
  return `Admin: update ${list}`;
}

export function AdminApp() {
  // undefined while checking storage after mount, null when signed out.
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [saved, setSaved] = useState<{ text: string; data: SiteData } | null>(null);
  const [draft, setDraft] = useState<SiteData | null>(null);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState<Tab>("business");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<{ text: string; conflict?: boolean } | null>(null);
  const [deploy, setDeploy] = useState<{ sha: string; state: DeployState } | null>(null);
  /** Showing the setup screen again, e.g. after the GitHub key expired. */
  const [resetting, setResetting] = useState(false);
  const [setupDone, setSetupDone] = useState(false);
  /** Set (to a note about leads) once "Delete everything" has run. */
  const [wiped, setWiped] = useState<string | null>(null);
  /** Photos picked but not saved yet, and local previews of saved ones, by site path. */
  const pending = useRef(new Map<string, PendingPhoto>());
  const [, setPendingCount] = useState(0);

  const load = useCallback(async (withToken: string) => {
    setLoadError("");
    try {
      const result = await loadData(withToken);
      setSaved(result);
      setDraft(result.data);
    } catch (e) {
      if (e instanceof GitHubError && e.status === 401) {
        clearStored(TOKEN_KEY);
        setToken(null);
      }
      setLoadError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    const stored = readStored(TOKEN_KEY);
    // Read after mount: storage isn't available while the page is prerendered.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(stored);
    if (stored) load(stored);
  }, [load]);

  const dirty = !!saved && !!draft && JSON.stringify(draft) !== JSON.stringify(saved.data);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // Follow the rebuild that a save started until the new version is live.
  useEffect(() => {
    if (!token || !deploy || deploy.state === "live" || deploy.state === "failed" || deploy.state === "unknown") return;
    const timer = setTimeout(async () => {
      const state = await deployState(token, deploy.sha);
      setDeploy((current) => (current?.sha === deploy.sha ? { sha: deploy.sha, state } : current));
    }, 8000);
    return () => clearTimeout(timer);
  }, [token, deploy]);

  const commit = useCallback(
    async (next: SiteData, message: string) => {
      if (!token || !saved) return false;
      setSaving(true);
      setSaveError(null);
      const clean = tidy(next);
      const uploads = clean.photos
        .filter((p) => pending.current.get(p.src)?.base64)
        .map((p) => ({ path: `public${p.src}`, base64: pending.current.get(p.src)!.base64 }));
      const removals = saved.data.photos
        .filter((p) => p.src.startsWith("/photos/") && !clean.photos.some((q) => q.src === p.src))
        .map((p) => `public${p.src}`);
      try {
        const sha = await saveData(token, { data: clean, loadedText: saved.text, uploads, removals, message });
        // Saved photos keep their local preview (without the upload data) until the page reloads.
        for (const [src, photo] of pending.current) pending.current.set(src, { ...photo, base64: "" });
        setSaved({ text: serialize(clean), data: clean });
        setDraft(clean);
        setDeploy({ sha, state: "waiting" });
        return true;
      } catch (e) {
        setSaveError(
          e instanceof ConflictError
            ? {
                text: "The site data was changed somewhere else (another tab or device) since you opened this page. Reload to get the latest version. Unsaved changes on this page will be lost.",
                conflict: true,
              }
            : { text: (e as Error).message },
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [token, saved],
  );

  const save = () => {
    if (!draft || !saved) return;
    const broken = invalidTab(draft);
    if (broken) {
      setTab(broken);
      setSaveError({ text: "Some fields need fixing before you can save. They're marked in red." });
      return;
    }
    commit(draft, commitMessage(saved.data, tidy(draft)));
  };

  const discard = () => {
    if (!saved) return;
    setDraft(saved.data);
    setSaveError(null);
  };

  const signOut = () => {
    if (dirty && !window.confirm("You have unsaved changes. Sign out and lose them?")) return;
    clearStored(TOKEN_KEY);
    clearStored(USER_KEY);
    signOutLeads();
    setToken(null);
    setSaved(null);
    setDraft(null);
    setDeploy(null);
  };

  const update = useCallback((change: (data: SiteData) => SiteData) => setDraft((d) => (d ? change(d) : d)), []);
  const addPending = useCallback((src: string, photo: PendingPhoto) => {
    pending.current.set(src, photo);
    setPendingCount(pending.current.size);
  }, []);
  const previewUrl = useCallback((src: string) => pending.current.get(src)?.url ?? photoPreviewUrl(src), []);

  /** After "Delete everything": sign out everywhere and say what happened. */
  const wipe = (note: string) => {
    clearStored(TOKEN_KEY);
    clearStored(USER_KEY);
    signOutLeads();
    setWiped(note);
    setToken(null);
  };

  if (wiped !== null)
    return (
      <Shell>
        <div className="mx-auto max-w-xl">
          <Notice tone="success">
            {wiped}Every website file was deleted. The website goes offline in about 1–2 minutes, and every address will show
            &ldquo;not found&rdquo;. You&rsquo;ve been signed out.
          </Notice>
        </div>
      </Shell>
    );

  if (token === undefined) return null;

  /** Keeps the session in this browser and opens the leads with the same password. */
  const start = async (githubToken: string, username: string, password: string, remember: boolean) => {
    writeStored(TOKEN_KEY, githubToken, remember);
    writeStored(USER_KEY, username.trim(), remember);
    // Not fatal: the Leads tab offers its own sign-in if this fails.
    if (leadsEnabled) await signInLeads(leadsAdminEmail, password, remember).catch(() => {});
    setToken(githubToken);
    load(githubToken);
  };

  if (token === null)
    return (
      <Shell>
        {builtVault && !resetting ? (
          <Login vault={builtVault} error={loadError} onLogin={start} onReset={() => setResetting(true)} />
        ) : (
          <Setup
            again={resetting}
            onCancel={resetting ? () => setResetting(false) : undefined}
            onDone={(githubToken, username, password) => {
              setResetting(false);
              setSetupDone(true);
              return start(githubToken, username, password, false);
            }}
          />
        )}
      </Shell>
    );

  return (
    <Shell onSignOut={signOut}>
      {!draft || !saved ? (
        loadError ? (
          <div className="grid max-w-xl gap-4">
            <Notice tone="error">{loadError}</Notice>
            <button type="button" onClick={() => load(token)} className={buttonClass("primary", "md", "justify-self-start")}>
              <span className="btn-label">Try again</span>
            </button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-muted">
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> Loading the site data…
          </p>
        )
      ) : (
        <>
          <nav
            aria-label="Admin sections"
            className="mb-6 grid grid-cols-3 gap-2 md:mb-9 md:flex md:flex-wrap [&>:last-child:nth-child(3n+1)]:col-span-3"
          >
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={tab === id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors md:flex-row md:gap-2 md:px-5 md:text-base",
                  tab === id ? "border-red-glow/70 bg-red/15 text-fg" : "border-white/10 text-chrome-2 hover:border-white/25 hover:text-fg",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
                {label}
              </button>
            ))}
          </nav>

          {setupDone && (
            <div className="mb-6">
              <Notice tone="success">
                Setup saved. From the next website update (about 1–2 minutes) you can sign in with your username and password.
              </Notice>
            </div>
          )}
          {deploy && !dirty && <DeployNotice state={deploy.state} />}

          {tab === "business" && <BusinessTab data={draft} update={update} />}
          {tab === "reviews" && <ReviewsTab data={draft} update={update} />}
          {tab === "photos" && <PhotosTab data={draft} update={update} addPending={addPending} previewUrl={previewUrl} />}
          {tab === "stats" && <StatsTab data={draft} update={update} />}
          {tab === "leads" && <LeadsTab />}
          {tab === "account" && <AccountTab token={token} />}
          {tab === "clear" && <ClearAllTab saved={saved.data} dirty={dirty} save={commit} token={token} onWiped={wipe} />}

          {(dirty || saving || saveError) && (
            <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg">
              <div className="container-x py-3">
                {saveError && (
                  <div className="mb-3">
                    <Notice tone="error">
                      {saveError.text}{" "}
                      {saveError.conflict && (
                        <button type="button" onClick={() => window.location.reload()} className="font-semibold underline underline-offset-4">
                          Reload
                        </button>
                      )}
                    </Notice>
                  </div>
                )}
                {(dirty || saving) && (
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="mr-auto text-sm text-chrome-2 max-sm:w-full">You have unsaved changes.</p>
                    <button type="button" onClick={discard} disabled={saving} className={buttonClass("ghost", "md", "max-sm:flex-1")}>
                      <span className="btn-label">
                        <Undo2 aria-hidden="true" className="size-5" />
                        Discard
                      </span>
                    </button>
                    <button type="button" onClick={save} disabled={saving} className={buttonClass("primary", "md", "max-sm:flex-1")}>
                      <span className="btn-label">
                        {saving ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> : <Save aria-hidden="true" className="size-5" />}
                        {saving ? "Saving…" : "Save"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}

function Shell({ onSignOut, children }: { onSignOut?: () => void; children: ReactNode }) {
  return (
    <div className="min-h-dvh pb-40">
      <header className="border-b border-white/10 bg-carbon">
        <div className="container-x flex min-h-16 items-center gap-3 py-2">
          <Logo height={40} link={false} eager />
          <span className="display text-lg text-chrome-2">Admin</span>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/" target="_blank" className={buttonClass("ghost", "sm")}>
              <span className="btn-label">
                <ExternalLink aria-hidden="true" className="size-4" />
                <span className="max-xs:sr-only">View site</span>
              </span>
            </Link>
            {onSignOut && (
              <button type="button" onClick={onSignOut} className={buttonClass("ghost", "sm")}>
                <span className="btn-label">
                  <LogOut aria-hidden="true" className="size-4" />
                  <span className="max-xs:sr-only">Sign out</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </header>
      <div className="container-x pt-6 md:pt-10">{children}</div>
    </div>
  );
}

function DeployNotice({ state }: { state: DeployState }) {
  const text = {
    waiting: "Saved. The website is about to rebuild with your changes…",
    building: "Saved. The website is rebuilding with your changes (about 1–2 minutes)…",
    live: "Saved and live. Your changes are on the website now.",
    failed: "Saved, but the website rebuild failed. Your changes are stored; check the Actions tab on GitHub.",
    unknown: "Saved. The website updates in about 1–2 minutes.",
  }[state];
  return (
    <div className="mb-6">
      <Notice tone={state === "failed" ? "error" : state === "live" ? "success" : "info"}>
        <span className="flex items-center gap-2">
          {(state === "waiting" || state === "building") && <LoaderCircle aria-hidden="true" className="size-4 shrink-0 animate-spin" />}
          {text}
        </span>
      </Notice>
    </div>
  );
}

