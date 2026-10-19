"use client";

import { LoaderCircle, LogOut, Mail, Phone, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { leadsAdminEmail, leadsEnabled, type Lead } from "@/lib/leads";
import { ConfirmDialog, EmptyState, Field, Notice, TabHeading, iconButtonClass, panelClass } from "./admin-ui";
import { deleteAllLeads, deleteLeads, listLeads, signInLeads, signOutLeads, storedSession } from "./firebase";

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

export function LeadsTab() {
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<Lead | "all" | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setLeads(await listLeads());
    } catch (e) {
      setError((e as Error).message);
      if (!storedSession()) setEmail(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!leadsEnabled) return;
    const session = storedSession();
    // Read after mount: storage isn't available while the page is prerendered.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(session?.email ?? null);
    if (session) load();
  }, [load]);

  if (!leadsEnabled) return <LeadsSetup />;
  if (email === undefined) return null;
  if (email === null)
    return (
      <LeadsSignIn
        onSignedIn={(signedIn) => {
          setEmail(signedIn);
          load();
        }}
      />
    );

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      if (deleting === "all") await deleteAllLeads();
      else await deleteLeads([deleting.id]);
      setDeleting(null);
      await load();
    } catch (e) {
      setError((e as Error).message);
      setDeleting(null);
    }
    setBusy(false);
  };

  return (
    <section aria-labelledby="leads-tab-heading">
      <TabHeading
        id="leads-tab-heading"
        title="Leads"
        text="Messages sent through the contact form, newest first."
      >
        <button type="button" onClick={load} disabled={loading} className={buttonClass("ghost", "md")}>
          <span className="btn-label">
            <RefreshCw aria-hidden="true" className={`size-5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </span>
        </button>
        {leads && leads.length > 0 && (
          <button type="button" onClick={() => setDeleting("all")} className={buttonClass("ghost", "md")}>
            <span className="btn-label">
              <Trash2 aria-hidden="true" className="size-5" />
              Delete all
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            signOutLeads();
            setEmail(null);
            setLeads(null);
          }}
          className={buttonClass("ghost", "md")}
        >
          <span className="btn-label">
            <LogOut aria-hidden="true" className="size-5" />
            Sign out
          </span>
        </button>
      </TabHeading>

      {error && (
        <div className="mb-4">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      {!leads ? (
        loading && (
          <p className="flex items-center gap-2 text-muted">
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> Loading leads…
          </p>
        )
      ) : leads.length === 0 ? (
        <EmptyState>No leads yet. New contact-form messages will show up here.</EmptyState>
      ) : (
        <ol className="grid gap-4 lg:grid-cols-2">
          {leads.map((lead) => (
            <li key={lead.id} className={`${panelClass} p-5 md:p-6`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="display text-lg leading-tight md:text-xl">{lead.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {lead.createdAt ? dateFormat.format(new Date(lead.createdAt)) : "Date unknown"}
                  </p>
                </div>
                <button type="button" onClick={() => setDeleting(lead)} className={iconButtonClass} aria-label={`Delete lead from ${lead.name}`}>
                  <Trash2 aria-hidden="true" className="size-5" />
                </button>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.9375rem]">
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">Service</dt>
                  <dd className="text-chrome-1">{lead.service}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.12em] text-muted">City</dt>
                  <dd className="text-chrome-1">{lead.city}</dd>
                </div>
                {lead.vehicle && (
                  <div className="col-span-2">
                    <dt className="text-xs uppercase tracking-[0.12em] text-muted">Vehicle</dt>
                    <dd className="text-chrome-1">{lead.vehicle}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-4 rounded-xl bg-ink/60 p-4 whitespace-pre-wrap text-chrome-2 [overflow-wrap:anywhere]">{lead.message}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a href={`tel:+1${lead.phone.replace(/\D/g, "").slice(-10)}`} className={buttonClass("primary", "sm", "w-full")}>
                  <span className="btn-label">
                    <Phone aria-hidden="true" className="size-4" />
                    {lead.phone}
                  </span>
                </a>
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className={buttonClass("ghost", "sm", "w-full min-w-0")}>
                    <span className="btn-label min-w-0">
                      <Mail aria-hidden="true" className="size-4 shrink-0" />
                      <span className="truncate">Email</span>
                    </span>
                  </a>
                ) : (
                  <span className="self-center text-sm text-muted">No email given</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      <ConfirmDialog
        open={deleting !== null}
        title={deleting === "all" ? "Delete all leads?" : "Delete this lead?"}
        confirmLabel={deleting === "all" ? "Delete all" : "Delete"}
        typeToConfirm={deleting === "all" ? "DELETE" : undefined}
        busy={busy}
        onClose={() => !busy && setDeleting(null)}
        onConfirm={confirmDelete}
      >
        <p>
          {deleting === "all"
            ? `Every lead in the database${leads ? ` (${leads.length} shown)` : ""} will be deleted right away.`
            : deleting && `The message from ${deleting.name} will be deleted right away.`}{" "}
          <strong>This can&rsquo;t be undone.</strong>
        </p>
      </ConfirmDialog>
    </section>
  );
}

function LeadsSignIn({ onSignedIn }: { onSignedIn: (email: string) => void }) {
  const [form, setForm] = useState({ password: "", remember: false });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const session = await signInLeads(leadsAdminEmail, form.password, form.remember);
      onSignedIn(session.email);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <section aria-labelledby="leads-signin-heading">
      <TabHeading
        id="leads-signin-heading"
        title="Leads"
        text="Couldn't open the leads with your admin password. If the leads account has a different password, enter it here."
      />
      <form onSubmit={submit} className={`${panelClass} grid max-w-lg gap-5 p-5 md:p-7`}>
        {error && <Notice tone="error">{error}</Notice>}
        <Field label="Password">
          {(props) => (
            <input
              {...props}
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}
        </Field>
        <label className="flex min-h-11 items-center gap-3 text-chrome-2">
          <input type="checkbox" className="size-5 accent-[var(--red)]" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
          Keep me signed in on this device
        </label>
        <button type="submit" disabled={busy} className={buttonClass("primary", "lg")}>
          <span className="btn-label">
            {busy && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
            Sign in
          </span>
        </button>
      </form>
    </section>
  );
}

function LeadsSetup() {
  return (
    <section aria-labelledby="leads-setup-heading">
      <TabHeading
        id="leads-setup-heading"
        title="Leads"
        text="Lead storage isn't switched on yet. Until it is, contact-form messages only arrive by email."
      />
      <div className={`${panelClass} max-w-3xl p-5 md:p-7`}>
        <h3 className="display text-lg">Switch it on (about 5 minutes, free)</h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-chrome-2 marker:text-muted">
          <li>
            Create a free project at{" "}
            <a href="https://console.firebase.google.com/" target="_blank" rel="noopener" className="font-semibold text-fg underline underline-offset-4">
              console.firebase.google.com
            </a>
            .
          </li>
          <li>In Build → Firestore Database, create a database (production mode).</li>
          <li>
            In Build → Authentication, turn on Email/Password and add a user with the email <code className="text-fg">{leadsAdminEmail}</code>{" "}
            and the same password as your admin login. Copy its User UID.
          </li>
          <li>
            In Firestore → Rules, paste the rules from <code className="text-fg">firebase/firestore.rules</code> in the repository, with your
            User UID filled in, and publish.
          </li>
          <li>
            In Project settings, copy the Web API key and Project ID. Add them on GitHub as repository variables{" "}
            <code className="text-fg">FIREBASE_API_KEY</code> and <code className="text-fg">FIREBASE_PROJECT_ID</code>, then redeploy.
          </li>
        </ol>
        <p className="mt-4 text-sm text-muted">The README in the repository has the same steps in more detail.</p>
      </div>
    </section>
  );
}
