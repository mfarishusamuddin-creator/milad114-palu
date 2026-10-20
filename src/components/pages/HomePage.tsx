import { AboutMilad } from "@/components/home/AboutMilad";
import { Agenda } from "@/components/home/Agenda";
import { GatewayCards } from "@/components/home/GatewayCards";
import { GrowingTree } from "@/components/home/GrowingTree";
import { Hero } from "@/components/home/Hero";
import { HistorySection } from "@/components/history/HistorySection";
import { MapSection } from "@/components/map/MapSection";
import { SiteShell } from "@/components/pages/SiteShell";
import { ServicesSection } from "@/components/services/ServicesSection";
import { getDictionary } from "@/i18n";
import type { LanguageCode } from "@/i18n/types";
import { getKabar } from "@/lib/kabar";

export async function HomePage({ lang }: { lang: LanguageCode }) {
  const dict = getDictionary(lang);
  const [latest, milad] = await Promise.all([
    getKabar(),
    getKabar("Tanwir Milad"),
  ]);

  return (
    <SiteShell dict={dict}>
      <Hero dict={dict} />
      <GatewayCards dict={dict} />
      <GrowingTree dict={dict} />
      <AboutMilad dict={dict} />
      <Agenda dict={dict} />
      <HistorySection dict={dict} />
      <ServicesSection dict={dict} latest={latest} milad={milad} />
      <MapSection dict={dict} />
    </SiteShell>
  );
}
