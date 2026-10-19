/**
 * Owner sign-in (Firebase Authentication, email + password) and reading or
 * deleting contact-form leads in Firestore, over the REST APIs. The security
 * rules in firebase/firestore.rules only let the owner's account do this.
 */

import { firebaseConfig, firestoreUrl, type Lead } from "@/lib/leads";
import { clearStored, readStored, rewriteStored, writeStored } from "./storage";

const SESSION_KEY = "speedster-admin-firebase";

type Session = { email: string; idToken: string; refreshToken: string; expiresAt: number };

export class LeadsError extends Error {}

export function storedSession(): Session | null {
  const raw = readStored(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function signOutLeads() {
  clearStored(SESSION_KEY);
}

export async function signInLeads(email: string, password: string, remember: boolean) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  }).catch(() => null);
  if (!response) throw new LeadsError("Couldn't reach Firebase. Check your internet connection and try again.");
  const result = (await response.json().catch(() => null)) as
    | { idToken: string; refreshToken: string; expiresIn: string; email: string }
    | { error?: { message?: string } }
    | null;
  if (!response.ok || !result || !("idToken" in result)) {
    const code = (result && "error" in result && result.error?.message) || "";
    if (/INVALID_LOGIN_CREDENTIALS|INVALID_PASSWORD|EMAIL_NOT_FOUND|INVALID_EMAIL/.test(code))
      throw new LeadsError("That email and password don't match the admin account.");
    if (code.startsWith("TOO_MANY_ATTEMPTS")) throw new LeadsError("Too many attempts. Wait a few minutes and try again.");
    throw new LeadsError(`Firebase couldn't sign you in${code ? ` (${code})` : ""}.`);
  }
  const session: Session = {
    email: result.email,
    idToken: result.idToken,
    refreshToken: result.refreshToken,
    expiresAt: Date.now() + Number(result.expiresIn) * 1000,
  };
  writeStored(SESSION_KEY, JSON.stringify(session), remember);
  return session;
}

/** Changes the Firebase user's password, keeping it the same as the /admin password. */
export async function changeLeadsPassword(password: string) {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: await idToken(), password, returnSecureToken: true }),
  }).catch(() => null);
  const result = (await response?.json().catch(() => null)) as { idToken?: string; refreshToken?: string; expiresIn?: string } | null;
  if (!response?.ok || !result?.idToken) throw new LeadsError("Firebase didn't accept the new password.");
  const session = storedSession()!;
  rewriteStored(
    SESSION_KEY,
    JSON.stringify({ ...session, idToken: result.idToken, refreshToken: result.refreshToken, expiresAt: Date.now() + Number(result.expiresIn) * 1000 }),
  );
}

/** A current ID token, refreshed when it is about to expire (they last an hour). */
async function idToken() {
  const session = storedSession();
  if (!session) throw new LeadsError("Please sign in again.");
  if (session.expiresAt - Date.now() > 60_000) return session.idToken;
  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: session.refreshToken }),
  }).catch(() => null);
  if (!response?.ok) {
    signOutLeads();
    throw new LeadsError("Your sign-in expired. Please sign in again.");
  }
  const result = (await response.json()) as { id_token: string; refresh_token: string; expires_in: string };
  const next: Session = {
    ...session,
    idToken: result.id_token,
    refreshToken: result.refresh_token,
    expiresAt: Date.now() + Number(result.expires_in) * 1000,
  };
  rewriteStored(SESSION_KEY, JSON.stringify(next));
  return next.idToken;
}

async function firestore<T>(url: string, init: { method: string; body?: unknown }): Promise<T> {
  const response = await fetch(url, {
    method: init.method,
    headers: { Authorization: `Bearer ${await idToken()}`, "Content-Type": "application/json" },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  }).catch(() => null);
  if (!response) throw new LeadsError("Couldn't reach Firebase. Check your internet connection and try again.");
  if (response.status === 403)
    throw new LeadsError("Firebase refused access. Check that your User UID is pasted into the Firestore rules (see README).");
  if (!response.ok) throw new LeadsError(`Firebase returned an error (${response.status}).`);
  return (await response.json()) as T;
}

type FirestoreDoc = { name: string; fields: Record<string, { stringValue?: string; timestampValue?: string }> };

/** Full resource name of a lead, needed to delete it. */
const leadNames = new Map<string, string>();

/** All leads, newest first. */
export async function listLeads(): Promise<Lead[]> {
  const rows = await firestore<{ document?: FirestoreDoc }[]>(`${firestoreUrl}:runQuery`, {
    method: "POST",
    body: {
      structuredQuery: {
        from: [{ collectionId: "leads" }],
        orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
      },
    },
  });
  return rows.flatMap(({ document: doc }) => {
    if (!doc) return [];
    const id = doc.name.split("/").pop()!;
    leadNames.set(id, doc.name);
    const text = (key: string) => doc.fields[key]?.stringValue ?? "";
    return [
      {
        id,
        createdAt: doc.fields.createdAt?.timestampValue ?? "",
        name: text("name"),
        phone: text("phone"),
        email: text("email") || undefined,
        city: text("city"),
        service: text("service"),
        vehicle: text("vehicle") || undefined,
        message: text("message"),
      },
    ];
  });
}

/** Deletes leads by id, up to 500 per request. */
export async function deleteLeads(ids: string[]) {
  for (let i = 0; i < ids.length; i += 500) {
    const writes = ids.slice(i, i + 500).map((id) => ({ delete: leadNames.get(id) }));
    await firestore(`${firestoreUrl}:commit`, { method: "POST", body: { writes } });
  }
}

/** Deletes every lead in the database, including any that arrived after the list was loaded. */
export async function deleteAllLeads() {
  const leads = await listLeads();
  await deleteLeads(leads.map((lead) => lead.id));
  return leads.length;
}
