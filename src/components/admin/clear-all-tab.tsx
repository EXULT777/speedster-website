"use client";

import { LoaderCircle, Lock, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import type { SiteData } from "@/content/site";
import { leadsEnabled } from "@/lib/leads";
import { ConfirmDialog, Field, Notice, TabHeading, panelClass } from "./admin-ui";
import { deleteAllLeads, storedSession } from "./firebase";
import { deleteEverything } from "./github";
import { checkCode, deleteLock } from "./vault";

/** Empties reviews, photos and stats (one save) and deletes every lead. Business info is kept. */
export function ClearAllTab({
  saved,
  dirty,
  save,
  token,
  onWiped,
}: {
  saved: SiteData;
  dirty: boolean;
  save: (next: SiteData, message: string) => Promise<boolean>;
  token: string;
  onWiped: (note: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const leadsSignedIn = leadsEnabled && storedSession() !== null;
  const hasContent = saved.reviews.length + saved.photos.length + saved.stats.length > 0;

  const run = async () => {
    setBusy(true);
    setResult(null);
    const parts: string[] = [];
    let failed = "";
    if (hasContent) {
      const ok = await save({ ...saved, reviews: [], photos: [], stats: [] }, "Admin: clear all reviews, photos and stats");
      if (ok) parts.push("Reviews, photos and stats were cleared. The website updates in a minute or two.");
      else failed = "Clearing reviews, photos and stats failed. The reason is shown at the bottom of the screen.";
    }
    if (leadsSignedIn && !failed) {
      try {
        const count = await deleteAllLeads();
        parts.push(`${count} ${count === 1 ? "lead was" : "leads were"} deleted.`);
      } catch (e) {
        failed = `Deleting leads failed: ${(e as Error).message}`;
      }
    }
    setResult(failed ? { tone: "error", text: [...parts, failed].join(" ") } : { tone: "success", text: parts.join(" ") || "There was nothing to clear." });
    setBusy(false);
    setOpen(false);
  };

  return (
    <section aria-labelledby="clear-tab-heading">
      <TabHeading
        id="clear-tab-heading"
        title="Clear all content"
        text="Removes every review, photo and stat from the website, and deletes every contact-form lead. Your phone number, email, hours and the rest of the site stay as they are."
      />

      {result && (
        <div className="mb-4">
          <Notice tone={result.tone}>{result.text}</Notice>
        </div>
      )}

      <div className={`${panelClass} max-w-2xl border-red-glow/40 p-5 md:p-7`}>
        <ul className="list-disc space-y-1.5 pl-5 text-chrome-2 marker:text-red-glow">
          <li>
            {saved.reviews.length} reviews, {saved.photos.length} photos and {saved.stats.length} stats will be removed. You can get them
            back later from the repository history on GitHub.
          </li>
          <li>
            {!leadsEnabled
              ? "Lead storage isn't switched on, so there are no leads to delete."
              : leadsSignedIn
                ? "All leads will be deleted for good. They can't be recovered."
                : "Leads won't be touched: sign in on the Leads tab first if you want them deleted too."}
          </li>
        </ul>
        {dirty && (
          <div className="mt-5">
            <Notice>You have unsaved changes. Save or discard them first.</Notice>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={dirty || busy || (!hasContent && !leadsSignedIn)}
          className={buttonClass("primary", "lg", "mt-6 disabled:opacity-45")}
        >
          <span className="btn-label">
            <Trash2 aria-hidden="true" className="size-5" />
            Clear all content
          </span>
        </button>
      </div>

      <DeleteEverything token={token} leadsSignedIn={leadsSignedIn} onWiped={onWiped} />

      <ConfirmDialog
        open={open}
        title="Clear all content?"
        confirmLabel="Clear everything"
        typeToConfirm="DELETE"
        busy={busy}
        onClose={() => !busy && setOpen(false)}
        onConfirm={run}
      >
        <p>This saves right away and publishes the emptied website.{leadsSignedIn && " Deleted leads can't be recovered."}</p>
      </ConfirmDialog>
    </section>
  );
}

/** Deletes every website file on GitHub and every lead, and takes the site offline. */
function DeleteEverything({ token, leadsSignedIn, onWiped }: { token: string; leadsSignedIn: boolean; onWiped: (note: string) => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>();
  const [checking, setChecking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const unlock = async (event: FormEvent) => {
    event.preventDefault();
    if (!deleteLock) return;
    setChecking(true);
    setCodeError(undefined);
    if (await checkCode(deleteLock, code)) setUnlocked(true);
    else setCodeError("Wrong code.");
    setCode("");
    setChecking(false);
  };

  const run = async () => {
    setBusy(true);
    setError("");
    let note = "";
    if (leadsSignedIn) {
      try {
        const count = await deleteAllLeads();
        note = `${count} ${count === 1 ? "lead was" : "leads were"} deleted. `;
      } catch (e) {
        setError(`Nothing was deleted: removing the leads failed. ${(e as Error).message}`);
        setBusy(false);
        setOpen(false);
        return;
      }
    }
    try {
      await deleteEverything(token);
      onWiped(note);
    } catch (e) {
      setError(`${note}The website files were not deleted: ${(e as Error).message}`);
      setBusy(false);
      setOpen(false);
    }
  };

  return (
    <div className={`${panelClass} mt-8 max-w-2xl border-red-glow/60 bg-red/5 p-5 md:p-7`}>
      <h3 className="display text-xl md:text-2xl">Delete everything</h3>
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-chrome-2 marker:text-red-glow">
        <li>
          Deletes <strong className="text-fg">every file of the website</strong> from GitHub: all pages, text, photos, the design and this
          admin panel.
        </li>
        <li>
          Takes the website offline. About 1–2 minutes later, every address shows &ldquo;not found&rdquo;.
        </li>
        <li>
          {!leadsEnabled
            ? "Lead storage isn't switched on, so there are no leads to delete."
            : leadsSignedIn
              ? "Deletes every lead for good."
              : "Leads won't be deleted: sign in on the Leads tab first if you want them gone too."}
        </li>
        <li>
          The website&rsquo;s history stays on GitHub and on the computer it was built on, so a developer can bring it back. Deleted leads
          can&rsquo;t be brought back.
        </li>
      </ul>
      {error && (
        <div className="mt-5">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      {unlocked ? (
        <button type="button" onClick={() => setOpen(true)} disabled={busy} className={buttonClass("primary", "lg", "mt-6 disabled:opacity-45")}>
          <span className="btn-label">
            <Trash2 aria-hidden="true" className="size-5" />
            Delete everything
          </span>
        </button>
      ) : !deleteLock ? (
        <p className="mt-6 flex items-center gap-2 font-semibold text-chrome-1">
          <Lock aria-hidden="true" className="size-5 shrink-0 text-red-glow" />
          Locked. No delete code has been set yet.
        </p>
      ) : (
        <form onSubmit={unlock} className="mt-6 flex flex-wrap items-end gap-3">
          <Field label="Delete code" error={codeError} className="min-w-0 flex-1 basis-48">
            {(props) => (
              <input {...props} type="password" autoComplete="off" spellCheck={false} value={code} onChange={(e) => setCode(e.target.value)} />
            )}
          </Field>
          <button type="submit" disabled={checking || !code.trim()} className={buttonClass("ghost", "md", "disabled:opacity-45")}>
            <span className="btn-label">
              {checking ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> : <Lock aria-hidden="true" className="size-5" />}
              Unlock
            </span>
          </button>
        </form>
      )}

      <ConfirmDialog
        open={open}
        title="Delete the whole website?"
        confirmLabel="Delete"
        typeToConfirm="DELETE EVERYTHING"
        busy={busy}
        onClose={() => !busy && setOpen(false)}
        onConfirm={run}
      >
        <p>
          Every page, file and photo is deleted and the website goes offline.{leadsSignedIn && " All leads are deleted for good."} You&rsquo;ll be
          signed out, and this admin page goes away too.
        </p>
      </ConfirmDialog>
    </div>
  );
}
