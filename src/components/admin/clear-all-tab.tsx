"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type { SiteData } from "@/content/site";
import { leadsEnabled } from "@/lib/leads";
import { ConfirmDialog, Notice, TabHeading, panelClass } from "./admin-ui";
import { deleteAllLeads, storedSession } from "./firebase";

/** Empties reviews, photos and stats (one save) and deletes every lead. Business info is kept. */
export function ClearAllTab({
  saved,
  dirty,
  save,
}: {
  saved: SiteData;
  dirty: boolean;
  save: (next: SiteData, message: string) => Promise<boolean>;
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
