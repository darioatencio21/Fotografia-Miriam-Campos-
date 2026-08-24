export interface PreparedImage {
  file: File;
  width: number;
  height: number;
}

const MAX_DIMENSION = 2000;
const WEBP_QUALITY = 0.82;

/**
 * Optimiza una foto antes de subirla: redimensiona al lado mayor máximo
 * (2000 px), re-codifica a WebP y descarta metadatos (EXIF/GPS).
 * Si el navegador no puede decodificarla o el resultado pesa más que el
 * original, se envía el archivo tal cual.
 */
export async function prepareUploadImage(file: File): Promise<PreparedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return { file, width: 0, height: 0 };
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  if (scale === 1 && file.type === 'image/webp') {
    bitmap.close();
    return { file, width, height };
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return { file, width, height };
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY)
  );
  if (!blob || blob.size >= file.size) {
    return { file, width, height };
  }

  const name = `${file.name.replace(/\.[^.]+$/, '')}.webp`;
  return { file: new File([blob], name, { type: 'image/webp' }), width, height };
}
