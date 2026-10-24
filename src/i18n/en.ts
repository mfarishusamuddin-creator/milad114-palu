import { calendarHighlightsEn } from "@/data/calendar-highlights.en";
import { historyEn } from "@/data/history.en";
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
      "An interactive site for Tanwir and the 114th Milad of Muhammadiyah. Palu, 19–21 November 2026 CE | 10–12 Jumada al-Thani 1448 AH. Two historical tracks, the KHGT calendar, official news, and a global PCIM map.",
    tagline: "Together, Unite the Nation",
  },
  common: {
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
    menuOpen: "Open menu",
    menuClose: "Close menu",
    language: "Language",
    themeLight: "Light mode",
    themeDark: "Dark mode",
    themeToggle: "Change theme",
    brand: "Milad 114 Muhammadiyah",
    home: "Home",
    menuAria: "Primary navigation",
    about: "About",
    cards: [
      {
        label: "Tracks & Meaning",
        description:
          "Two historical tracks and the meaning of the Tanwir & Milad logo.",
        links: [
          { label: "Tracks & Meaning", anchor: "#sejarah" },
          { label: "Logo Meaning", anchor: "#tentang" },
          { label: "Agenda", anchor: "#agenda" },
        ],
      },
      {
        label: "Services",
        description: "KHGT calendar, official news, the PCIM map, and daily counters.",
        links: [
          { label: "KHGT calendar", anchor: "#layanan" },
          { label: "Muhammadiyah news", anchor: "#kabar" },
          { label: "PCIM map", anchor: "#peta" },
          { label: "Tanwir & Ramadan counter", anchor: "#countdown" },
        ],
      },
      {
        label: "Settings",
        description: "Language, theme, and About this site.",
        links: [],
      },
    ],
  },
  hero: {
    titleLine1: "Together",
    titleLine2: "Unite the Nation",
    subtitle: "Tanwir and the 114th Milad of Muhammadiyah",
    intro:
      "One hundred and fourteen years. From Kauman in 1912 to Palu in 2026 — the digital home of the Tanwir and 114th Milad of Muhammadiyah. Explore two historical tracks, the agenda, the world map, and its official services.",
    ctaPrimary: "Explore 114 Years",
    ctaSecondary: "Open Services",
    share: "Share",
    shareText:
      "Tanwir and the 114th Milad of Muhammadiyah — Together, Unite the Nation. Palu, 19–21 November 2026.",
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
    timezone: "Time zone",
    targetTime: "Target time",
    modeToggle: "Switch the countdown mode: Tanwir & the Milad, or Ramadan.",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    ramadhan: {
      beforeLabel: "Towards Ramadan",
      beforeNote:
        "1 Ramadan 1448 AH: 8 February 2027. Counting to sunset on 7 February 2027, 18:00 WITA (approximate sunset; dates follow KHGT).",
      farewell1448Label: "Towards the Ramadan farewell",
      farewell1448Note:
        "1 Shawwal 1448 AH: 9 March 2027. Counting to sunset on 8 March 2027, 18:00 WITA (approximate sunset; dates follow KHGT).",
      before1449Label: "Towards Ramadan 1449",
      before1449Note:
        "1 Ramadan 1449 AH: 28 January 2028. Counting to sunset on 27 January 2028, 18:00 WITA (approximate sunset; dates follow KHGT).",
      farewell1449Label: "Towards the Ramadan 1449 farewell",
      farewell1449Note:
        "1 Shawwal 1449 AH: 26 February 2028. Counting to sunset on 25 February 2028, 18:00 WITA (approximate sunset; dates follow KHGT).",
      doneLabel: "Ramadan 1449 has passed",
      doneNote:
        "Ramadan 1448 and 1449 have passed. Dates follow KHGT.",
    },
  },
  about: {
    title: "Moringa, 114, and enlightenment",
    description:
      "The Tanwir and 114th Milad logo weaves moringa leaflets, a stylised number 114, and the Muhammadiyah sun emblem — the local wisdom of Palu meeting the aspiration of Progressive Islam.",
    paragraphs: [
      "The moringa leaf (Moringa oleifera) is a plant native to Palu that withstands dry ground and is rich in benefit. It stands for resilience, simplicity, and real benefit to creation — rahmatan lil ‘alamin.",
      "The number 114 marks Muhammadiyah's age from 1912 to 2026, while also resonating with the 114 surahs of the Qur'an as the movement's guide.",
      "The sun emblem at the crown of the logo affirms the enlightenment of Progressive Islam. The theme “Together, Unite the Nation” is anchored in Quran 49:10 and 49:13 — ukhuwah, ta'aruf, and kalimatun sawa' towards the nation's progress.",
    ],
    facts: [
      { label: "Host city", value: "Palu, Central Sulawesi" },
      { label: "Dates", value: "19–21 November 2026" },
      { label: "Hijri", value: "10–12 Jumada al-Thani 1448 AH" },
      { label: "Symbols", value: "Moringa leaf · the number 114 · the sun" },
    ],
    posterAlt:
      "Poster of Tanwir and the 114th Milad of Muhammadiyah — Together, Unite the Nation",
  },
  agenda: {
    title: "From Tanwir Palu to the Medan Muktamar",
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
  },
  history: {
    title: "Tracks & Meaning",
    description:
      "Read the movement from two sides: the chronology of Muhammadiyah and the life journey of its founder, KH Ahmad Dahlan — complete with leadership eras and charitable works in numbers.",
    tables: {
      leadership: "Muhammadiyah Central Leadership",
      aum: "AUM",
    },
    content: historyEn,
  },
  services: {
    title: "Muhammadiyah Services",
    description:
      "Two windows of benefit: the official KHGT calendar and the latest news from Muhammadiyah.",
    calendarTitle: "Global Unified Hijri Calendar",
    calendarDescription:
      "Calendar data is synchronised from KHGT. Month views, special days, and the Gregorian–Hijri converter use an official snapshot, not a generic library.",
    highlightsTitle: "Milad Markers",
    highlightsLink: "Open KHGT",
    kabarTitle: "Official Muhammadiyah news",
    kabarDescription:
      "Pulled from Muhammadiyah's official channel, cached for one hour, with a snapshot fallback. Full articles remain at the original source.",
    closingLogoAlt:
      "Logo of Tanwir and the 114th Milad of Muhammadiyah — Together, Unite the Nation",
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
    title: "News from Muhammadiyah",
    description:
      "The latest news from Muhammadiyah's official channel. Brief summaries, with links to the original source.",
    all: "View all news",
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
    title: "Muhammadiyah Around the World",
    description:
      "Muhammadiyah did not grow only in Indonesia. 29 Special Branch Leaderships are spread across Africa, Asia, Europe, the Americas, and Oceania — and Indonesia is the headquarters of the movement.",
    note: "Dots mark PCIM countries; country borders are for orientation only. Hover, tap, or focus a dot to see the country name.",
    aria: "World map highlighting the 29 PCIM countries of Muhammadiyah and Indonesia, the headquarters of the Central Leadership.",
    countries: "PCIM countries",
    hq: "Indonesia — Muhammadiyah Central Leadership",
    info: "About the map and sources",
  },
  footer: {
    brand: "Milad 114 Muhammadiyah",
    tagline: "Together, Unite the Nation",
    description:
      "An independent site for the Tanwir and 114th Milad of Muhammadiyah.",
    eventInfo: "Palu, Central Sulawesi · 19–21 November 2026",
  },
  aboutPage: {
    title: "About this site",
    back: "Back to Home",
    intro:
      "Milad 114 is an independent digital work for the Tanwir and 114th Milad of Muhammadiyah in Palu: two historical tracks, the agenda, the world map, and its official services.",
    disclaimer:
      "Not an official Muhammadiyah website — the official links below are the primary reference for every piece of content.",
    sourcesTitle: "Information sources",
    sources: [
      { label: "Muhammadiyah.or.id", link: "muhammadiyah" },
      { label: "Global Unified Hijri Calendar (KHGT)", link: "khgt" },
      { label: "Tanwir & Milad 114 circular letter", link: "edaran" },
      { label: "Organisation profile", link: "profil" },
      { label: "A brief history of Muhammadiyah", link: "sejarahSingkat" },
      { label: "How Muhammadiyah was founded", link: "sejarahBerdiri" },
      { label: "Special Branch Leadership (PCIM)", link: "pcim" },
      { label: "Logo of the 114th Milad", link: "logo" },
      { label: "Meaning behind the logo", link: "maknaLogo" },
      { label: "Muhammadiyah 25-year programme", link: "program25" },
      { label: "Forum and Muktamar preparation", link: "muktamar2027" },
      { label: "Planting 114 moringa trees in Palu", link: "tanamKelor" },
    ],
    copyright: "© 2026 Faris Husamuddin. All rights reserved.",
  },
  notFound: {
    title: "This page is not available yet.",
    description:
      "Return home, explore the two historical tracks, or open Muhammadiyah services.",
    home: "Back to the Milad",
    history: "History",
    services: "Services",
  },
  highlights: calendarHighlightsEn,
};
