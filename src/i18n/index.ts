import { ar } from "./ar";
import { en } from "./en";
import { id } from "./id";
import type { Dictionary, LanguageCode } from "./types";

export const dictionaries: Record<LanguageCode, Dictionary> = { id, en, ar };
export const languages: LanguageCode[] = ["id", "en", "ar"];
export const defaultLanguage: LanguageCode = "id";

export function isLanguage(value: string): value is LanguageCode {
  return value === "id" || value === "en" || value === "ar";
}

export function getDictionary(lang: string): Dictionary {
  return isLanguage(lang) ? dictionaries[lang] : dictionaries[defaultLanguage];
}

export function languagePath(lang: LanguageCode, hash = ""): string {
  const base = lang === "id" ? "/" : `/${lang}`;
  return `${base}${hash}`;
}

export function aboutPath(lang: LanguageCode): string {
  return lang === "id" ? "/tentang" : `/${lang}/tentang`;
}
