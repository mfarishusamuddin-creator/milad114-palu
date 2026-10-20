export const SITE = {
  name: "Milad 114",
  title: "Tanwir dan Milad ke-114 Muhammadiyah",
  tagline: "Bersama Satukan Bangsa",
  description:
    "Website interaktif Tanwir dan Milad ke-114 Muhammadiyah. Palu, 13–15 November 2026 M | 4–6 Jumadilakhir 1448 H. Jejak 114 tahun, kalender KHGT, kabar resmi, dan kuis.",
  url: "https://milad114-palu.vercel.app",
  locale: "id_ID",
  city: "Palu",
  province: "Sulawesi Tengah",
  dates: "13–15 November 2026 M | 4–6 Jumadilakhir 1448 H",
  startISO: "2026-11-13T08:00:00+08:00",
  endISO: "2026-11-15T17:00:00+08:00",
  miladISO: "2026-11-18T00:00:00+08:00",
  miladDate: "18 November 2026",
  organizer: "Pimpinan Pusat Muhammadiyah",
  nav: [
    { href: "#jelajah", label: "Jelajah" },
    { href: "#sejarah", label: "Sejarah" },
    { href: "#layanan", label: "Layanan" },
    { href: "#peta", label: "Peta" },
  ],
  links: {
    muhammadiyah: "https://muhammadiyah.or.id/",
    khgt: "https://khgt.muhammadiyah.or.id/",
    edaran:
      "https://muhammadiyah.or.id/2026/09/edaran-pp-muhammadiyah-tentang-tuntunan-penyelenggaraan-tanwir-dan-milad-ke-114-muhammadiyah/",
    logo:
      "https://muhammadiyah.or.id/2026/09/semangat-menyatukan-bangsa-terpancar-dari-logo-milad-ke-114-muhammadiyah/",
    maknaLogo:
      "https://muhammadiyah.or.id/2026/09/makna-di-balik-logo-tanwir-dan-milad-ke-114-muhammadiyah/",
    tanamKelor:
      "https://muhammadiyah.or.id/2026/10/sambut-tanwir-dan-milad-ke-114-muhammadiyah-tanam-114-pohon-kelor-di-palu/",
    program25:
      "https://muhammadiyah.or.id/2026/09/tanwir-di-palu-akan-susun-program-muhammadiyah-untuk-25-tahun-mendatang/",
    muktamar2027:
      "https://muhammadiyah.or.id/2026/09/tanwir-muhammadiyah-jadi-forum-evaluasi-dan-persiapan-muktamar-2027/",
    sejarahSingkat:
      "https://muhammadiyah.or.id/sejarah-singkat-muhammadiyah/",
    sejarahBerdiri:
      "https://muhammadiyah.or.id/sejarah-berdirinya-muhammadiyah/",
    profil: "https://muhammadiyah.or.id/profil/",
  },
} as const;

export type NavItem = (typeof SITE.nav)[number];
