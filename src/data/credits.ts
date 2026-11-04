import type { LanguageCode } from "@/i18n/types";

export type CreditLinkKind =
  | "email"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "linkedin";

export type CreditLink = {
  kind: CreditLinkKind;
  href: string;
  handle?: string; // untuk aria/title; bukan teks mentah
};

export type Credit = {
  id: "painter" | "developer";
  name: Record<LanguageCode, string>;
  role: Record<LanguageCode, string>;
  photo?: { src: string; alt: string; width: number; height: number };
  links: CreditLink[];
};

// Subjek email dan pesan pembuka WhatsApp, dipakai sebagai satu-satunya
// sumber agar href tidak ditulis ulang di komponen.
const mailSubject = encodeURIComponent("Milad 114");
const whatsappMessage = encodeURIComponent(
  "Assalamu'alaikum, saya menghubungi dari situs Milad 114."
);

export const credits: Credit[] = [
  {
    id: "painter",
    name: {
      id: "Muhammad Ghusan Azry",
      en: "Muhammad Ghusan Azry",
      ar: "محمد غسان أزري",
    },
    role: {
      id: "Pelukis",
      en: "Painter",
      ar: "الفنان",
    },
    photo: {
      src: "/media/credits/ghusan-azry.webp",
      alt: "Muhammad Ghusan Azry",
      width: 360,
      height: 360,
    },
    links: [
      {
        kind: "email",
        href: `mailto:ghusanazri@gmail.com?subject=${mailSubject}`,
      },
      {
        kind: "whatsapp",
        href: `https://wa.me/6282130824037?text=${whatsappMessage}`,
      },
      {
        kind: "instagram",
        href: "https://www.instagram.com/ghusanazry21/",
        handle: "@ghusanazry21",
      },
      {
        kind: "facebook",
        href: "https://www.facebook.com/muhammadghusanazry",
      },
    ],
  },
  {
    id: "developer",
    name: {
      id: "Faris Husamuddin",
      en: "Faris Husamuddin",
      ar: "فارس حسام الدين",
    },
    role: {
      id: "Pengembang & Desainer Web",
      en: "Web Developer & Designer",
      ar: "مطور ومصمم ويب",
    },
    links: [
      {
        kind: "email",
        href: `mailto:faras.hasamaddan@gmail.com?subject=${mailSubject}`,
      },
      {
        kind: "instagram",
        href: "https://www.instagram.com/faris_husamuddin/",
        handle: "@faris_husamuddin",
      },
      {
        kind: "facebook",
        href: "https://www.facebook.com/faris.husamuddin.1",
      },
      {
        kind: "linkedin",
        href: "https://www.linkedin.com/in/faris-husamuddin-357663326/",
      },
    ],
  },
];
