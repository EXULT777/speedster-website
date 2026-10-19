"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type { Review } from "@/content/site";
import { ConfirmDialog, EmptyState, Field, TabHeading, iconButtonClass, panelClass } from "./admin-ui";
import type { Editor } from "./business-tab";

export function reviewErrors(review: Review) {
  return {
    author: review.author.trim() ? undefined : "Enter the customer's name.",
    text: review.text.trim() ? undefined : "Enter what the customer said.",
  };
}

const today = () => new Date().toLocaleDateString("en-CA");

export function ReviewsTab({ data, update }: Editor) {
  const [confirmAll, setConfirmAll] = useState(false);
  const setReview = (index: number, change: Partial<Review>) =>
    update((d) => ({ ...d, reviews: d.reviews.map((r, i) => (i === index ? { ...r, ...change } : r)) }));
  const remove = (index: number) => update((d) => ({ ...d, reviews: d.reviews.filter((_, i) => i !== index) }));
  const add = () => update((d) => ({ ...d, reviews: [{ author: "", text: "", rating: 5, date: today() }, ...d.reviews] }));

  return (
    <section aria-labelledby="reviews-tab-heading">
      <TabHeading
        id="reviews-tab-heading"
        title="Reviews"
        text="Real customer reviews only. They scroll across the home page, newest first, and the star average is worked out from them."
      >
        <button type="button" onClick={add} className={buttonClass("primary", "md")}>
          <span className="btn-label">
            <Plus aria-hidden="true" className="size-5" />
            Add review
          </span>
        </button>
        {data.reviews.length > 0 && (
          <button type="button" onClick={() => setConfirmAll(true)} className={buttonClass("ghost", "md")}>
            <span className="btn-label">
              <Trash2 aria-hidden="true" className="size-5" />
              Delete all
            </span>
          </button>
        )}
      </TabHeading>

      {data.reviews.length === 0 ? (
        <EmptyState>No reviews. The reviews section is hidden on the site until you add one.</EmptyState>
      ) : (
        <ol className="grid gap-4 lg:grid-cols-2">
          {data.reviews.map((review, i) => {
            const errors = reviewErrors(review);
            return (
              <li key={i} className={`${panelClass} grid grid-cols-2 gap-x-4 gap-y-5 p-5 md:p-6`}>
                <div className="col-span-2 flex items-start gap-3">
                  <Field label="Customer name" error={errors.author} className="flex-1">
                    {(props) => <input {...props} value={review.author} onChange={(e) => setReview(i, { author: e.target.value })} />}
                  </Field>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className={`${iconButtonClass} mt-8`}
                    aria-label={`Delete review${review.author ? ` from ${review.author}` : ""}`}
                  >
                    <Trash2 aria-hidden="true" className="size-5" />
                  </button>
                </div>
                <Field label="Stars">
                  {(props) => (
                    <select
                      {...props}
                      value={review.rating ?? ""}
                      onChange={(e) => setReview(i, { rating: e.target.value ? Number(e.target.value) : undefined })}
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {"★".repeat(n)} {n}
                        </option>
                      ))}
                      <option value="">No rating</option>
                    </select>
                  )}
                </Field>
                <Field label="Date">
                  {(props) => (
                    <input {...props} type="date" value={review.date ?? ""} onChange={(e) => setReview(i, { date: e.target.value || undefined })} />
                  )}
                </Field>
                <Field label="Review" error={errors.text} className="col-span-2">
                  {(props) => <textarea {...props} rows={4} value={review.text} onChange={(e) => setReview(i, { text: e.target.value })} />}
                </Field>
                <Field label="Where it came from" hint="Optional, e.g. Google." className="col-span-2">
                  {(props) => (
                    <input {...props} value={review.source ?? ""} onChange={(e) => setReview(i, { source: e.target.value || undefined })} />
                  )}
                </Field>
              </li>
            );
          })}
        </ol>
      )}

      <ConfirmDialog
        open={confirmAll}
        title="Delete all reviews?"
        confirmLabel="Delete all"
        typeToConfirm="DELETE"
        onClose={() => setConfirmAll(false)}
        onConfirm={() => {
          update((d) => ({ ...d, reviews: [] }));
          setConfirmAll(false);
        }}
      >
        <p>
          {data.reviews.length === 1 ? "The review" : `All ${data.reviews.length} reviews`} will be removed. Nothing changes on the website until you press <strong>Save</strong>, and
          until then <strong>Discard</strong> brings them back.
        </p>
      </ConfirmDialog>
    </section>
  );
}
