/**
 * Runs a small script synchronously during HTML parsing, before first paint.
 * On the client it becomes inert text/plain so React does not warn about
 * rendering a script tag (see Next.js "Preventing flash before hydration").
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
