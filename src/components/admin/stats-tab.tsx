"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type { Stat } from "@/content/site";
import { ConfirmDialog, EmptyState, Field, TabHeading, iconButtonClass, panelClass } from "./admin-ui";
import type { Editor } from "./business-tab";

export function statErrors(stat: Stat) {
  return {
    value: stat.value.trim() ? undefined : "Enter the number.",
    label: stat.label.trim() ? undefined : "Say what it counts.",
  };
}

export function StatsTab({ data, update }: Editor) {
  const [confirmAll, setConfirmAll] = useState(false);
  const setStat = (index: number, change: Partial<Stat>) =>
    update((d) => ({ ...d, stats: d.stats.map((s, i) => (i === index ? { ...s, ...change } : s)) }));
  const remove = (index: number) => update((d) => ({ ...d, stats: d.stats.filter((_, i) => i !== index) }));

  return (
    <section aria-labelledby="stats-tab-heading">
      <TabHeading
        id="stats-tab-heading"
        title="Stats"
        text={"Big numbers on the About page, such as “1,200+ cars rekeyed”. Only add numbers you can back up."}
      >
        <button type="button" onClick={() => update((d) => ({ ...d, stats: [...d.stats, { value: "", label: "" }] }))} className={buttonClass("primary", "md")}>
          <span className="btn-label">
            <Plus aria-hidden="true" className="size-5" />
            Add stat
          </span>
        </button>
        {data.stats.length > 0 && (
          <button type="button" onClick={() => setConfirmAll(true)} className={buttonClass("ghost", "md")}>
            <span className="btn-label">
              <Trash2 aria-hidden="true" className="size-5" />
              Delete all
            </span>
          </button>
        )}
      </TabHeading>

      {data.stats.length === 0 ? (
        <EmptyState>No stats. The stats section is hidden on the About page until you add one.</EmptyState>
      ) : (
        <ol className="grid gap-4 md:grid-cols-2">
          {data.stats.map((stat, i) => {
            const errors = statErrors(stat);
            return (
              <li key={i} className={`${panelClass} flex items-start gap-3 p-5`}>
                <div className="grid flex-1 grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
                  <Field label="Number" error={errors.value}>
                    {(props) => <input {...props} placeholder="1,200+" value={stat.value} onChange={(e) => setStat(i, { value: e.target.value })} />}
                  </Field>
                  <Field label="What it counts" error={errors.label}>
                    {(props) => <input {...props} placeholder="Cars rekeyed" value={stat.label} onChange={(e) => setStat(i, { label: e.target.value })} />}
                  </Field>
                </div>
                <button type="button" onClick={() => remove(i)} className={`${iconButtonClass} mt-8`} aria-label="Delete stat">
                  <Trash2 aria-hidden="true" className="size-5" />
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <ConfirmDialog
        open={confirmAll}
        title="Delete all stats?"
        confirmLabel="Delete all"
        typeToConfirm="DELETE"
        onClose={() => setConfirmAll(false)}
        onConfirm={() => {
          update((d) => ({ ...d, stats: [] }));
          setConfirmAll(false);
        }}
      >
        <p>
          {data.stats.length === 1 ? "The stat" : `All ${data.stats.length} stats`} will be removed when you press <strong>Save</strong>. Until then, <strong>Discard</strong> brings
          them back.
        </p>
      </ConfirmDialog>
    </section>
  );
}
