import { calendarHighlights } from "@/data/calendar-highlights";
import { historyId } from "@/data/history";
import type { Dictionary } from "./types";

const hijriMonths: Record<string, string> = {
  Muharam: "Muharam",
  Safar: "Safar",
  Rabiulawal: "Rabiulawal",
  Rabiulakhir: "Rabiulakhir",
  Jumadilawal: "Jumadilawal",
  Jumadilakhir: "Jumadilakhir",
  Rajab: "Rajab",
  Syakban: "Syakban",
  Ramadan: "Ramadan",
  Syawal: "Syawal",
  Zulkaidah: "Zulkaidah",
  Zulhijah: "Zulhijah",
};

const gregorianMonthList = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const gregorianMonths = Object.fromEntries(
  gregorianMonthList.map((month) => [month, month])
);

export const id: Dictionary = {
  lang: "id",
  dir: "ltr",
  locale: "id-ID",
  meta: {
    title: "Tanwir dan Milad ke-114 Muhammadiyah — Bersama Satukan Bangsa",
    description:
      "Website interaktif Tanwir dan Milad ke-114 Muhammadiyah. Palu, 19–21 November 2026 M | 10–12 Jumadilakhir 1448 H. Dua jalur sejarah, kalender KHGT, kabar resmi, dan peta PCIM dunia.",
    tagline: "Bersama Satukan Bangsa",
  },
  common: {
    source: "Sumber",
    read: "Baca",
    open: "Buka",
    verified: "Terverifikasi",
    language: "Bahasa",
    theme: "Tema",
    light: "Terang",
    dark: "Gelap",
    skipToContent: "Lewati ke konten",
    skipIntro: "Lewati intro",
  },
  nav: {
    links: [
      { href: "#peta", label: "Peta" },
      { href: "#sejarah", label: "Sejarah" },
      { href: "#layanan", label: "Layanan" },
    ],
    cta: "Jelajahi Jejak",
    menuOpen: "Buka menu",
    menuClose: "Tutup menu",
    language: "Bahasa",
    themeLight: "Mode terang",
    themeDark: "Mode gelap",
    themeToggle: "Ubah tema",
  },
  hero: {
    edition: "Edisi 114 · Palu 2026",
    eventLine: "Tanwir & Milad ke-114 Muhammadiyah",
    dateLine: "19–21 Nov 2026 · 10–12 Jumadilakhir 1448 H",
    eyebrow: "Tanwir & Milad ke-114 Muhammadiyah",
    titleLine1: "Bersama",
    titleLine2: "Satukan Bangsa",
    subtitle: "Tanwir dan Milad ke-114 Muhammadiyah",
    intro:
      "Seratus empat belas tahun. Dari Kauman 1912 hingga Palu 2026 — situs digital Tanwir dan Milad ke-114 Muhammadiyah. Jelajahi dua jalur sejarah, agenda, peta dunia, dan layanan resminya.",
    ctaPrimary: "Jelajahi Jejak 114 Tahun",
    ctaSecondary: "Buka Layanan",
    share: "Bagikan",
    shareText:
      "Tanwir dan Milad ke-114 Muhammadiyah — Bersama Satukan Bangsa. Palu, 19–21 November 2026.",
    languageLine: "Baca dalam",
    plate: {
      identity: "Identitas resmi",
      city: "Palu 2026",
      logoAlt:
        "Logo Tanwir dan Milad ke-114 Muhammadiyah — Bersama Satukan Bangsa, Palu 19–21 November 2026",
      caption: "Logo resmi · Tanwir & Milad ke-114",
      statLeft: "Kauman 1912",
      statCenter: "Palu 2026",
      statRight: "114 tahun",
      stampTop: "114",
      stampBottom: "tahun",
    },
  },
  countdown: {
    beforeLabel: "Menuju Tanwir & Milad",
    duringLabel: "Tanwir & Milad sedang berlangsung",
    miladLabel: "Menuju Milad ke-114",
    doneLabel: "Milad ke-114 telah berlangsung",
    beforeNote: "Palu · 19–21 November 2026",
    duringNote: "Palu · 19–21 November 2026",
    miladNote: "18 November 2026",
    doneNote: "Terima kasih telah menjelajah",
    wita: "WITA",
    days: "Hari",
    hours: "Jam",
    minutes: "Menit",
    seconds: "Detik",
  },
  about: {
    eyebrow: "Makna Logo",
    title: "Kelor, 114, dan pencerahan",
    description:
      "Logo Tanwir dan Milad ke-114 memadukan helai daun kelor, stilisasi angka 114, dan lambang matahari Muhammadiyah — kearifan lokal Palu yang bertemu cita-cita Islam Berkemajuan.",
    paragraphs: [
      "Daun kelor (Moringa oleifera) adalah flora khas Palu yang tahan di tanah kering dan kaya manfaat. Ia melambangkan resiliensi, kesederhanaan, dan kebermanfaatan nyata bagi alam — rahmatan lil ‘alamin.",
      "Angka 114 menandai usia Muhammadiyah 1912–2026, sekaligus beresonansi dengan jumlah 114 surah dalam Al-Qur’an sebagai pemandu dakwah Persyarikatan.",
      "Lambang matahari di puncak logo menegaskan pencerahan Islam Berkemajuan. Tema “Bersama Satukan Bangsa” berjangkar pada QS Al-Hujurat ayat 10 dan 13: ukhuwah, ta’aruf, dan kalimatun sawa’ menuju kemajuan bangsa.",
    ],
    facts: [
      { label: "Tuan rumah", value: "Palu, Sulawesi Tengah" },
      { label: "Tanggal", value: "19–21 November 2026" },
      { label: "Hijriah", value: "10–12 Jumadilakhir 1448 H" },
      { label: "Simbol", value: "Daun kelor · angka 114 · matahari" },
    ],
    quote:
      "Kelor dipilih karena kuat, sederhana, dan bermanfaat — ia tumbuh di Palu dan menjadi simbol ketangguhan.",
    link: "Baca makna logo",
  },
  agenda: {
    eyebrow: "Agenda",
    title: "Dari Tanwir Palu menuju Muktamar Medan",
    description:
      "Tanggal acara, tanggal historis, dan arah berikutnya. Jadwal rinci mengikuti Edaran PP Muhammadiyah No. 19/EDR/I.0/B/2026.",
    items: [
      {
        date: "19–21 Nov 2026",
        title: "Tanwir dan Milad ke-114",
        description:
          "Palu, Sulawesi Tengah. Rangkaian utama Tanwir dan Milad, bertepatan dengan 10–12 Jumadilakhir 1448 H.",
        tag: "Palu",
      },
      {
        date: "18 Nov 2026",
        title: "Milad ke-114 Muhammadiyah",
        description:
          "Milad historis, mengenang pendirian Muhammadiyah pada 18 November 1912 / 8 Dzulhijjah 1330 H.",
        tag: "Milad",
      },
      {
        date: "2027",
        title: "Muktamar ke-49",
        description:
          "Medan, Sumatera Utara. Tanwir 2026 menjadi forum evaluasi dan persiapan menuju Muktamar.",
        tag: "2027",
      },
    ],
    pillars: [
      "Resiliensi Kelembagaan",
      "Resiliensi AUM",
      "Resiliensi Kebinekaan",
    ],
    button: "Buka Edaran",
  },
  history: {
    eyebrow: "Sejarah",
    title: "Dua jalur, satu gerakan",
    description:
      "Baca perjalanan Persyarikatan dari dua sisi: kronologi Muhammadiyah dan perjalanan hidup pendirinya, KH Ahmad Dahlan — lengkap dengan kepemimpinan dan amal usaha dalam angka.",
    source: "Sumber",
    ctaEyebrow: "Lanjut ke manfaat",
    ctaTitle: "Sejarah ini hidup dalam layanan.",
    ctaDescription:
      "Buka kalender KHGT dan kabar resmi Muhammadiyah di bagian Layanan.",
    ctaButton: "Buka Layanan",
    content: historyId,
  },
  services: {
    eyebrow: "Kebermanfaatan",
    title: "Layanan Muhammadiyah",
    description:
      "Dua jendela manfaat: kalender resmi KHGT dan kabar terbaru dari Muhammadiyah.",
    calendarTitle: "Kalender Hijriah Global Tunggal",
    calendarDescription:
      "Data kalender disinkronkan dari KHGT. Tampilan bulan, hari istimewa, dan konverter Masehi–Hijriah memakai snapshot resmi, bukan library generik.",
    highlightsTitle: "Penanda Milad",
    highlightsLink: "Buka KHGT",
    kabarTitle: "Kabar resmi Muhammadiyah",
    kabarDescription:
      "Ditarik dari kanal resmi Muhammadiyah, dengan cache satu jam dan fallback snapshot. Artikel lengkap tetap di sumber asli.",
    sourceTitle: "Catatan sumber",
    sourceDescription:
      "Kalender bersumber dari KHGT; kabar dari kanal resmi Muhammadiyah. Jika data resmi tidak dapat dimuat, halaman menampilkan snapshot terakhir dan tautan ke sumber asli.",
  },
  calendar: {
    locale: "id-ID",
    hijriTab: "Hijriah KHGT",
    masehiTab: "Masehi",
    fullCalendar: "Lihat kalender lengkap di KHGT",
    prev: "Bulan sebelumnya",
    next: "Bulan berikutnya",
    specialDays: "Hari istimewa",
    noSpecial: "Tidak ada hari istimewa pada bulan ini.",
    converter: "Konverter tanggal",
    masehiLabel: "Tanggal Masehi",
    masehiButton: "Cari Hijriah",
    hijriMonthLabel: "Bulan Hijriah",
    hijriDayLabel: "Tanggal",
    hijriYearLabel: "Tahun",
    hijriButton: "Cari Masehi",
    placeholder: "Pilih tanggal untuk melihat padanan Masehi–Hijriah.",
    notFound: "Tanggal tidak ditemukan dalam snapshot KHGT 2026.",
    source: "Sumber",
    snapshot: "snapshot",
    disclaimer: "Kalender ini bukan pengganti kalender resmi KHGT.",
    weekdays: ["Ahd", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    hijriMonths,
    gregorianMonths,
    gregorianMonthList,
    eventNames: {
      "Ayyamul Bidh": "Ayyamul Bidh",
      "Hari Tasua": "Hari Tasua",
      "Hari Asyuro": "Hari Asyuro",
      "Hari Tahun baru Islam (Hijriah)": "Hari Tahun Baru Islam (Hijriah)",
      "Hari Tahun Baru Islam (Hijriah)": "Hari Tahun Baru Islam (Hijriah)",
    },
    miladLabel: "Milad",
  },
  kabar: {
    eyebrow: "Kabar",
    title: "Kabar dari Muhammadiyah",
    description:
      "Kabar terbaru dari kanal resmi Muhammadiyah. Ringkasan singkat, tautan tetap ke sumber asli.",
    all: "Lihat semua kabar",
    source: "Sumber",
    sourceNote: "data diperbarui otomatis dengan cache satu jam.",
    originalNote:
      "Judul dan ringkasan berasal dari sumber resmi; teks asli berbahasa Indonesia.",
    empty:
      "Kabar resmi sedang tidak dapat dimuat. Buka langsung muhammadiyah.or.id.",
    read: "Baca di muhammadiyah.or.id",
    tabs: {
      latest: "Terbaru",
      milad: "Milad & Tanwir",
    },
  },
  map: {
    eyebrow: "Internasionalisasi",
    title: "Persebaran Muhammadiyah",
    description:
      "Muhammadiyah tidak hanya tumbuh di Indonesia. 29 Pimpinan Cabang Istimewa tersebar di Afrika, Asia, Eropa, Amerika, dan Oseania.",
    count: "29 Pimpinan Cabang Istimewa",
    note: "Peta dunia memakai data Natural Earth. Titik menandai kota pusat PCIM; batas negara hanya untuk orientasi.",
    source: "Sumber",
    aria: "Peta dunia yang menyorot 29 negara PCIM Muhammadiyah.",
    countryList: "Negara PCIM",
    cityLabel: "Kota",
    regions: {
      africa: "Afrika",
      asia: "Asia",
      europe: "Eropa",
      americas: "Amerika",
      oceania: "Oseania",
    },
  },
  footer: {
    tagline:
      "Situs independen Tanwir dan Milad ke-114 Muhammadiyah: dua jalur sejarah, kalender KHGT, kabar resmi, dan peta PCIM dunia.",
    explore: "Jelajahi",
    sources: "Sumber resmi",
    event: "Milad ke-114",
    eventLines: [
      "Palu, Sulawesi Tengah",
      "19–21 November 2026",
      "10–12 Jumadilakhir 1448 H",
    ],
    credit:
      "Logo dan identitas visual milik PP Muhammadiyah. Font El Messiri dan Familjen Grotesk berlisensi OFL.",
    copyright: "© 2026 Milad 114 — karya independen untuk lomba website.",
    dataNote:
      "Data kalender: KHGT. Data kabar: muhammadiyah.or.id. Diverifikasi ulang sebelum publikasi.",
    language: "Bahasa",
  },
  notFound: {
    title: "Halaman ini belum tersedia.",
    description:
      "Kembali ke beranda, jelajahi dua jalur sejarah, atau buka layanan Muhammadiyah.",
    home: "Kembali ke Milad",
    history: "Sejarah",
    services: "Layanan",
  },
  highlights: calendarHighlights,
};
