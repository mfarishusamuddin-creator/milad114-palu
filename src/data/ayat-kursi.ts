import type { LanguageCode } from "@/i18n/types";

export type AyatKursiText = Record<LanguageCode, string>;

export type AyatKursiPoint = {
  id: string;
  title: AyatKursiText;
  summary: AyatKursiText;
  source: AyatKursiText;
  /** Halaman dorar.net yang paling spesifik untuk poin ini. */
  href: string;
};

export type AyatKursiContent = {
  points: AyatKursiPoint[];
  cta: {
    label: AyatKursiText;
    /** Tautan spesifik per bahasa; bukan beranda dorar.net. */
    href: Record<LanguageCode, string>;
  };
  /** Tautan tambahan; saat ini hanya untuk halaman Indonesia. */
  related?: {
    label: Partial<AyatKursiText>;
    href: Partial<Record<LanguageCode, string>>;
  };
};

/**
 * Tiga poin keutamaan Ayat Kursi.
 *
 * Teks di bawah sudah disetujui pemilik.
 * Tidak ada teks ayat maupun teks hadits lengkap yang ditampilkan di
 * dialog.
 *
 * Tautan poin memakai halaman syarah Arab yang paling spesifik karena
 * dorar.net belum menyediakan halaman syarah per hadits dalam bahasa
 * Indonesia atau Inggris. Tombol utama memakai halaman Inggris untuk
 * EN, dan halaman kategori fadhail Arab untuk ID/AR.
 */
export const ayatKursiContent: AyatKursiContent = {
  points: [
    {
      id: "greatest-verse",
      title: {
        id: "Ayat paling agung",
        en: "The greatest verse",
        ar: "أعظم آية",
      },
      summary: {
        id: "Ayat Kursi menempati kedudukan tertinggi di antara seluruh ayat Al-Qur'an.",
        en: "Ayat al-Kursi holds the highest station among all the verses of the Qur'an.",
        ar: "آية الكرسي أعظم آية في كتاب الله، كما بيّن النبي صلى الله عليه وسلم لأبيّ بن كعب.",
      },
      source: {
        id: "Muslim 810",
        en: "Muslim 810",
        ar: "مسلم ٨١٠",
      },
      href: "https://dorar.net/hadith/sharh/64099",
    },
    {
      id: "protection-until-morning",
      title: {
        id: "Penjaga hingga pagi",
        en: "A guard until morning",
        ar: "حفظٌ حتى الصباح",
      },
      summary: {
        id: "Siapa membacanya sebelum tidur, ia dijaga Allah dan setan tidak mendekat hingga pagi.",
        en: "Whoever recites it before sleep is guarded by Allah, and no devil comes near until morning.",
        ar: "من قرأها إذا أوى إلى فراشه كان عليه من الله حافظ، ولا يقربه شيطان حتى يصبح.",
      },
      source: {
        id: "al-Bukhari 3275",
        en: "al-Bukhari 3275",
        ar: "البخاري ٣٢٧٥",
      },
      href: "https://dorar.net/hadith/sharh/1767",
    },
    {
      id: "after-obligatory-prayer",
      title: {
        id: "Setelah shalat wajib",
        en: "After the obligatory prayer",
        ar: "بعد الصلاة المكتوبة",
      },
      summary: {
        id: "Membacanya setiap selesai shalat fardhu menjadikan kematian satu-satunya penghalang masuk surga.",
        en: "Reciting it after each obligatory prayer leaves only death between a person and Paradise.",
        ar: "من حافظ على قراءتها بعد كل صلاة مكتوبة، لم يبقَ بينه وبين الجنة إلا الموت.",
      },
      source: {
        id: "An-Nasa'i 9848",
        en: "An-Nasa'i 9848",
        ar: "النسائي ٩٨٤٨",
      },
      href: "https://dorar.net/feqhia/1064",
    },
  ],
  cta: {
    label: {
      id: "Keterangan lengkap di dorar.net",
      en: "Full details on dorar.net",
      ar: "التفاصيل الكاملة في الدرر السنية",
    },
    href: {
      id: "https://dorar.net/hadith-category/cat/5c8227ee3d",
      en: "https://dorar.net/en/tafseer/1234",
      ar: "https://dorar.net/hadith-category/cat/5c8227ee3d",
    },
  },
  related: {
    label: {
      id: "Artikel Muhammadiyah terkait ayat ini",
    },
    href: {
      id: "https://muhammadiyah.or.id/2024/12/setiap-tidur-malam-umat-islam-dianjurkan-membaca-ayat-kursi/",
    },
  },
};
