import { calendarHighlightsEn } from "@/data/calendar-highlights.en";
import { milestonesEn } from "@/data/milestones.en";
import type { Dictionary } from "./types";

const hijriMonths: Record<string, string> = {
  Muharam: "Muharram",
  Safar: "Safar",
  Rabiulawal: "Rabi al-Awwal",
  Rabiulakhir: "Rabi al-Thani",
  Jumadilawal: "Jumada al-Awwal",
  Jumadilakhir: "Jumada al-Thani",
  Rajab: "Rajab",
  Syakban: "Sha'ban",
  Ramadan: "Ramadan",
  Syawal: "Shawwal",
  Zulkaidah: "Dhu al-Qi'dah",
  Zulhijah: "Dhu al-Hijjah",
};

const gregorianMonths: Record<string, string> = {
  Januari: "January",
  Februari: "February",
  Maret: "March",
  April: "April",
  Mei: "May",
  Juni: "June",
  Juli: "July",
  Agustus: "August",
  September: "September",
  Oktober: "October",
  November: "November",
  Desember: "December",
};

const gregorianMonthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const en: Dictionary = {
  lang: "en",
  dir: "ltr",
  locale: "en-GB",
  meta: {
    title: "Tanwir and the 114th Milad of Muhammadiyah — Together, Unite the Nation",
    description:
      "An interactive site for Tanwir and the 114th Milad of Muhammadiyah. Palu, 19–21 November 2026 CE | 10–12 Jumada al-Thani 1448 AH. A 114-year trail, the KHGT calendar, official news, and a global map.",
    tagline: "Together, Unite the Nation",
  },
  common: {
    source: "Source",
    read: "Read",
    open: "Open",
    verified: "Verified",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    skipToContent: "Skip to content",
    skipIntro: "Skip intro",
  },
  nav: {
    links: [
      { href: "#jelajah", label: "Explore" },
      { href: "#sejarah", label: "History" },
      { href: "#layanan", label: "Services" },
      { href: "#peta", label: "Map" },
    ],
    cta: "Explore the Trail",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    language: "Language",
    themeLight: "Light mode",
    themeDark: "Dark mode",
    themeToggle: "Change theme",
  },
  hero: {
    edition: "Edition 114 · Palu 2026",
    eventLine: "Tanwir & the 114th Milad of Muhammadiyah",
    dateLine: "19–21 Nov 2026 · 10–12 Jumada al-Thani 1448 AH",
    eyebrow: "Tanwir & the 114th Milad of Muhammadiyah",
    titleLine1: "Together",
    titleLine2: "Unite the Nation",
    subtitle: "Tanwir and the 114th Milad of Muhammadiyah",
    intro:
      "For 114 years Muhammadiyah has grown from Kauman into a sheltering tree. Scroll through its trail, then open three directions: History, Services, and Map.",
    ctaPrimary: "Explore 114 Years",
    ctaSecondary: "Open Services",
    share: "Share",
    shareText:
      "Tanwir and the 114th Milad of Muhammadiyah — Together, Unite the Nation. Palu, 19–21 November 2026.",
    languageLine: "Read in",
    plate: {
      identity: "Official identity",
      city: "Palu 2026",
      logoAlt:
        "Official logo of Tanwir and the 114th Milad of Muhammadiyah — Together, Unite the Nation, Palu 19–21 November 2026",
      caption: "Official logo · Tanwir & the 114th Milad",
      statLeft: "Root 1912",
      statCenter: "Canopy 2026",
      statRight: "114 years",
      stampTop: "114",
      stampBottom: "years",
    },
  },
  countdown: {
    beforeLabel: "Towards Tanwir & the Milad",
    duringLabel: "Tanwir & the Milad are underway",
    miladLabel: "Towards the 114th Milad",
    doneLabel: "The 114th Milad has passed",
    beforeNote: "Palu · 19–21 November 2026",
    duringNote: "Palu · 19–21 November 2026",
    miladNote: "18 November 2026",
    doneNote: "Thank you for exploring",
    wita: "WITA",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  gates: {
    eyebrow: "Explore index",
    title: "One tree, three directions",
    description:
      "Choose the part you want to open. Each direction leads to one part of the same tree.",
    open: "Open",
    items: [
      {
        number: "01",
        label: "Root",
        title: "114-Year Trail",
        description:
          "From Kauman in 1912 to Palu in 2026, told in six connected chapters.",
        href: "#sejarah",
        accent: "teal",
      },
      {
        number: "02",
        label: "Trunk",
        title: "Muhammadiyah Services",
        description:
          "The KHGT calendar and official news in one service desk.",
        href: "#layanan",
        accent: "navy",
      },
      {
        number: "03",
        label: "Canopy",
        title: "Global Reach",
        description:
          "A map of 29 Special Branch Leaderships of Muhammadiyah around the world.",
        href: "#peta",
        accent: "gold",
      },
    ],
  },
  tree: {
    eyebrow: "One tree",
    titleLine1: "Growing from",
    titleLine2: "the same root.",
    description:
      "The root holds history. The trunk supports services. The canopy embraces a global reach. These three branches are three directions you can open.",
    legend: [
      {
        number: "01",
        label: "Root",
        title: "114-Year Trail",
        description: "A long history from Kauman to Palu.",
        href: "#sejarah",
        accent: "teal",
      },
      {
        number: "02",
        label: "Trunk",
        title: "Muhammadiyah Services",
        description: "Calendar and news.",
        href: "#layanan",
        accent: "navy",
      },
      {
        number: "03",
        label: "Canopy",
        title: "Global Reach",
        description: "29 PCIM across five regions.",
        href: "#peta",
        accent: "gold",
      },
    ],
    annotations: {
      kanopi: "Canopy — Global Map",
      akar: "Root — History",
      batang: "Trunk — Services",
    },
    stampTop: "114",
    stampBottom: "years",
    caption:
      "The tree illustration is generated with the space colonisation algorithm (Runions et al., 2007), reimplemented for this project.",
  },
  about: {
    eyebrow: "About the Milad",
    title: "Growing from a single leaf",
    description:
      "The Tanwir and 114th Milad logo combines moringa leaves with the number 114. Moringa is not merely decorative: it grows in Palu, withstands weather, and offers benefits.",
    paragraphs: [
      "The theme “Together, Unite the Nation” calls for togetherness directed toward justice, prosperity, welfare, morality, knowledge, and technology. It is linked to Quran 49:10 and 49:13.",
      "As part of the programme, the committee planted 114 moringa trees in Palu. The number 114 meets root, trunk, and canopy: a long journey that remains grounded in benefit.",
    ],
    facts: [
      { label: "Host city", value: "Palu, Central Sulawesi" },
      { label: "Dates", value: "19–21 November 2026" },
      { label: "Hijri", value: "10–12 Jumada al-Thani 1448 AH" },
      { label: "Symbol", value: "Moringa leaf & the number 114" },
    ],
    quote:
      "Moringa was chosen because it is strong, simple, and useful. It grows in Palu and becomes a symbol of resilience.",
    link: "Read the logo meaning",
  },
  agenda: {
    eyebrow: "Agenda",
    title: "Three markers in time",
    description:
      "The event dates, the historic date, and the next direction. Detailed schedules follow PP Muhammadiyah Circular No. 19/EDR/I.0/B/2026.",
    items: [
      {
        date: "19–21 Nov 2026",
        title: "Tanwir and the 114th Milad",
        description:
          "Palu, Central Sulawesi. The main Tanwir and Milad programme, corresponding to 10–12 Jumada al-Thani 1448 AH.",
        tag: "Palu",
      },
      {
        date: "18 Nov 2026",
        title: "114th Muhammadiyah Milad",
        description:
          "The historic Milad, commemorating the founding of Muhammadiyah on 18 November 1912 / 8 Dhu al-Hijjah 1330 AH.",
        tag: "Milad",
      },
      {
        date: "2027",
        title: "49th Muktamar",
        description:
          "Medan, North Sumatra. Tanwir 2026 is a forum for evaluation and preparation ahead of the Muktamar.",
        tag: "2027",
      },
    ],
    button: "Open the Circular",
  },
  history: {
    eyebrow: "Root",
    title: "114-Year Trail",
    description:
      "From a living room in Kauman to a canopy that shelters Palu. Six chapters trace Muhammadiyah's root, trunk, and canopy, with official sources at every step.",
    mapEyebrow: "Journey map",
    source: "Source",
    verified: "Verified",
    ctaEyebrow: "Onward from the root",
    ctaTitle: "This tree has a trunk that supports services.",
    ctaDescription:
      "Open the KHGT calendar and official Muhammadiyah news in the Services section.",
    ctaButton: "Open Services",
    chapters: milestonesEn,
  },
  services: {
    eyebrow: "Trunk",
    title: "Muhammadiyah Services",
    description:
      "Two services support the tree: the official KHGT calendar and the latest news from Muhammadiyah.",
    calendarTitle: "Global Unified Hijri Calendar",
    calendarDescription:
      "Calendar data is synchronised from KHGT. Month views, special days, and the Gregorian–Hijri converter use an official snapshot, not a generic library.",
    highlightsTitle: "Milad Markers",
    highlightsLink: "Open KHGT",
    kabarTitle: "Official Muhammadiyah News",
    kabarDescription:
      "Pulled from Muhammadiyah's official channel, cached for one hour, with a snapshot fallback. Full articles remain at the original source.",
    sourceTitle: "Source notes",
    sourceDescription:
      "The calendar comes from KHGT; news comes from Muhammadiyah's official channel. If official data cannot load, the page shows the latest snapshot and a link to the source.",
  },
  calendar: {
    locale: "en-GB",
    hijriTab: "KHGT Hijri",
    masehiTab: "Gregorian",
    fullCalendar: "View the full calendar on KHGT",
    prev: "Previous month",
    next: "Next month",
    specialDays: "Special days",
    noSpecial: "No special days in this month.",
    converter: "Date converter",
    masehiLabel: "Gregorian date",
    masehiButton: "Find Hijri",
    hijriMonthLabel: "Hijri month",
    hijriDayLabel: "Day",
    hijriYearLabel: "Year",
    hijriButton: "Find Gregorian",
    placeholder: "Choose a date to see its Gregorian–Hijri equivalent.",
    notFound: "Date not found in the 2026 KHGT snapshot.",
    source: "Source",
    snapshot: "snapshot",
    disclaimer: "This calendar is not a replacement for the official KHGT calendar.",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    hijriMonths,
    gregorianMonths,
    gregorianMonthList,
    eventNames: {
      "Ayyamul Bidh": "Ayyamul Bidh",
      "Hari Tasua": "Tasua",
      "Hari Asyuro": "Ashura",
      "Hari Tahun baru Islam (Hijriah)": "Islamic New Year",
      "Hari Tahun Baru Islam (Hijriah)": "Islamic New Year",
    },
    miladLabel: "Milad",
  },
  kabar: {
    eyebrow: "News",
    title: "News from Muhammadiyah",
    description:
      "The latest news from Muhammadiyah's official channel. Brief summaries, with links to the original source.",
    all: "View all news",
    source: "Source",
    sourceNote: "data refreshes automatically with a one-hour cache.",
    originalNote:
      "Titles and summaries come from the official source; the original text is in Indonesian.",
    empty:
      "Official news is currently unavailable. Open muhammadiyah.or.id directly.",
    read: "Read on muhammadiyah.or.id",
    tabs: {
      latest: "Latest",
      milad: "Milad & Tanwir",
    },
  },
  map: {
    eyebrow: "Canopy",
    title: "Muhammadiyah Around the World",
    description:
      "Muhammadiyah did not grow only in Indonesia. 29 Special Branch Leaderships are spread across Africa, Asia, Europe, the Americas, and Oceania.",
    count: "29 Special Branch Leaderships",
    note: "The world map uses Natural Earth data. Dots mark PCIM hub cities; country borders are for orientation only.",
    source: "Source",
    aria: "World map highlighting the 29 countries of Muhammadiyah PCIM.",
    countryList: "PCIM countries",
    cityLabel: "City",
    regions: {
      africa: "Africa",
      asia: "Asia",
      europe: "Europe",
      americas: "Americas",
      oceania: "Oceania",
    },
  },
  footer: {
    tagline:
      "One tree, three directions: History, Services, and Map. Built as an independent entry for a website competition.",
    explore: "Explore",
    sources: "Official sources",
    event: "114th Milad",
    eventLines: [
      "Palu, Central Sulawesi",
      "19–21 November 2026",
      "10–12 Jumada al-Thani 1448 AH",
    ],
    credit:
      "Logo and visual identity belong to PP Muhammadiyah. El Messiri and Familjen Grotesk are licensed under the OFL.",
    copyright: "© 2026 Milad 114 — an independent website competition entry.",
    dataNote:
      "Calendar data: KHGT. News data: muhammadiyah.or.id. Verified again before publication.",
    language: "Language",
  },
  notFound: {
    title: "This door is not on the tree yet.",
    description:
      "Return home, explore the 114-year trail, or open Muhammadiyah services.",
    home: "Back to the Milad",
    history: "114-Year Trail",
    services: "Services",
  },
  highlights: calendarHighlightsEn,
};
