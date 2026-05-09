import { app, nativeImage, type NativeImage } from "electron";
import path from "node:path";

/**
 * Tray icon loaded from the bundled brand PNG. `app.getAppPath()` resolves to
 * the project root in dev and to the asar root in a packaged build, so the
 * same `icons/...` lookup works in both. 96×96 is the smallest non-tiny PNG
 * realfavicongenerator emits — Windows downsamples it to 32×32 for the tray
 * with reasonable sharpness on both 100% and 200% DPI.
 */
export function makeTrayIcon(): NativeImage {
  const iconPath = path.join(app.getAppPath(), "icons", "favicon-96x96.png");
  return nativeImage.createFromPath(iconPath);
}
