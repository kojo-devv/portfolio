import {
  HERO_IMAGE_MAX_LONG_EDGE,
  HERO_IMAGE_MAX_ORIGINAL_BYTES,
  HERO_IMAGE_MAX_UPLOAD_BYTES,
  HERO_IMAGE_TARGET_BYTES,
  HERO_IMAGE_TYPES,
  formatBytes,
  type HeroImageMime,
} from "@/lib/images/constants";

export class HeroImageError extends Error {
  constructor(
    message: string,
    readonly code:
      | "unsupported_type"
      | "file_too_large"
      | "invalid_image"
      | "prepare_failed",
  ) {
    super(message);
    this.name = "HeroImageError";
  }
}

export type PreparedHeroImage = {
  file: File;
  optimized: boolean;
  width: number;
  height: number;
};

function extensionForMime(mime: HeroImageMime): string {
  return HERO_IMAGE_TYPES[mime];
}

async function readMagicBytes(file: File): Promise<Uint8Array> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  return new Uint8Array(buffer);
}

function detectMime(bytes: Uint8Array): HeroImageMime | null {

  const isJpeg =
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff;
  const isPng =
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const isWebp =
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;

  if (isJpeg) {
    return "image/jpeg";
  }

  if (isPng) {
    return "image/png";
  }

  if (isWebp) {
    return "image/webp";
  }

  return null;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new HeroImageError("This file could not be read as an image.", "invalid_image"));
    image.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: HeroImageMime,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new HeroImageError(
              "The image could not be processed in the browser.",
              "prepare_failed",
            ),
          );
          return;
        }

        resolve(blob);
      },
      mime,
      quality,
    );
  });
}

export async function inspectHeroImageFile(file: File): Promise<{
  mimeType: HeroImageMime;
  width: number;
  height: number;
  previewUrl: string;
}> {
  if (file.size > HERO_IMAGE_MAX_ORIGINAL_BYTES) {
    throw new HeroImageError(
      `This file is ${formatBytes(file.size)}. Please choose an image smaller than ${formatBytes(HERO_IMAGE_MAX_ORIGINAL_BYTES)} before uploading.`,
      "file_too_large",
    );
  }

  const magic = await readMagicBytes(file);
  const mimeType = detectMime(magic);

  if (!mimeType) {
    throw new HeroImageError(
      "Unsupported file type. Please upload a JPG, PNG, or WebP image.",
      "unsupported_type",
    );
  }

  const previewUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(previewUrl);

    return {
      mimeType,
      width: image.naturalWidth,
      height: image.naturalHeight,
      previewUrl,
    };
  } catch (error) {
    URL.revokeObjectURL(previewUrl);
    throw error;
  }
}

export async function prepareHeroImageForUpload(
  file: File,
  mimeType: HeroImageMime,
): Promise<{ file: File; optimized: boolean; width: number; height: number }> {
  const previewUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(previewUrl);
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const longEdge = Math.max(width, height);
    const needsResize = longEdge > HERO_IMAGE_MAX_LONG_EDGE;
    const needsCompress = file.size > HERO_IMAGE_TARGET_BYTES;

    if (!needsResize && !needsCompress && file.size <= HERO_IMAGE_MAX_UPLOAD_BYTES) {
      return { file, optimized: false, width, height };
    }

    const scale = needsResize ? HERO_IMAGE_MAX_LONG_EDGE / longEdge : 1;
    const outputWidth = Math.max(1, Math.round(width * scale));
    const outputHeight = Math.max(1, Math.round(height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      throw new HeroImageError(
        "The image could not be processed in the browser.",
        "prepare_failed",
      );
    }

    context.drawImage(image, 0, 0, outputWidth, outputHeight);

    const outputMime: HeroImageMime =
      mimeType === "image/png" && needsCompress ? "image/jpeg" : mimeType;
    const qualities = outputMime === "image/png" ? [1] : [0.9, 0.84, 0.78];

    let blob: Blob | null = null;

    for (const quality of qualities) {
      blob = await canvasToBlob(canvas, outputMime, quality);
      if (blob.size <= HERO_IMAGE_MAX_UPLOAD_BYTES) {
        if (blob.size <= HERO_IMAGE_TARGET_BYTES || quality === qualities.at(-1)) {
          break;
        }
      }
    }

    if (!blob) {
      throw new HeroImageError(
        "The image could not be processed in the browser.",
        "prepare_failed",
      );
    }

    if (blob.size > HERO_IMAGE_MAX_UPLOAD_BYTES) {
      throw new HeroImageError(
        `This image is still ${formatBytes(blob.size)} after optimization. The upload limit is ${formatBytes(HERO_IMAGE_MAX_UPLOAD_BYTES)}.`,
        "file_too_large",
      );
    }

    const nextName = `${file.name.replace(/\.[^.]+$/, "")}.${extensionForMime(outputMime)}`;
    const nextFile = new File([blob], nextName, { type: outputMime });

    return {
      file: nextFile,
      optimized: true,
      width: outputWidth,
      height: outputHeight,
    };
  } finally {
    URL.revokeObjectURL(previewUrl);
  }
}
