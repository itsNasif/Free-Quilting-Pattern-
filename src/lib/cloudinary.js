// ─────────────────────────────────────────────────────────────────────
// QuiltHaven · Cloudinary media access
// ─────────────────────────────────────────────────────────────────────

import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary with environment variables (with fallback defaults).
 */
export function configureCloudinary() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    "dhb3zk9tq";
  const apiKey =
    process.env.CLOUDINARY_API_KEY || "327125195615864";
  const apiSecret =
    process.env.CLOUDINARY_API_SECRET || "zV_77Fqrhiy7wQOugixa1osMJDg";

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return Boolean(cloudName && apiKey && apiSecret);
}

export function isCloudinaryConfigured() {
  return configureCloudinary();
}

/**
 * Upload an image file (File, Blob, Buffer, or Data URL) to Cloudinary.
 * @param {File|Blob|Buffer|string} fileOrBuffer
 * @param {object} options
 * @returns {Promise<{ ok: boolean, url?: string, public_id?: string, error?: string }>}
 */
export async function uploadImageToCloudinary(fileOrBuffer, options = {}) {
  try {
    configureCloudinary();

    // Direct Base64 string upload
    if (typeof fileOrBuffer === "string" && fileOrBuffer.startsWith("data:")) {
      const res = await cloudinary.uploader.upload(fileOrBuffer, {
        folder: options.folder || "quilthaven/avatars",
        transformation: options.transformation || [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto", fetch_format: "auto" },
        ],
        ...options,
      });
      return {
        ok: true,
        url: res.secure_url,
        public_id: res.public_id,
        width: res.width,
        height: res.height,
      };
    }

    // Convert Web File / Blob to Buffer
    let buffer;
    if (
      fileOrBuffer instanceof Blob ||
      (typeof fileOrBuffer === "object" &&
        typeof fileOrBuffer.arrayBuffer === "function")
    ) {
      const arrayBuffer = await fileOrBuffer.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else if (Buffer.isBuffer(fileOrBuffer)) {
      buffer = fileOrBuffer;
    } else {
      return { ok: false, error: "Invalid file format for upload." };
    }

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || "quilthaven/avatars",
          transformation: options.transformation || [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
          ...options,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve({
              ok: false,
              error: error.message || "Failed to upload image to Cloudinary.",
            });
          } else {
            resolve({
              ok: true,
              url: result.secure_url,
              public_id: result.public_id,
              width: result.width,
              height: result.height,
            });
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (err) {
    console.error("uploadImageToCloudinary caught error:", err);
    return { ok: false, error: err.message || "An unexpected error occurred during image upload." };
  }
}

export { cloudinary };
