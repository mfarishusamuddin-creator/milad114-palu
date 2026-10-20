const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
};

const SHORT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
};

const DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
};

export function formatDateID(value: string, locale = "id-ID"): string {
  return new Intl.DateTimeFormat(locale, DATE_OPTIONS).format(new Date(value));
}

export function formatDateShortID(value: string, locale = "id-ID"): string {
  return new Intl.DateTimeFormat(locale, SHORT_DATE_OPTIONS).format(
    new Date(value)
  );
}

export function formatDateTimeID(value: string, locale = "id-ID"): string {
  return new Intl.DateTimeFormat(locale, DATE_TIME_OPTIONS).format(
    new Date(value)
  );
}
