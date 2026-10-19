"use client";

import { CircleAlert, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/** A plain panel. Not `.card`, which animates in on scroll on phones. */
export const panelClass = "rounded-2xl border border-white/10 bg-graphite";

/** Small square-ish buttons for row actions (move, delete). */
export const iconButtonClass =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/12 text-chrome-2 transition-colors hover:border-white/30 hover:text-fg disabled:pointer-events-none disabled:opacity-35";

export function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: (props: { id: string; "aria-invalid"?: true; "aria-describedby"?: string; className: string }) => ReactNode;
}) {
  const id = useId();
  const noteId = `${id}-note`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-chrome-1">
        {label}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error || hint ? noteId : undefined,
        className: "form-control",
      })}
      {error ? (
        <p id={noteId} className="flex items-start gap-1.5 text-sm text-red-glow">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={noteId} className="text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function TabHeading({ id, title, text, children }: { id: string; title: string; text?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-7">
      <div className="max-w-2xl">
        <h2 id={id} className="display text-2xl md:text-3xl">
          {title}
        </h2>
        {text && <p className="mt-2 text-chrome-2">{text}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-3">{children}</div>}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-[0.9375rem]",
        tone === "error" && "border-red-glow/50 bg-red/10 text-fg",
        tone === "success" && "border-chrome-3/50 bg-white/8 text-fg",
        tone === "info" && "border-white/12 bg-white/4 text-chrome-2",
      )}
    >
      {children}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className={cn(panelClass, "border-dashed bg-transparent p-8 text-center text-muted")}>{children}</p>;
}

/**
 * Confirmation dialog. With `typeToConfirm`, the confirm button only works
 * once that word is typed, for deletes that empty a whole section.
 */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  typeToConfirm,
  busy,
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  typeToConfirm?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputId = useId();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setTyped("");
      dialog.showModal();
    } else if (!open && dialog.open) dialog.close();
  }, [open]);

  const ready = !typeToConfirm || typed.trim() === typeToConfirm;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={(event) => busy && event.preventDefault()}
      className={cn(
        panelClass,
        "m-auto w-[min(32rem,calc(100%-2rem))] p-0 text-fg backdrop:bg-black/70 backdrop:backdrop-blur-sm",
      )}
    >
      <form
        method="dialog"
        className="p-5 md:p-7"
        onSubmit={(event) => {
          event.preventDefault();
          if (ready && !busy) onConfirm();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="display text-xl md:text-2xl">{title}</h2>
          <button type="button" onClick={onClose} disabled={busy} className={iconButtonClass} aria-label="Close">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <div className="mt-3 space-y-3 text-chrome-2">{children}</div>
        {typeToConfirm && (
          <div className="mt-5 flex flex-col gap-2">
            <label htmlFor={inputId} className="text-[0.9375rem] font-semibold text-chrome-1">
              Type {typeToConfirm} to confirm
            </label>
            <input
              id={inputId}
              className="form-control"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
            />
          </div>
        )}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} disabled={busy} className={buttonClass("ghost", "md", "w-full")}>
            <span className="btn-label">Cancel</span>
          </button>
          <button type="submit" disabled={!ready || busy} className={buttonClass("primary", "md", "w-full disabled:opacity-45")}>
            <span className="btn-label">{busy ? "Working…" : confirmLabel}</span>
          </button>
        </div>
      </form>
    </dialog>
  );
}
