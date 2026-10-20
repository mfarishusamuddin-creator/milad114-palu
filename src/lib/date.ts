const DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

export function formatDateID(value: string): string {
  return DATE_FORMATTER.format(new Date(value));
}

export function formatDateShortID(value: string): string {
  return SHORT_DATE_FORMATTER.format(new Date(value));
}

export function formatDateTimeID(value: string): string {
  return DATE_TIME_FORMATTER.format(new Date(value));
}
