/**
 * i18n bootstrap. Initializes i18next synchronously with the device locale,
 * then asynchronously checks AsyncStorage for a user override and switches if
 * present. UI may flash briefly between system and saved language on first
 * paint — acceptable for an MVP.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { ru } from "./ru";

export type AppLocale = "en" | "ru";
export type LocaleSetting = AppLocale | "system";

const STORAGE_KEY = "kekkeys.locale";

function deviceLocale(): AppLocale {
  const sys = getLocales()?.[0]?.languageCode;
  return sys === "ru" ? "ru" : "en";
}

void i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: deviceLocale(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  // Force the i18next compatibility v3 plurals — RN bundles work without
  // ICU plural-rules for free that way.
  compatibilityJSON: "v4",
});

void (async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ru") {
      if (i18next.language !== saved) await i18next.changeLanguage(saved);
    }
  } catch {
    /* ignore */
  }
})();

export async function setAppLocale(locale: LocaleSetting): Promise<void> {
  if (locale === "system") {
    await AsyncStorage.removeItem(STORAGE_KEY);
    await i18next.changeLanguage(deviceLocale());
  } else {
    await AsyncStorage.setItem(STORAGE_KEY, locale);
    await i18next.changeLanguage(locale);
  }
}

export async function getSavedLocale(): Promise<LocaleSetting> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ru") return saved;
  } catch {
    /* ignore */
  }
  return "system";
}

export { default as i18n } from "i18next";
