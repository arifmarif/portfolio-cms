"use client";
import { useSyncExternalStore } from "react";

export type Locale = "id" | "en";

const LOCALE_STORAGE_KEY = "locale";

// Shared client-side locale store: persisted in localStorage, defaults to "id".
const localeStore = {
  listeners: new Set<() => void>(),
  subscribe(listener: () => void) {
    localeStore.listeners.add(listener);
    return () => {
      localeStore.listeners.delete(listener);
    };
  },
  getSnapshot(): Locale {
    try {
      return localStorage.getItem(LOCALE_STORAGE_KEY) === "en" ? "en" : "id";
    } catch {
      return "id";
    }
  },
  getServerSnapshot(): Locale {
    return "id";
  },
  set(locale: Locale) {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Ignore unavailable storage (private mode); locale still applies in-memory.
    }
    for (const listener of localeStore.listeners) listener();
  },
};

export function useLocale(): [Locale, (locale: Locale) => void] {
  const locale = useSyncExternalStore(localeStore.subscribe, localeStore.getSnapshot, localeStore.getServerSnapshot);
  return [locale, localeStore.set];
}
