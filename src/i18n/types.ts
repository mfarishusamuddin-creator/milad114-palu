import type { CalendarHighlight } from "@/data/calendar-highlights";
import type { Milestone } from "@/data/milestones";
import type { QuizQuestion } from "@/data/quiz";

export type LanguageCode = "id" | "en" | "ar";
export type Direction = "ltr" | "rtl";
export type Accent = "navy" | "teal" | "gold";
export type RegionKey = "africa" | "asia" | "europe" | "americas" | "oceania";

export type NavLink = {
  href: string;
  label: string;
};

export type GateItem = {
  number: string;
  label: string;
  title: string;
  description: string;
  href: string;
  accent: Accent;
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

export type QuizBadge = {
  min: number;
  title: string;
  description: string;
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
    source: string;
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
  };
  hero: {
    edition: string;
    eventLine: string;
    dateLine: string;
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    intro: string;
    ctaPrimary: string;
    ctaSecondary: string;
    share: string;
    shareText: string;
    languageLine: string;
    plate: {
      identity: string;
      city: string;
      logoAlt: string;
      caption: string;
      statLeft: string;
      statCenter: string;
      statRight: string;
      stampTop: string;
      stampBottom: string;
    };
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
    wita: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  gates: {
    eyebrow: string;
    title: string;
    description: string;
    open: string;
    items: GateItem[];
  };
  tree: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    legend: GateItem[];
    annotations: {
      kanopi: string;
      akar: string;
      batang: string;
    };
    stampTop: string;
    stampBottom: string;
    caption: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    paragraphs: string[];
    facts: FactItem[];
    quote: string;
    link: string;
  };
  agenda: {
    eyebrow: string;
    title: string;
    description: string;
    items: AgendaItem[];
    button: string;
  };
  history: {
    eyebrow: string;
    title: string;
    description: string;
    mapEyebrow: string;
    source: string;
    verified: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    chapters: Milestone[];
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
    quizTitle: string;
    quizDescription: string;
    sourceTitle: string;
    sourceDescription: string;
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
    source: string;
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
    source: string;
    sourceNote: string;
    originalNote: string;
    empty: string;
    read: string;
    tabs: {
      latest: string;
      milad: string;
    };
  };
  quiz: {
    eyebrow: string;
    title: string;
    description: string;
    startTitle: string;
    startDescription: string;
    tags: string[];
    startButton: string;
    best: string;
    bestShort: string;
    questionOf: string;
    correct: string;
    wrong: string;
    source: string;
    next: string;
    seeResult: string;
    choose: string;
    resultEyebrow: string;
    resultBest: string;
    share: string;
    shareText: string;
    retry: string;
    readHistory: string;
    badges: QuizBadge[];
    questions: QuizQuestion[];
  };
  map: {
    eyebrow: string;
    title: string;
    description: string;
    count: string;
    note: string;
    source: string;
    aria: string;
    countryList: string;
    cityLabel: string;
    regions: Record<RegionKey, string>;
  };
  footer: {
    tagline: string;
    explore: string;
    sources: string;
    event: string;
    eventLines: string[];
    credit: string;
    copyright: string;
    dataNote: string;
    language: string;
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
