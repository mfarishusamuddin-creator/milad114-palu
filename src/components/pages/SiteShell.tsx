import { MotionIntro } from "@/components/intro/MotionIntro";
import { Footer } from "@/components/layout/Footer";
import { LocaleEffect } from "@/components/layout/LocaleEffect";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import type { Dictionary } from "@/i18n/types";

export function SiteShell({
  dict,
  children,
}: {
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <div
      lang={dict.lang}
      dir={dict.dir}
      className="site-shell flex min-h-screen flex-col bg-bg text-ink"
    >
      <a href="#konten" className="skip-link">
        {dict.common.skipToContent}
      </a>
      <MotionIntro dict={dict} />
      <Navbar dict={dict} />
      <main id="konten" className="flex-1">
        {children}
      </main>
      <Footer dict={dict} />
      <ScrollReveal />
      <LocaleEffect lang={dict.lang} dir={dict.dir} />
    </div>
  );
}
