import { nativeImage, type NativeImage } from "electron";

/**
 * Build a 32×32 tray icon at runtime — avoids shipping a PNG in the skeleton.
 * Replace with a designed icon later.
 */
export function makeTrayIcon(): NativeImage {
  const size = 32;
  const buffer = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const onBorder = x < 2 || y < 2 || x >= size - 2 || y >= size - 2;
      const r = onBorder ? 60 : 250;
      const g = onBorder ? 60 : 220;
      const b = onBorder ? 60 : 80;
      // BGRA byte order is what nativeImage.createFromBitmap expects on Windows.
      buffer[i] = b;
      buffer[i + 1] = g;
      buffer[i + 2] = r;
      buffer[i + 3] = 255;
    }
  }
  return nativeImage.createFromBitmap(buffer, { width: size, height: size });
}
