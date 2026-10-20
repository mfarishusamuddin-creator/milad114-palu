"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const EVENT = "m114:theme";

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem("m114:theme", theme);
  } catch {
    // localStorage may be unavailable.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function toggleTheme(theme: Theme) {
  setTheme(theme === "dark" ? "light" : "dark");
}
