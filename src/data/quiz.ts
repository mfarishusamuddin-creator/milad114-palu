export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  source: string;
  sourceUrl: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Kapan Muhammadiyah didirikan?",
    options: ["18 November 1911", "18 November 1912", "18 November 1913", "18 November 1914"],
    answerIndex: 1,
    explanation:
      "Muhammadiyah didirikan pada 18 November 1912 M atau 8 Dzulhijjah 1330 H di Kauman, Yogyakarta.",
    source: "Sejarah Singkat Muhammadiyah",
    sourceUrl: "https://muhammadiyah.or.id/sejarah-singkat-muhammadiyah/",
  },
  {
    id: 2,
    question: "Siapa pendiri Muhammadiyah?",
    options: ["KH Ahmad Dahlan", "KH Ibrahim", "KH Mas Mansur", "Ki Bagus Hadikusuma"],
    answerIndex: 0,
    explanation:
      "KH Ahmad Dahlan, yang bernama kecil Muhammad Darwis, adalah pendiri Muhammadiyah.",
    source: "Sejarah Berdirinya Muhammadiyah",
    sourceUrl: "https://muhammadiyah.or.id/sejarah-berdirinya-muhammadiyah/",
  },
  {
    id: 3,
    question: "Di mana Muhammadiyah didirikan?",
    options: ["Kauman, Yogyakarta", "Palu, Sulawesi Tengah", "Medan, Sumatera Utara", "Bandung, Jawa Barat"],
    answerIndex: 0,
    explanation: "Pendirian Muhammadiyah berlangsung di Kauman, Yogyakarta.",
    source: "Sejarah Singkat Muhammadiyah",
    sourceUrl: "https://muhammadiyah.or.id/sejarah-singkat-muhammadiyah/",
  },
  {
    id: 4,
    question: "Sekolah apa yang dirintis sebelum Muhammadiyah berdiri?",
    options: ["Madrasah Ibtidaiyah Diniyah Islamiyah", "Kweekschool Jetis", "STOVIA", "Al-Azhar"],
    answerIndex: 0,
    explanation:
      "Madrasah Ibtidaiyah Diniyah Islamiyah diresmikan 1 Desember 1911, sebelum organisasi Muhammadiyah berdiri.",
    source: "Sejarah Berdirinya Muhammadiyah",
    sourceUrl: "https://muhammadiyah.or.id/sejarah-berdirinya-muhammadiyah/",
  },
  {
    id: 5,
    question: "Kapan Tanwir dan Milad ke-114 di Palu?",
    options: ["13–15 November 2026", "20–22 November 2026", "18–20 November 2026", "13–15 Desember 2026"],
    answerIndex: 0,
    explanation:
      "Tanwir dan Milad ke-114 berlangsung di Palu pada 13–15 November 2026, bertepatan dengan 4–6 Jumadilakhir 1448 H.",
    source: "Logo resmi + KHGT",
    sourceUrl: "https://khgt.muhammadiyah.or.id/",
  },
  {
    id: 6,
    question: "Apa tema Milad ke-114 Muhammadiyah?",
    options: ["Bersama Satukan Bangsa", "Cahaya Islam Berkemajuan", "Islam Berkemajuan", "Satu Nusa Satu Bangsa"],
    answerIndex: 0,
    explanation: "Tema resmi Milad ke-114 adalah “Bersama Satukan Bangsa”.",
    source: "Logo resmi Tanwir dan Milad ke-114",
    sourceUrl:
      "https://muhammadiyah.or.id/2026/09/semangat-menyatukan-bangsa-terpancar-dari-logo-milad-ke-114-muhammadiyah/",
  },
  {
    id: 7,
    question: "Apa elemen utama logo Milad ke-114?",
    options: ["Daun kelor dan angka 114", "Padi dan kapas", "Ombak dan perahu", "Gunung dan bintang"],
    answerIndex: 0,
    explanation:
      "Logo memadukan daun kelor dengan angka 114; lambang Muhammadiyah ditempatkan di puncaknya.",
    source: "Makna di Balik Logo",
    sourceUrl:
      "https://muhammadiyah.or.id/2026/09/makna-di-balik-logo-tanwir-dan-milad-ke-114-muhammadiyah/",
  },
  {
    id: 8,
    question: "Berapa pohon kelor yang ditanam di Palu?",
    options: ["14", "44", "114", "1.140"],
    answerIndex: 2,
    explanation: "Panitia menanam 114 pohon kelor di Palu sebagai bagian dari rangkaian Milad.",
    source: "Muhammadiyah Tanam 114 Pohon Kelor di Palu",
    sourceUrl:
      "https://muhammadiyah.or.id/2026/10/sambut-tanwir-dan-milad-ke-114-muhammadiyah-tanam-114-pohon-kelor-di-palu/",
  },
  {
    id: 9,
    question: "13–15 November 2026 bertepatan dengan tanggal Hijriah apa?",
    options: ["4–6 Jumadilakhir 1448 H", "10–12 Jumadilakhir 1448 H", "4–6 Dzulhijjah 1448 H", "4–6 Rabiulakhir 1448 H"],
    answerIndex: 0,
    explanation: "Data KHGT mencatat 13–15 November 2026 sebagai 4–6 Jumadilakhir 1448 H.",
    source: "Kalender Hijriah Global Tunggal",
    sourceUrl: "https://khgt.muhammadiyah.or.id/",
  },
  {
    id: 10,
    question: "Dua ayat Al-Hujurat yang dikaitkan dengan tema adalah…",
    options: ["10 dan 13", "1 dan 2", "11 dan 12", "3 dan 4"],
    answerIndex: 0,
    explanation: "Tema “Bersama Satukan Bangsa” dikaitkan dengan QS Al-Hujurat ayat 10 dan 13.",
    source: "Makna di Balik Logo",
    sourceUrl:
      "https://muhammadiyah.or.id/2026/09/makna-di-balik-logo-tanwir-dan-milad-ke-114-muhammadiyah/",
  },
];
