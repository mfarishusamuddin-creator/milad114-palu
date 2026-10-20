"use client";

import { useEffect, useState } from "react";
import { ShareButton } from "@/components/shared/ShareButton";
import type { Dictionary } from "@/i18n/types";
import { cn } from "@/lib/cn";

const BEST_KEY = "m114:quiz-best";

function computeScore(
  answers: number[],
  questions: Dictionary["quiz"]["questions"]
): number {
  return answers.reduce(
    (total, answer, index) =>
      total + (questions[index]?.answerIndex === answer ? 10 : 0),
    0
  );
}

export function QuizApp({ dict }: { dict: Dictionary }) {
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const questions = dict.quiz.questions;
  const current = questions[index];
  const score = computeScore(answers, questions);
  const badge =
    dict.quiz.badges.find((item) => score >= item.min) ??
    dict.quiz.badges[dict.quiz.badges.length - 1];

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
    if (index === questions.length - 1) {
      const finalScore = computeScore(answers, questions);
      setBest((previous) => {
        const nextBest =
          previous === null ? finalScore : Math.max(previous, finalScore);
        try {
          window.localStorage.setItem(BEST_KEY, String(nextBest));
        } catch {
          // localStorage may be unavailable.
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
      <div className="relative overflow-hidden rounded-sm border border-line bg-surface p-6 sm:p-9">
        <div
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {dict.quiz.eyebrow}
          </p>
          <h3 className="mt-3 font-serif text-3xl font-bold text-ink">
            {dict.quiz.startTitle}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {dict.quiz.startDescription}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {dict.quiz.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-bg-soft px-3 py-1.5 text-[0.68rem] font-bold text-teal-deep"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStarted(true)}
            >
              {dict.quiz.startButton}
              <ArrowIcon />
            </button>
            {best !== null ? (
              <span className="text-xs font-semibold text-ink-soft">
                {dict.quiz.best}:{" "}
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
      <div className="relative overflow-hidden rounded-sm border border-line bg-surface p-6 sm:p-9">
        <div
          className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/20 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative z-10">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            {dict.quiz.resultEyebrow}
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
              {dict.quiz.resultBest}:{" "}
              <span className="text-gold-text">{best}/100</span>
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ShareButton
              text={dict.quiz.shareText.replace("{score}", String(score))}
              label={dict.quiz.share}
              className="btn-primary"
            />
            <button type="button" className="btn btn-ghost" onClick={restart}>
              {dict.quiz.retry}
            </button>
            <a href="#sejarah" className="btn btn-ghost no-underline">
              {dict.quiz.readHistory}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-line bg-surface p-5 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-teal-deep">
          {dict.quiz.questionOf
            .replace("{current}", String(index + 1))
            .replace("{total}", String(questions.length))}
        </p>
        {best !== null ? (
          <p className="text-[0.68rem] font-semibold text-ink-soft">
            {dict.quiz.bestShort} {best}/100
          </p>
        ) : null}
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-soft">
        <div
          className="h-full rounded-full bg-gold transition-[width] duration-300"
          style={{
            width: `${((index + (selected !== null ? 1 : 0)) / questions.length) * 100}%`,
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
                ? "border-kelor-deep/30 bg-[var(--color-correct-bg)] text-ink"
                : "border-red-200 bg-[var(--color-wrong-bg)] text-ink"
            )}
          >
            <p className="font-bold">
              {selected === current.answerIndex
                ? dict.quiz.correct
                : dict.quiz.wrong.replace(
                    "{answer}",
                    current.options[current.answerIndex]
                  )}
            </p>
            <p className="mt-1 text-ink-soft">{current.explanation}</p>
            <a
              href={current.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[0.7rem] font-bold text-teal-deep underline"
            >
              {dict.quiz.source}: {current.source}
            </a>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-[0.68rem] text-ink-soft">{dict.quiz.choose}</p>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={next}
          disabled={selected === null}
        >
          {index === questions.length - 1
            ? dict.quiz.seeResult
            : dict.quiz.next}
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
      className="rtl:rotate-180"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

