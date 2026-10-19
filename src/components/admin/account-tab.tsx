"use client";

import { LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { leadsEnabled } from "@/lib/leads";
import { Field, Notice, TabHeading, panelClass } from "./admin-ui";
import { changeLeadsPassword, storedSession } from "./firebase";
import { saveFile } from "./github";
import { passwordProblem } from "./login";
import { USER_KEY, readStored } from "./storage";
import { lockToken, serializeVault, vaultPath } from "./vault";

/** Changes the admin password (and the leads account's, so they stay the same). */
export function AccountTab({ token }: { token: string }) {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const username = readStored(USER_KEY) ?? "Admin";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const problem = passwordProblem(form.password, form.confirm);
    if (problem) return setResult({ tone: "error", text: problem });
    setBusy(true);
    setResult(null);
    try {
      const vault = await lockToken(username, form.password, token);
      await saveFile(token, vaultPath, serializeVault(vault), "Admin: change admin password");
      let leadsNote = "";
      if (leadsEnabled && storedSession()) {
        await changeLeadsPassword(form.password).catch(() => {
          leadsNote = " The leads account kept its old password; change it in the Firebase console.";
        });
      }
      setForm({ password: "", confirm: "" });
      setResult({
        tone: "success",
        text: `Password changed. The new one works once the website finishes updating (about 1–2 minutes); until then, use the old one.${leadsNote}`,
      });
    } catch (e) {
      setResult({ tone: "error", text: (e as Error).message });
    }
    setBusy(false);
  };

  return (
    <section aria-labelledby="account-tab-heading">
      <TabHeading id="account-tab-heading" title="Password" text={`You're signed in as ${username}.`} />
      <form onSubmit={submit} className={`${panelClass} grid max-w-lg gap-5 p-5 md:p-7`}>
        {result && <Notice tone={result.tone}>{result.text}</Notice>}
        <Field label="New password" hint="Long and hard to guess. Anyone who guesses it can change your website.">
          {(props) => (
            <input {...props} type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          )}
        </Field>
        <Field label="New password again">
          {(props) => (
            <input {...props} type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          )}
        </Field>
        <button type="submit" disabled={busy} className={buttonClass("primary", "lg")}>
          <span className="btn-label">
            {busy && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
            Change password
          </span>
        </button>
      </form>
    </section>
  );
}
