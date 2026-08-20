"use client";

import { createClient } from "@/lib/supabase/client";
import { getStorageUploadErrorMessage } from "@/lib/storage/errors";

type UploadOptions = {
  contentType?: string;
};

export async function uploadFileClient(
  bucket: "project-images" | "site-assets",
  folder: string,
  file: File,
  options?: UploadOptions,
): Promise<string> {
  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: options?.contentType ?? file.type,
    cacheControl: "3600",
  });

  if (error) {
    throw new Error(getStorageUploadErrorMessage(error));
  }

  return path;
}

export async function uploadFilesClient(
  bucket: "project-images" | "site-assets",
  folder: string,
  files: File[],
): Promise<string[]> {
  return Promise.all(
    files.map((file) => uploadFileClient(bucket, folder, file)),
  );
}
