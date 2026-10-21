export type TimezoneOption = {
  value: string;
  abbr: string;
  label: string;
};

export const DEFAULT_TIMEZONE = "Asia/Makassar";

export const TIMEZONES: TimezoneOption[] = [
  { value: "Asia/Makassar", abbr: "WITA", label: "WITA — Asia/Makassar" },
  { value: "Asia/Jakarta", abbr: "WIB", label: "WIB — Asia/Jakarta" },
  { value: "Asia/Jayapura", abbr: "WIT", label: "WIT — Asia/Jayapura" },
  { value: "UTC", abbr: "UTC", label: "UTC" },
  { value: "Africa/Maputo", abbr: "CAT", label: "CAT — Central Africa Time" },
  { value: "Asia/Singapore", abbr: "SGT", label: "SGT — Asia/Singapore" },
  { value: "Asia/Tokyo", abbr: "JST", label: "JST — Asia/Tokyo" },
  { value: "Australia/Sydney", abbr: "AEST", label: "AEST/AEDT — Australia/Sydney" },
  { value: "Europe/London", abbr: "GMT/BST", label: "GMT/BST — Europe/London" },
  { value: "Europe/Paris", abbr: "CET/CEST", label: "CET/CEST — Europe/Paris" },
  { value: "America/New_York", abbr: "ET", label: "ET/EDT — America/New_York" },
  { value: "America/Los_Angeles", abbr: "PT", label: "PT/PDT — America/Los_Angeles" },
];
