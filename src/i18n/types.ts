import type { CalendarHighlight } from "@/data/calendar-highlights";
import type { HistoryContent } from "@/data/history";
import type { SITE } from "@/data/site";

export type LanguageCode = "id" | "en" | "ar";
export type Direction = "ltr" | "rtl";

export type NavLink = {
  href: string;
  label: string;
};

export type FactItem = {
  label: string;
  value: string;
};

export type AgendaItem = {
  date: string;
  title: string;
  description: string;
  tag: string;
};

export type CalendarMonthMap = Record<string, string>;

export type Dictionary = {
  lang: LanguageCode;
  dir: Direction;
  locale: string;
  meta: {
    title: string;
    description: string;
    tagline: string;
  };
  common: {
    read: string;
    open: string;
    verified: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    skipToContent: string;
    skipIntro: string;
  };
  nav: {
    links: NavLink[];
    cta: string;
    menuOpen: string;
    menuClose: string;
    language: string;
    themeLight: string;
    themeDark: string;
    themeToggle: string;
    brand: string;
    home: string;
    menuAria: string;
    about: string;
    cards: Array<{
      label: string;
      description: string;
      links: Array<{
        label: string;
        anchor?: string;
        about?: boolean;
      }>;
    }>;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    intro: string;
    ctaPrimary: string;
    ctaSecondary: string;
    share: string;
    shareText: string;
  };
  countdown: {
    beforeLabel: string;
    duringLabel: string;
    miladLabel: string;
    doneLabel: string;
    beforeNote: string;
    duringNote: string;
    miladNote: string;
    doneNote: string;
    timezone: string;
    targetTime: string;
    modeToggle: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    ramadhan: {
      beforeLabel: string;
      beforeNote: string;
      farewell1448Label: string;
      farewell1448Note: string;
      before1449Label: string;
      before1449Note: string;
      farewell1449Label: string;
      farewell1449Note: string;
      doneLabel: string;
      doneNote: string;
    };
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    paragraphs: string[];
    facts: FactItem[];
    quote: string;
  };
  agenda: {
    eyebrow: string;
    title: string;
    items: AgendaItem[];
  };
  history: {
    eyebrow: string;
    title: string;
    description: string;
    tablesShow: string;
    tablesHide: string;
    content: HistoryContent;
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    calendarTitle: string;
    calendarDescription: string;
    highlightsTitle: string;
    highlightsLink: string;
    kabarTitle: string;
    kabarDescription: string;
    closingLogoAlt: string;
  };
  calendar: {
    locale: string;
    hijriTab: string;
    masehiTab: string;
    fullCalendar: string;
    prev: string;
    next: string;
    specialDays: string;
    noSpecial: string;
    converter: string;
    masehiLabel: string;
    masehiButton: string;
    hijriMonthLabel: string;
    hijriDayLabel: string;
    hijriYearLabel: string;
    hijriButton: string;
    placeholder: string;
    notFound: string;
    snapshot: string;
    disclaimer: string;
    weekdays: string[];
    hijriMonths: CalendarMonthMap;
    gregorianMonths: CalendarMonthMap;
    gregorianMonthList: string[];
    eventNames: CalendarMonthMap;
    miladLabel: string;
  };
  kabar: {
    eyebrow: string;
    title: string;
    description: string;
    all: string;
    originalNote: string;
    empty: string;
    read: string;
    tabs: {
      latest: string;
      milad: string;
    };
  };
  map: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
    aria: string;
    countries: string;
    hq: string;
    info: string;
  };
  footer: {
    tagline: string;
    explore: string;
  };
  aboutPage: {
    eyebrow: string;
    title: string;
    intro: string;
    disclaimer: string;
    sourcesTitle: string;
    sources: Array<{ label: string; link: keyof typeof SITE.links }>;
    assetsTitle: string;
    assets: string[];
    copyright: string;
    researchTitle: string;
    research: string;
    dataNoteTitle: string;
    dataNote: string;
  };
  notFound: {
    title: string;
    description: string;
    home: string;
    history: string;
    services: string;
  };
  highlights: CalendarHighlight[];
};
