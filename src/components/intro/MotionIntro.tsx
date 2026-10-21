"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/theme/BrandLogo";
import { useTheme } from "@/components/theme/useTheme";
import type { Dictionary } from "@/i18n/types";

const INTRO_PLAYBACK_RATE = 1.2;

export function MotionIntro({ dict }: { dict: Dictionary }) {
  const theme = useTheme();
  const [visible, setVisible] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mobile, setMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setClosing(true);
    document.documentElement.dataset.intro = "skip";

    window.setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 520);
  }, []);

  useEffect(() => {
    const mode = document.documentElement.dataset.intro;

    if (mode === "skip") {
      const frame = window.requestAnimationFrame(() => setVisible(false));
      return () => window.cancelAnimationFrame(frame);
    }

    const frame = window.requestAnimationFrame(() => {
      setMobile(window.matchMedia("(max-width: 767px)").matches);
      setPlaying(true);
    });

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [finish]);

  useEffect(() => {
    if (!playing) return;

    const video = videoRef.current;
    if (!video) return;

    video.defaultPlaybackRate = INTRO_PLAYBACK_RATE;
    video.playbackRate = INTRO_PLAYBACK_RATE;

    const playPromise = video.play();
    if (playPromise) playPromise.catch(() => undefined);

    const fallback = window.setTimeout(() => finish(), 8000);
    return () => window.clearTimeout(fallback);
  }, [playing, finish]);

  if (!visible) return null;

  const orientation = mobile ? "vertical" : "horizontal";
  const variant = theme === "dark" ? "dark" : "light";
  const source = `/media/intro/${orientation}-${variant}.mp4`;
  const poster = `/media/intro/${orientation}-${variant}.jpg`;

  return (
    <div
      className={`motion-intro${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={dict.hero.edition}
    >
      <div className="motion-intro__stage">
        <div
          className={`motion-intro__static${videoReady ? " is-fading" : ""}`}
        >
          <BrandLogo
            variant="logogram"
            alt={dict.hero.plate.logoAlt}
            width={512}
            height={512}
            className="motion-intro__mark"
          />
          <span className="motion-intro__loading">{dict.hero.edition}</span>
        </div>

        {playing ? (
          <video
            ref={videoRef}
            className="motion-intro__video"
            src={source}
            poster={poster}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={finish}
            onError={finish}
            onLoadedData={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            onLoadedMetadata={(event) => {
              const video = event.currentTarget;
              if (video.playbackRate !== INTRO_PLAYBACK_RATE) {
                video.playbackRate = INTRO_PLAYBACK_RATE;
              }
            }}
            aria-hidden="true"
          />
        ) : null}
      </div>

      <div className="motion-intro__meta">
        <span>{dict.hero.edition}</span>
        <button type="button" onClick={finish} autoFocus>
          {dict.common.skipIntro}
        </button>
      </div>
    </div>
  );
}
