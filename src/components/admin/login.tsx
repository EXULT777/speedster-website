"use client";

import { LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { buttonClass } from "@/components/ui/button";
import { Field, Notice, panelClass } from "./admin-ui";
import { checkToken, repo, saveFile } from "./github";
import { lockToken, serializeVault, unlockToken, vaultPath, type Vault } from "./vault";

/** Passwords shorter than this are refused when setting one. */
export const MIN_PASSWORD = 8;

export function passwordProblem(password: string, confirm: string) {
  if (password.length < MIN_PASSWORD) return `Use at least ${MIN_PASSWORD} characters.`;
  if (password !== confirm) return "The two passwords don't match.";
  return "";
}

function RememberBox({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex min-h-11 items-center gap-3 text-chrome-2">
      <input type="checkbox" className="size-5 accent-[var(--red)]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      Keep me signed in on this device
    </label>
  );
}

export function Login({
  vault,
  error,
  onLogin,
  onReset,
}: {
  vault: Vault;
  error: string;
  onLogin: (githubToken: string, username: string, password: string, remember: boolean) => Promise<void>;
  onReset: () => void;
}) {
  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(error);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const token = await unlockToken(vault, form.username, form.password);
      await onLogin(token, form.username, form.password, form.remember);
    } catch (e) {
      setMessage((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className={`${panelClass} mx-auto grid max-w-md gap-5 p-5 md:p-8`}>
      <h1 className="display text-2xl md:text-3xl">Sign in</h1>
      {message && <Notice tone="error">{message}</Notice>}
      <Field label="Username">
        {(props) => (
          <input
            {...props}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        )}
      </Field>
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
      <RememberBox checked={form.remember} onChange={(remember) => setForm({ ...form, remember })} />
      <button type="submit" disabled={busy} className={buttonClass("primary", "lg")}>
        <span className="btn-label">
          {busy && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
          {busy ? "Signing in…" : "Sign in"}
        </span>
      </button>
      {/github/i.test(message) && (
        <button type="button" onClick={onReset} className="min-h-11 text-sm font-semibold text-muted underline underline-offset-4 hover:text-fg">
          GitHub key expired or deleted? Set up again
        </button>
      )}
    </form>
  );
}

/**
 * One-time setup: choose the username and password and paste a GitHub token.
 * The token is saved encrypted with them (see vault.ts). Also used to replace
 * an expired token.
 */
export function Setup({
  again,
  onCancel,
  onDone,
}: {
  again: boolean;
  onCancel?: () => void;
  onDone: (githubToken: string, username: string, password: string) => Promise<void>;
}) {
  const [form, setForm] = useState({ username: "Admin", password: "", confirm: "", token: "" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const problem = !form.username.trim() ? "Choose a username." : passwordProblem(form.password, form.confirm);
    if (problem) return setMessage(problem);
    setBusy(true);
    setMessage("");
    try {
      const token = form.token.trim();
      await checkToken(token);
      const vault = await lockToken(form.username, form.password, token);
      await saveFile(token, vaultPath, serializeVault(vault), "Admin: set up admin sign-in");
      await onDone(token, form.username, form.password);
    } catch (e) {
      setMessage((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={submit} className={`${panelClass} grid content-start gap-5 p-5 md:p-8`}>
        <div>
          <h1 className="display text-2xl md:text-3xl">{again ? "Set up again" : "One-time setup"}</h1>
          <p className="mt-2 text-chrome-2">
            Choose the username and password you&rsquo;ll sign in with, and paste a GitHub key once. After this you only need the
            username and password.
          </p>
        </div>
        {message && <Notice tone="error">{message}</Notice>}
        <Field label="Username">
          {(props) => <input {...props} autoComplete="username" autoCapitalize="none" spellCheck={false} value={form.username} onChange={set("username")} />}
        </Field>
        <Field label="Password" hint="Long and hard to guess. Anyone who guesses it can change your website.">
          {(props) => <input {...props} type="password" autoComplete="new-password" value={form.password} onChange={set("password")} />}
        </Field>
        <Field label="Password again">
          {(props) => <input {...props} type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} />}
        </Field>
        <Field label="GitHub key (token)">
          {(props) => (
            <input {...props} type="password" autoComplete="off" spellCheck={false} placeholder="github_pat_…" value={form.token} onChange={set("token")} />
          )}
        </Field>
        <button type="submit" disabled={busy} className={buttonClass("primary", "lg")}>
          <span className="btn-label">
            {busy && <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />}
            {busy ? "Saving…" : "Save and sign in"}
          </span>
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="min-h-11 text-sm font-semibold text-muted underline underline-offset-4 hover:text-fg">
            Back to sign in
          </button>
        )}
      </form>

      <div className={`${panelClass} bg-transparent p-5 md:p-8`}>
        <h2 className="display text-lg md:text-xl">Get the GitHub key</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-chrome-2 marker:text-muted">
          <li>
            Open{" "}
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noopener"
              className="font-semibold text-fg underline underline-offset-4"
            >
              GitHub → New fine-grained token
            </a>{" "}
            while signed in as {repo.owner}.
          </li>
          <li>
            Name it &ldquo;Speedster admin&rdquo;. For Expiration, choose <strong className="text-fg">No expiration</strong> or the longest
            option.
          </li>
          <li>
            Under Repository access, choose <strong className="text-fg">Only select repositories</strong> →{" "}
            <strong className="text-fg">{repo.name}</strong>.
          </li>
          <li>
            Under Permissions → Repository permissions, set <strong className="text-fg">Contents</strong> to{" "}
            <strong className="text-fg">Read and write</strong> and <strong className="text-fg">Actions</strong> to{" "}
            <strong className="text-fg">Read-only</strong>.
          </li>
          <li>Generate it, copy it and paste it here. You won&rsquo;t need it again.</li>
        </ol>
        <p className="mt-4 text-sm text-muted">
          The key is saved in the website&rsquo;s files locked with your username and password, so signing in can unlock it. The password
          itself is never saved.
        </p>
      </div>
    </div>
  );
}
