"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

type ImageUploadProps = {
  label: string;
  hasImage: boolean;
  previewUrl?: string | null;
  previewName?: string;
  statusMessage?: string;
  onFilesSelected?: (files: File[]) => void;
  onRemove?: () => void;
};

function UploadDropzone({
  label,
  multiple,
  onFilesSelected,
}: {
  label: string;
  multiple?: boolean;
  onFilesSelected?: (files: File[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    onFilesSelected?.(Array.from(files));
  }

  return (
    <label
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-colors duration-300",
        isDragging
          ? "border-neutral-400 bg-background"
          : "border-border bg-[#f3f1ed]/60 hover:border-neutral-400",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
    >
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-2 text-xs text-muted">or click to browse</p>
    </label>
  );
}

export function ImageUpload({
  label,
  hasImage,
  previewUrl,
  previewName = "Current image",
  statusMessage,
  onFilesSelected,
  onRemove,
}: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-sm font-medium tracking-[-0.01em] text-foreground">
          {label}
        </p>
        {statusMessage ? (
          <p className="text-xs text-muted">{statusMessage}</p>
        ) : null}
      </div>

      {hasImage ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <div className="relative aspect-[16/10] bg-[#f3f1ed]/60">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={previewName}
                  fill
                  className="object-cover"
                  unoptimized={previewUrl.startsWith("blob:")}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">
                  Image saved. Preview unavailable.
                </div>
              )}
            </div>
            <p className="border-t border-border px-4 py-3 text-sm text-muted">
              {previewName}
            </p>
          </div>

          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-4 py-3 text-sm font-medium tracking-[-0.01em] text-foreground transition-colors duration-300 hover:border-neutral-400 hover:bg-[#f3f1ed]/60"
            >
              Remove image
            </button>
          ) : null}

          <UploadDropzone
            label="Drag and drop a replacement image here"
            onFilesSelected={onFilesSelected}
          />
        </div>
      ) : (
        <UploadDropzone
          label="Drag and drop an image here"
          onFilesSelected={onFilesSelected}
        />
      )}
    </div>
  );
}
