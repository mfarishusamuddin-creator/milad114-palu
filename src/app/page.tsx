import { AboutMilad } from "@/components/home/AboutMilad";
import { Agenda } from "@/components/home/Agenda";
import { GatewayCards } from "@/components/home/GatewayCards";
import { GrowingTree } from "@/components/home/GrowingTree";
import { Hero } from "@/components/home/Hero";
import { KabarTeaser } from "@/components/home/KabarTeaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <GatewayCards />
      <GrowingTree />
      <AboutMilad />
      <Agenda />
      <KabarTeaser />
    </>
  );
}
