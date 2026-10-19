/**
 * Contact-form leads, stored in a Firebase Firestore database so the owner can
 * read them on /admin. Talks to Firestore's REST API directly (no Firebase SDK).
 * Turned on by NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID;
 * without them the site works as before and saves nothing.
 *
 * The database's security rules (firebase/firestore.rules) let anyone add a
 * lead but only the owner's account read or delete one.
 */

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
};

/**
 * The Firebase Authentication user that owns the leads. The /admin sign-in
 * signs in to Firebase as this user with the same password as the admin login.
 */
export const leadsAdminEmail = "speedsterlock@gmail.com";

export const leadsEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  city: string;
  service: string;
  vehicle?: string;
  message: string;
};

export type Lead = LeadInput & { id: string; createdAt: string };

/** Adds one lead. Throws if the database refuses it. */
export async function saveLead(lead: LeadInput) {
  const fields: Record<string, { stringValue: string } | { timestampValue: string }> = {
    createdAt: { timestampValue: new Date().toISOString() },
  };
  for (const [key, value] of Object.entries(lead)) if (value) fields[key] = { stringValue: value };
  const response = await fetch(`${firestoreUrl}/leads?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  if (!response.ok) throw new Error("The database refused the message");
}
