"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShareButton } from "@/components/shared/ShareButton";
import { quizQuestions } from "@/data/quiz";
import { cn } from "@/lib/cn";

const BEST_KEY = "m114:quiz-best";

function computeScore(answers: number[]): number {
  return answers.reduce(
    (total, answer, index) =>
      total + (quizQuestions[index]?.answerIndex === answer ? 10 : 0),
    0
  );
}

function getBadge(score: number) {
  if (score === 100) {
    return {
      title: "Pohon Lengkap",
      description: "Semua jawaban tepat. Akar, batang, dan kanopi seimbang.",
    };
  }
  if (score >= 80) {
    return {
      title: "Akar Kuat",
      description: "Pengetahuanmu sudah dalam. Sedikit lagi menuju sempurna.",
    };
  }
  if (score >= 50) {
    return {
      title: "Tunas",
      description: "Sudah tumbuh. Baca lagi bab-bab sejarah untuk menguatkan akar.",
    };
  }
  return {
    title: "Ayo Tumbuh",
    description: "Tidak apa-apa. Mulai dari akar: 1912 dan Kauman.",
  };
}

export function QuizApp() {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  const current = quizQuestions[index];
  const score = computeScore(answers);
  const badge = getBadge(score);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(BEST_KEY);
        if (stored !== null) setBest(Number(stored));
      } catch {
        setBest(null);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function selectOption(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    setAnswers((previous) => [...previous, optionIndex]);
  }

  function next() {
    if (index === quizQuestions.length - 1) {
      const finalScore = computeScore(answers);
      setBest((previous) => {
        const nextBest =
          previous === null ? finalScore : Math.max(previous, finalScore);
        try {
          window.localStorage.setItem(BEST_KEY, String(nextBest));
        } catch {
          // localStorage can be unavailable in private contexts.
        }
        return nextBest;
      });
      setFinished(true);
      setSelected(null);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="relative overflow-hidden rounded-sm border border-l-2 border-line border-l-gold bg-white p-6 sm:p-9">
        <div
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Kuis Milad 114
          </p>
          <h3 className="mt-3 font-serif text-3xl font-bold text-ink">
            Seberapa dalam akar pengetahuanmu?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Sepuluh soal tentang sejarah, logo, Palu, dan tema Milad ke-114.
            Setiap jawaban diberi penjelasan dan tautan sumber. Skor terbaik
            disimpan di perangkatmu.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="rounded-sm bg-bg-soft px-3 py-1.5 text-[0.68rem] font-bold text-teal-deep">
              10 soal
            </span>
            <span className="rounded-sm bg-bg-soft px-3 py-1.5 text-[0.68rem] font-bold text-teal-deep">
              Pilihan ganda
            </span>
            <span className="rounded-sm bg-bg-soft px-3 py-1.5 text-[0.68rem] font-bold text-teal-deep">
              Tanpa backend
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStarted(true)}
            >
              Mulai Kuis
              <ArrowIcon />
            </button>
            {best !== null ? (
              <span className="text-xs font-semibold text-ink-soft">
                Rekormu:{" "}
                <span className="text-gold-text">{best}/100</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="relative overflow-hidden rounded-sm border border-l-2 border-line border-l-gold bg-white p-6 sm:p-9">
        <div
          className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/20 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            Hasil
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <p className="font-serif text-7xl font-bold leading-none text-navy">
              {score}
            </p>
            <p className="pb-2 text-sm font-bold text-ink-soft">/ 100</p>
          </div>
          <h3 className="mt-3 font-serif text-3xl font-bold text-ink">
            {badge.title}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            {badge.description}
          </p>

          {best !== null ? (
            <p className="mt-3 text-xs font-semibold text-ink-soft">
              Rekor terbaik: <span className="text-gold-text">{best}/100</span>
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ShareButton
              text={`Saya mendapat ${score}/100 di Kuis Milad 114 Muhammadiyah. Berani coba?`}
              label="Bagikan skor"
              className="btn-primary"
            />
            <button
              type="button"
              className="btn btn-ghost"
              onClick={restart}
            >
              Ulangi
            </button>
            <Link href="/sejarah" className="btn btn-ghost no-underline">
              Baca Sejarah
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-l-2 border-line border-l-gold bg-white p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
          Soal {index + 1} dari {quizQuestions.length}
        </p>
        {best !== null ? (
          <p className="text-[0.68rem] font-semibold text-ink-soft">
            Rekor {best}/100
          </p>
        ) : null}
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-soft">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-300"
          style={{
            width: `${((index + (selected !== null ? 1 : 0)) / quizQuestions.length) * 100}%`,
          }}
        />
      </div>

      <h3
        id="quiz-question"
        className="mt-6 font-serif text-2xl font-bold text-ink sm:text-3xl"
      >
        {current.question}
      </h3>

      <div
        className="mt-5 grid gap-2.5"
        role="radiogroup"
        aria-labelledby="quiz-question"
      >
        {current.options.map((option, optionIndex) => {
          const isCorrect = optionIndex === current.answerIndex;
          const isChosen = selected === optionIndex;
          const showCorrect = selected !== null && isCorrect;
          const showWrong = selected !== null && isChosen && !isCorrect;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isChosen}
              disabled={selected !== null}
              onClick={() => selectOption(optionIndex)}
              className={cn(
                "quiz-option",
                showCorrect && "quiz-option--correct",
                showWrong && "quiz-option--wrong"
              )}
            >
              <span className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-soft text-[0.68rem] font-bold text-ink-soft">
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span>{option}</span>
              </span>
              {showCorrect ? <CheckIcon /> : null}
              {showWrong ? <XIcon /> : null}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-4">
        {selected !== null ? (
          <div
            className={cn(
              "rounded-sm border px-4 py-3 text-sm",
              selected === current.answerIndex
                ? "border-kelor-deep/30 bg-[#f0fbf4] text-ink"
                : "border-red-200 bg-[#fff4f2] text-ink"
            )}
          >
            <p className="font-bold">
              {selected === current.answerIndex
                ? "Tepat."
                : `Belum tepat. Jawaban yang benar: ${current.options[current.answerIndex]}.`}
            </p>
            <p className="mt-1 text-ink-soft">{current.explanation}</p>
            <a
              href={current.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[0.7rem] font-bold text-teal-deep underline"
            >
              Sumber: {current.source}
            </a>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-[0.68rem] text-ink-soft">
          Pilih satu jawaban untuk melanjutkan.
        </p>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={next}
          disabled={selected === null}
        >
          {index === quizQuestions.length - 1 ? "Lihat Hasil" : "Lanjut"}
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-kelor-deep"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-red-600"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}


