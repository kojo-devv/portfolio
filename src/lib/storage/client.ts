"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadFileClient(
  bucket: "project-images" | "site-assets",
  folder: string,
  file: File,
): Promise<string> {
  const supabase = createClient();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
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
