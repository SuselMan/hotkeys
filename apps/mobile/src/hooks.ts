import { useEffect } from "react";
import { BackHandler } from "react-native";

/**
 * Treat the Android hardware/gesture back as "close this modal" — the screen
 * provides its own dismiss callback. Without this, modals routed via App.tsx
 * state would let the back press escape and close the whole app.
 */
export function useBackHandler(onBack: () => void): void {
  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onBack();
      return true;
    });
    return () => sub.remove();
  }, [onBack]);
}
