"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Facebook01Icon,
  InstagramIcon,
  Linkedin01Icon,
  Mail01Icon,
  WhatsappIcon,
} from "@hugeicons/core-free-icons";
import { credits, type Credit, type CreditLinkKind } from "@/data/credits";
import type { Dictionary } from "@/i18n/types";
import "./about-credits.css";

const ICONS: Record<CreditLinkKind, typeof Mail01Icon> = {
  email: Mail01Icon,
  whatsapp: WhatsappIcon,
  instagram: InstagramIcon,
  facebook: Facebook01Icon,
  linkedin: Linkedin01Icon,
};

/**
 * Kredit & kontak dalam dua kartu. Panel kontak memakai pola accordion:
 * hanya satu panel terbuka, tombol burger berubah menjadi X, dan panel
 * tertutup diberi `inert` agar tidak bisa difokuskan keyboard.
 */
export function CreditsSection({ dict }: { dict: Dictionary }) {
  const [openId, setOpenId] = useState<Credit["id"] | null>(null);
  const t = dict.aboutPage;

  return (
    <section aria-labelledby="credits-title" className="mt-14">
      <h2
        id="credits-title"
        className="text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ocean"
      >
        {t.creditsTitle}
      </h2>

      <div className="mt-5 grid items-start gap-4 sm:grid-cols-2">
        {credits.map((credit) => (
          <CreditCard
            key={credit.id}
            credit={credit}
            dict={dict}
            open={openId === credit.id}
            onToggle={() =>
              setOpenId((current) =>
                current === credit.id ? null : credit.id
              )
            }
          />
        ))}
      </div>
    </section>
  );
}

function CreditCard({
  credit,
  dict,
  open,
  onToggle,
}: {
  credit: Credit;
  dict: Dictionary;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const buttonId = useId();
  const t = dict.aboutPage;
  const name = credit.name[dict.lang];
  const role = credit.role[dict.lang];

  return (
    <article className="credit-card">
      <div className="credit-card__head">
        {credit.photo ? (
          <Image
            src={credit.photo.src}
            alt={credit.photo.alt}
            width={credit.photo.width}
            height={credit.photo.height}
            sizes="88px"
            className="credit-card__photo"
          />
        ) : (
          <span
            className="credit-card__avatar-fallback"
            aria-hidden="true"
          />
        )}

        <div className="min-w-0">
          <p className="credit-card__role">{role}</p>
          <h3 className="font-serif text-[1.35rem] font-bold leading-tight text-ink">
            {name}
          </h3>
        </div>
      </div>

      <button
        id={buttonId}
        type="button"
        className="credit-card__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${t.contact} — ${name}`}
        onClick={onToggle}
      >
        <span>{t.contact}</span>
        <span className="credit-burger" data-open={open} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>

      <div
        id={panelId}
        className="credit-card__panel"
        data-open={open}
        role="group"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        inert={!open}
      >
        <div>
          <ul className="credit-links">
            {credit.links.map((link) => {
              const label = t.channels[link.kind];

              return (
                <li key={link.kind}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="credit-link"
                    title={
                      link.handle ? `${label} ${link.handle}` : undefined
                    }
                    aria-label={`${label} — ${name} — ${t.opensInNewTab}`}
                  >
                    <HugeiconsIcon
                      icon={ICONS[link.kind]}
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="credit-link__icon"
                    />
                    <span>{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </article>
  );
}
