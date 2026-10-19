"use client";

import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { buttonClass } from "@/components/ui/button";
import type { Photo } from "@/content/site";
import { ConfirmDialog, EmptyState, Field, Notice, TabHeading, iconButtonClass, panelClass } from "./admin-ui";
import type { Editor } from "./business-tab";

export type PendingPhoto = { base64: string; url: string };

/** Longest side of an uploaded photo, in pixels. Bigger pictures are scaled down before upload. */
const MAX_SIDE = 2000;

export function photoErrors(photo: Photo) {
  return { alt: photo.alt.trim() ? undefined : "Describe the photo for people who can't see it." };
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "photo"
  );
}

/** Resizes and re-encodes a picked image as JPEG (also drops camera location data). */
async function prepare(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode failed"))), "image/jpeg", 0.85),
  );
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.readAsDataURL(blob);
  });
  return { base64, url: URL.createObjectURL(blob), width, height };
}

export function PhotosTab({
  data,
  update,
  addPending,
  previewUrl,
}: Editor & { addPending: (src: string, photo: PendingPhoto) => void; previewUrl: (src: string) => string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmAll, setConfirmAll] = useState(false);

  const setPhoto = (index: number, change: Partial<Photo>) =>
    update((d) => ({ ...d, photos: d.photos.map((p, i) => (i === index ? { ...p, ...change } : p)) }));
  const remove = (index: number) => update((d) => ({ ...d, photos: d.photos.filter((_, i) => i !== index) }));
  const move = (index: number, by: number) =>
    update((d) => {
      const photos = [...d.photos];
      const [photo] = photos.splice(index, 1);
      photos.splice(index + by, 0, photo);
      return { ...d, photos };
    });

  const onPick = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    const added: Photo[] = [];
    for (const file of Array.from(files)) {
      try {
        const prepared = await prepare(file);
        const src = `/photos/${slugify(file.name)}-${Date.now().toString(36)}${added.length}.jpg`;
        addPending(src, { base64: prepared.base64, url: prepared.url });
        added.push({ src, alt: "", width: prepared.width, height: prepared.height });
      } catch {
        setError(`"${file.name}" couldn't be read. Try a JPEG or PNG photo.`);
      }
    }
    update((d) => ({ ...d, photos: [...d.photos, ...added] }));
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section aria-labelledby="photos-tab-heading">
      <TabHeading
        id="photos-tab-heading"
        title="Photos"
        text="Real photos of you, your team or your van. They show on the About page in this order. Large photos are resized automatically."
      >
        <button type="button" onClick={() => inputRef.current?.click()} disabled={busy} className={buttonClass("primary", "md")}>
          <span className="btn-label">
            {busy ? <LoaderCircle aria-hidden="true" className="size-5 animate-spin" /> : <ImagePlus aria-hidden="true" className="size-5" />}
            {busy ? "Preparing…" : "Add photos"}
          </span>
        </button>
        {data.photos.length > 0 && (
          <button type="button" onClick={() => setConfirmAll(true)} className={buttonClass("ghost", "md")}>
            <span className="btn-label">
              <Trash2 aria-hidden="true" className="size-5" />
              Delete all
            </span>
          </button>
        )}
      </TabHeading>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => onPick(e.target.files)} />

      {error && (
        <div className="mb-4">
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      {data.photos.length === 0 ? (
        <EmptyState>No photos. The photo section is hidden on the About page until you add one.</EmptyState>
      ) : (
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.photos.map((photo, i) => {
            const errors = photoErrors(photo);
            return (
              <li key={photo.src} className={`${panelClass} overflow-hidden`}>
                {/* eslint-disable-next-line @next/next/no-img-element -- previews come from the repository or a local file, not the site's image pipeline */}
                <img
                  src={previewUrl(photo.src)}
                  alt=""
                  width={photo.width}
                  height={photo.height}
                  className="aspect-[4/3] w-full bg-ink object-cover"
                />
                <div className="grid gap-4 p-4 md:p-5">
                  <Field label="Description (alt text)" error={errors.alt} hint="e.g. Our service van parked outside a home in Midland">
                    {(props) => <input {...props} value={photo.alt} onChange={(e) => setPhoto(i, { alt: e.target.value })} />}
                  </Field>
                  <Field label="Caption" hint="Optional. Shown under the photo.">
                    {(props) => (
                      <input {...props} value={photo.caption ?? ""} onChange={(e) => setPhoto(i, { caption: e.target.value || undefined })} />
                    )}
                  </Field>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className={iconButtonClass} aria-label="Move earlier">
                      <ArrowUp aria-hidden="true" className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === data.photos.length - 1}
                      className={iconButtonClass}
                      aria-label="Move later"
                    >
                      <ArrowDown aria-hidden="true" className="size-5" />
                    </button>
                    <button type="button" onClick={() => remove(i)} className={`${iconButtonClass} ml-auto`} aria-label="Delete photo">
                      <Trash2 aria-hidden="true" className="size-5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <ConfirmDialog
        open={confirmAll}
        title="Delete all photos?"
        confirmLabel="Delete all"
        typeToConfirm="DELETE"
        onClose={() => setConfirmAll(false)}
        onConfirm={() => {
          update((d) => ({ ...d, photos: [] }));
          setConfirmAll(false);
        }}
      >
        <p>
          {data.photos.length === 1 ? "The photo" : `All ${data.photos.length} photos`} will be removed from the site and {data.photos.length === 1 ? "its file" : "their files"} deleted when you press <strong>Save</strong>.
          Until then, <strong>Discard</strong> brings {data.photos.length === 1 ? "it" : "them"} back.
        </p>
      </ConfirmDialog>
    </section>
  );
}
