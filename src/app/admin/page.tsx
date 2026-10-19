import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

// Private editing page for the owner. Not linked anywhere, kept out of search
// results and the sitemap; nothing works without the owner's GitHub token.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
