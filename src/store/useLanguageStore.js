import { create } from "zustand";

const STORAGE_KEY = "portfolio-language";

function getInitialLanguage() {
  if (typeof window === "undefined") return "vi";
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
}

export const useLanguageStore = create((set) => ({
  language: getInitialLanguage(),
  setLanguage: (language) => {
    const next = language === "en" ? "en" : "vi";
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The language still changes for this visit when storage is unavailable.
    }
    set({ language: next });
  },
}));
