/** Current year, captured into the static page at build time. */
export function CopyrightYear() {
  return <>{new Date().getFullYear()}</>;
}
