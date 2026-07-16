"use client";

import type { AssessmentAnswers, AssessmentResult } from "../assessment/types";

const RESULT_KEY = "plumber-call-readiness-result";
const ANSWERS_KEY = "plumber-call-readiness-answers";

export function saveResult(result: AssessmentResult) {
  sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function readResult(): AssessmentResult | null {
  const raw = sessionStorage.getItem(RESULT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AssessmentResult;
  } catch {
    return null;
  }
}

export function saveDraftAnswers(answers: AssessmentAnswers) {
  sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function readDraftAnswers(): Partial<AssessmentAnswers> | null {
  const raw = sessionStorage.getItem(ANSWERS_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Partial<AssessmentAnswers>;
  } catch {
    return null;
  }
}
