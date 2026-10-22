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
    brand: "Milad 114 Muhammadiyah",
    home: "Beranda",
    menuAria: "Navigasi utama",
    about: "Tentang",
    cards: [
      {
        label: "Sejarah",
        description: "Dua jalur satu gerakan: Muhammadiyah dan KH Ahmad Dahlan.",
        links: [
          { label: "Dua jalur sejarah", anchor: "#sejarah" },
          { label: "Agenda Tanwir & Milad", anchor: "#agenda" },
        ],
      },
      {
        label: "Layanan",
        description: "Kalender KHGT dan kabar resmi Muhammadiyah.",
        links: [
          { label: "Kalender KHGT", anchor: "#layanan" },
          { label: "Kabar Muhammadiyah", anchor: "#kabar" },
        ],
      },
      {
        label: "Peta",
        description: "29 Pimpinan Cabang Istimewa di berbagai negara.",
        links: [
          { label: "Persebaran 29 PCIM", anchor: "#peta" },
          { label: "Tentang situs", about: true },
        ],
      },
    ],
  },
  hero: {
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
    timezone: "Zona waktu",
    targetTime: "Waktu target",
    modeToggle:
      "Ganti mode hitungan: Tanwir & Milad atau Ramadhan.",
    days: "Hari",
    hours: "Jam",
    minutes: "Menit",
    seconds: "Detik",
    ramadhan: {
      beforeLabel: "Menuju Ramadhan",
      beforeNote:
        "Awal Ramadhan 1448 H: 8 Februari 2027. Hitungan menuju maghrib 7 Februari 2027, 18.00 WITA (perkiraan maghrib; tanggal mengikuti KHGT).",
      farewell1448Label: "Menuju perpisahan Ramadhan",
      farewell1448Note:
        "Awal Syawal 1448 H: 9 Maret 2027. Hitungan menuju maghrib 8 Maret 2027, 18.00 WITA (perkiraan maghrib; tanggal mengikuti KHGT).",
      before1449Label: "Menuju Ramadhan 1449",
      before1449Note:
        "Awal Ramadhan 1449 H: 28 Januari 2028. Hitungan menuju maghrib 27 Januari 2028, 18.00 WITA (perkiraan maghrib; tanggal mengikuti KHGT).",
      farewell1449Label: "Menuju perpisahan Ramadhan 1449",
      farewell1449Note:
        "Awal Syawal 1449 H: 26 Februari 2028. Hitungan menuju maghrib 25 Februari 2028, 18.00 WITA (perkiraan maghrib; tanggal mengikuti KHGT).",
      doneLabel: "Ramadhan 1449 telah berlalu",
      doneNote:
        "Ramadhan 1448 dan 1449 telah berlalu. Tanggal mengikuti KHGT.",
    },
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
  },
  agenda: {
    eyebrow: "Agenda",
    title: "Dari Tanwir Palu menuju Muktamar Medan",
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
  },
  history: {
    eyebrow: "Sejarah",
    title: "Dua jalur, satu gerakan",
    description:
      "Baca perjalanan Persyarikatan dari dua sisi: kronologi Muhammadiyah dan perjalanan hidup pendirinya, KH Ahmad Dahlan ? lengkap dengan kepemimpinan dan amal usaha dalam angka.",
    tablesShow: "Tampilkan tabel",
    tablesHide: "Sembunyikan tabel",
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
    closingLogoAlt:
      "Logo Tanwir dan Milad ke-114 Muhammadiyah — Bersama Satukan Bangsa",
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
      "Muhammadiyah tidak hanya tumbuh di Indonesia. 29 Pimpinan Cabang Istimewa tersebar di Afrika, Asia, Eropa, Amerika, dan Oseania — dan Indonesia adalah markas besar gerakan.",
    note: "Titik menandai negara PCIM; batas negara hanya untuk orientasi. Ketuk atau arahkan kursor ke titik untuk nama negaranya.",
    aria: "Peta dunia yang menyorot 29 negara PCIM Muhammadiyah dan Indonesia sebagai markas Pimpinan Pusat.",
    countries: "Negara PCIM",
    hq: "Indonesia — Pimpinan Pusat Muhammadiyah",
    info: "Tentang peta dan sumber",
  },
  footer: {
    tagline:
      "Situs independen Tanwir dan Milad ke-114 Muhammadiyah: dua jalur sejarah, kalender KHGT, kabar resmi, dan peta PCIM dunia.",
    explore: "Jelajahi",
  },
  aboutPage: {
    eyebrow: "Halaman Tentang",
    title: "Tentang situs ini",
    intro:
      "Milad 114 adalah karya digital independen untuk persiapan Tanwir dan Milad ke-114 Muhammadiyah di Palu: dua jalur sejarah, agenda, peta dunia, dan layanan resminya.",
    disclaimer:
      "Bukan situs resmi Muhammadiyah — tautan resmi di bawah menjadi rujukan utama setiap materi.",
    sourcesTitle: "Sumber informasi",
    sources: [
      { label: "Muhammadiyah.or.id", link: "muhammadiyah" },
      { label: "Kalender Hijriah Global Tunggal (KHGT)", link: "khgt" },
      { label: "Edaran Tanwir dan Milad ke-114", link: "edaran" },
      { label: "Profil Persyarikatan", link: "profil" },
      { label: "Sejarah singkat Muhammadiyah", link: "sejarahSingkat" },
      { label: "Sejarah berdirinya Persyarikatan", link: "sejarahBerdiri" },
      { label: "Cabang Istimewa Muhammadiyah (PCIM)", link: "pcim" },
      { label: "Logo Milad ke-114 Muhammadiyah", link: "logo" },
      { label: "Penjelasan makna logo", link: "maknaLogo" },
      { label: "Program Muhammadiyah 25 tahun", link: "program25" },
      { label: "Forum dan persiapan Muktamar", link: "muktamar2027" },
      { label: "Tanam 114 pohon kelor di Palu", link: "tanamKelor" },
    ],
    assetsTitle: "Aset dan identitas",
    assets: [
      "Logo dan identitas visual adalah milik Pimpinan Pusat Muhammadiyah.",
      "Video intro, poster, gambar berbagi, dan pola supergrafik diturunkan dari materi resmi edisi ini; situs adalah karya independen.",
      "Font: El Messiri dan Familjen Grotesk — SIL Open Font License 1.1 (berkas lisensi di folder /licenses).",
    ],
    copyright: "© 2026 Faris Husamuddin. Hak cipta dilindungi.",
    researchTitle: "Dokumen riset",
    research: "Narasi sejarah dan filosofi pada situs ini dipersiapkan dari fakta dokumen riset internal developer.",
    dataNoteTitle: "Catatan data",
    dataNote: "Halaman kalender, kabar, dan peta memakai data dokumen 2026 yang dapat berubah; data selalu merujuk pada sumber resmi terbitan.",
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
