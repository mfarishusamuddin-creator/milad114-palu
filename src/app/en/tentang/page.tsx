import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";
import { getDictionary } from "@/i18n";

const dict = getDictionary("en");

export const metadata: Metadata = {
  title: dict.aboutPage.title,
  description: dict.aboutPage.intro,
};

export default function TentangEn() {
  return <AboutPage dict={dict} />;
}
