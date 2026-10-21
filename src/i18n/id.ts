import { calendarHighlights } from "@/data/calendar-highlights";
import { milestones } from "@/data/milestones";
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
      "Website interaktif Tanwir dan Milad ke-114 Muhammadiyah. Palu, 19–21 November 2026 M | 10–12 Jumadilakhir 1448 H. Jejak 114 tahun, kalender KHGT, kabar resmi, dan peta persebaran.",
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
      { href: "#jelajah", label: "Jelajah" },
      { href: "#sejarah", label: "Sejarah" },
      { href: "#layanan", label: "Layanan" },
      { href: "#peta", label: "Peta" },
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
      "114 tahun Muhammadiyah tumbuh dari Kauman, menjadi pohon rimbun yang menaungi bangsa. Gulir untuk melihat jejaknya, lalu buka tiga arah: Sejarah, Layanan, dan Peta.",
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
      statLeft: "Akar 1912",
      statCenter: "Kanopi 2026",
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
  gates: {
    eyebrow: "Indeks jelajah",
    title: "Satu pohon, tiga arah",
    description:
      "Pilih bagian yang paling ingin dibuka. Setiap arah menuntun ke satu bagian pohon yang sama.",
    open: "Buka",
    items: [
      {
        number: "01",
        label: "Akar",
        title: "Jejak 114 Tahun",
        description:
          "Dari Kauman 1912 ke Palu 2026, dibaca dalam enam bab yang saling menyambung.",
        href: "#sejarah",
        accent: "teal",
      },
      {
        number: "02",
        label: "Batang",
        title: "Layanan Muhammadiyah",
        description:
          "Kalender KHGT dan kabar resmi dalam satu meja layanan.",
        href: "#layanan",
        accent: "navy",
      },
      {
        number: "03",
        label: "Kanopi",
        title: "Persebaran Global",
        description:
          "Peta 29 Pimpinan Cabang Istimewa Muhammadiyah di berbagai belahan dunia.",
        href: "#peta",
        accent: "gold",
      },
    ],
  },
  tree: {
    eyebrow: "Satu pohon",
    titleLine1: "Tumbuh dari",
    titleLine2: "akar yang sama.",
    description:
      "Akar menyimpan sejarah. Batang menopang layanan. Kanopi merangkul persebaran global. Tiga cabang ini adalah tiga arah yang bisa Anda buka.",
    legend: [
      {
        number: "01",
        label: "Akar",
        title: "Jejak 114 Tahun",
        description: "Sejarah panjang dari Kauman ke Palu.",
        href: "#sejarah",
        accent: "teal",
      },
      {
        number: "02",
        label: "Batang",
        title: "Layanan Muhammadiyah",
        description: "Kalender dan kabar.",
        href: "#layanan",
        accent: "navy",
      },
      {
        number: "03",
        label: "Kanopi",
        title: "Persebaran Global",
        description: "29 PCIM di lima kawasan.",
        href: "#peta",
        accent: "gold",
      },
    ],
    annotations: {
      kanopi: "Kanopi — Peta Global",
      akar: "Akar — Sejarah",
      batang: "Batang — Layanan",
    },
    stampTop: "114",
    stampBottom: "tahun",
    caption:
      "Ilustrasi pohon dihasilkan dengan algoritma space colonization (Runions dkk., 2007), diimplementasikan ulang untuk proyek ini.",
  },
  about: {
    eyebrow: "Tentang Milad",
    title: "Tumbuh dari satu daun",
    description:
      "Logo Tanwir dan Milad ke-114 memadukan daun kelor dengan angka 114. Kelor bukan sekadar ornamen: ia tumbuh di Palu, tahan cuaca, dan memberi manfaat.",
    paragraphs: [
      "Tema “Bersama Satukan Bangsa” mengajak kebersamaan yang diarahkan pada keadilan, kemakmuran, kesejahteraan, moralitas, ilmu, dan teknologi. Tema ini dikaitkan dengan QS Al-Hujurat ayat 10 dan 13.",
      "Sebagai bagian dari rangkaian, panitia menanam 114 pohon kelor di Palu. Angka 114 bertemu dengan akar, batang, dan kanopi: perjalanan panjang yang tetap berpijak pada manfaat.",
    ],
    facts: [
      { label: "Tuan rumah", value: "Palu, Sulawesi Tengah" },
      { label: "Tanggal", value: "19–21 November 2026" },
      { label: "Hijriah", value: "10–12 Jumadilakhir 1448 H" },
      { label: "Simbol", value: "Daun kelor & angka 114" },
    ],
    quote:
      "Kelor dipilih karena kuat, sederhana, dan bermanfaat. Ia tumbuh di Palu dan menjadi simbol ketangguhan.",
    link: "Baca makna logo",
  },
  agenda: {
    eyebrow: "Agenda",
    title: "Tiga penanda waktu",
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
    button: "Buka Edaran",
  },
  history: {
    eyebrow: "Akar",
    title: "Jejak 114 Tahun",
    description:
      "Dari ruang tamu di Kauman sampai kanopi yang menaungi Palu. Enam bab ini menyusuri akar, batang, dan kanopi Muhammadiyah dengan sumber resmi di setiap langkah.",
    mapEyebrow: "Peta perjalanan",
    source: "Sumber",
    verified: "Terverifikasi",
    ctaEyebrow: "Lanjut dari akar",
    ctaTitle: "Pohon ini punya batang yang menopang layanan.",
    ctaDescription:
      "Buka kalender KHGT dan kabar resmi Muhammadiyah di bagian Layanan.",
    ctaButton: "Buka Layanan",
    chapters: milestones,
  },
  services: {
    eyebrow: "Batang",
    title: "Layanan Muhammadiyah",
    description:
      "Dua layanan yang menopang pohon: kalender resmi KHGT dan kabar terbaru dari Muhammadiyah.",
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
    eyebrow: "Kanopi",
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
      "Satu pohon, tiga arah: Sejarah, Layanan, dan Peta. Dibangun sebagai karya independen untuk lomba website.",
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
    title: "Pintu ini belum ada di pohon.",
    description:
      "Kembali ke beranda, jelajahi jejak 114 tahun, atau buka layanan Muhammadiyah.",
    home: "Kembali ke Milad",
    history: "Jejak 114 Tahun",
    services: "Layanan",
  },
  highlights: calendarHighlights,
};
