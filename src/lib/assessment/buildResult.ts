import { getBiggestRisk, getCombinedConditions, getHighestCategory, getLowestCategory } from "./diagnostics";
import { selectQuickWin } from "./quickWins";
import { selectRecommendations } from "./recommendations";
import { getOverallScore, scoreAnswers } from "./scoring";
import { getResultTier, getSummary, getTierHeadline } from "./tiering";
import type { AssessmentAnswers, AssessmentResult, CategoryResult } from "./types";

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `assessment_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function buildStrength(category: CategoryResult) {
  return {
    id: category.id,
    headline: `${category.name} Is Your Strongest Area`,
    explanation: `${category.name} scored ${category.score}/20, making it the strongest part of this result.`,
    nextStep: "Keep this asset current and use it to support weaker parts of the call path.",
  };
}

export function buildAssessmentResult(answers: AssessmentAnswers, now = new Date()): AssessmentResult {
  const categories = scoreAnswers(answers);
  const overallScore = getOverallScore(categories);
  const context = { answers, categories, overallScore };
  const highestCategory = getHighestCategory(categories);
  const lowestCategory = getLowestCategory(categories);
  const combinedConditions = getCombinedConditions(context);

  return {
    assessmentId: makeId(),
    businessName: answers.businessName,
    city: answers.city,
    overallScore,
    tier: getResultTier(overallScore),
    tierHeadline: getTierHeadline(overallScore),
    summary: getSummary(overallScore, answers.businessName),
    categories,
    highestCategory,
    lowestCategory,
    biggestRisk: getBiggestRisk(context),
    biggestStrength: buildStrength(highestCategory),
    recommendations: selectRecommendations(context),
    quickWin: selectQuickWin(context),
    triggeredConditions: combinedConditions.map((condition) => condition.label),
    createdAt: now.toISOString(),
  };
}
