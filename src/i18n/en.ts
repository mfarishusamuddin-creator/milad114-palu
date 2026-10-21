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
      { href: "#peta", label: "Map" },
      { href: "#sejarah", label: "History" },
      { href: "#layanan", label: "Services" },
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
      "One hundred and fourteen years. From Kauman in 1912 to Palu in 2026 — the digital home of the Tanwir and 114th Milad of Muhammadiyah. Explore two historical tracks, the agenda, the world map, and its official services.",
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
      statLeft: "Kauman 1912",
      statCenter: "Palu 2026",
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
    timezone: "Time zone",
    targetTime: "Target time",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  about: {
    eyebrow: "Logo Meaning",
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
    quote:
      "Moringa was chosen because it is strong, simple, and useful — it grows in Palu and stands for resilience.",
    link: "Read the logo meaning",
  },
  agenda: {
    eyebrow: "Agenda",
    title: "From Tanwir Palu to the Medan Muktamar",
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
    pillars: [
      "Institutional resilience",
      "AUM resilience",
      "Pluralism resilience",
    ],
    button: "Open the Circular",
  },
  history: {
    eyebrow: "History",
    title: "Two tracks, one movement",
    description:
      "Read the movement from two sides: the chronology of Muhammadiyah and the life journey of its founder, KH Ahmad Dahlan — complete with leadership eras and charitable works in numbers.",
    source: "Source",
    ctaEyebrow: "Onward to benefit",
    ctaTitle: "This history lives on through services.",
    ctaDescription:
      "Open the KHGT calendar and official Muhammadiyah news in the Services section.",
    ctaButton: "Open Services",
    content: historyEn,
  },
  services: {
    eyebrow: "Public benefit",
    title: "Muhammadiyah Services",
    description:
      "Two windows of benefit: the official KHGT calendar and the latest news from Muhammadiyah.",
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
    eyebrow: "Internationalisation",
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
      "An independent site for the Tanwir and 114th Milad of Muhammadiyah: two historical tracks, the KHGT calendar, official news, and a map of PCIM worldwide.",
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
    title: "This page is not available yet.",
    description:
      "Return home, explore the two historical tracks, or open Muhammadiyah services.",
    home: "Back to the Milad",
    history: "History",
    services: "Services",
  },
  highlights: calendarHighlightsEn,
};
