import type { AssessmentAnswers, CategoryId, CategoryResult } from "./types";

export interface DiagnosticContext {
  answers: AssessmentAnswers;
  categories: CategoryResult[];
  overallScore: number;
}

export interface RiskDiagnostic {
  id: string;
  headline: string;
  explanation: string;
  impact: string;
  recommendationId: string;
}

export interface CombinedCondition {
  id: string;
  recommendationId: string;
  label: string;
}

const lowestPriority: CategoryId[] = [
  "callReadiness",
  "businessConsistency",
  "googlePresence",
  "reviewConfidence",
  "websiteTrust",
];

const highestPriority: CategoryId[] = [
  "reviewConfidence",
  "websiteTrust",
  "googlePresence",
  "callReadiness",
  "businessConsistency",
];

export function findCategory(categories: CategoryResult[], id: CategoryId): CategoryResult {
  const category = categories.find((item) => item.id === id);
  if (!category) {
    throw new Error(`Missing category: ${id}`);
  }
  return category;
}

export function getLowestCategory(categories: CategoryResult[]): CategoryResult {
  return [...categories].sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return lowestPriority.indexOf(a.id) - lowestPriority.indexOf(b.id);
  })[0];
}

export function getHighestCategory(categories: CategoryResult[]): CategoryResult {
  return [...categories].sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    return highestPriority.indexOf(a.id) - highestPriority.indexOf(b.id);
  })[0];
}

export function getBiggestRisk(context: DiagnosticContext): RiskDiagnostic {
  const { answers, categories } = context;
  const googlePresence = findCategory(categories, "googlePresence").score;
  const comparableAssets = !answers.noComparableAssets && !answers.consistencyUnsure;

  if (answers.consistencySignals.phoneMatches === false && comparableAssets) {
    return {
      id: "conflicting_phone_information",
      headline: "Conflicting Phone Information",
      explanation: "The phone number may not match across the website and Google profile.",
      impact: "A homeowner can hesitate or call the wrong number when contact details conflict.",
      recommendationId: "correct_conflicting_information",
    };
  }

  if (!answers.callReadinessSignals.visiblePhone && !answers.callReadinessSignals.tapToCall) {
    return {
      id: "contact_friction",
      headline: "Contact Friction",
      explanation: "The phone number is not easy to see and mobile visitors may not be able to tap to call.",
      impact: "Interested homeowners may leave before taking the next step.",
      recommendationId: "create_mobile_call_path",
    };
  }

  if (answers.googleProfileStatus === "none") {
    return {
      id: "missing_google_presence",
      headline: "Missing Google Presence",
      explanation: "The business does not appear to have a Google Business Profile in place.",
      impact: "Homeowners may not find enough trusted local information before calling.",
      recommendationId: "create_google_profile",
    };
  }

  if (answers.googleProfileStatus === "unmanaged") {
    return {
      id: "google_profile_access",
      headline: "Google Profile Access",
      explanation: "The profile exists but does not appear to be actively managed.",
      impact: "Important profile details, reviews, photos, and updates may be left unattended.",
      recommendationId: "claim_google_profile",
    };
  }

  if (answers.websiteStatus === "none" && googlePresence < 8) {
    return {
      id: "weak_online_foundation",
      headline: "Weak Online Foundation",
      explanation: "No website and a weak Google presence leave too little for homeowners to trust.",
      impact: "The business may be discoverable in some places but thin at the decision point.",
      recommendationId: "complete_google_information",
    };
  }

  const lowest = getLowestCategory(categories);
  return {
    id: lowest.id,
    headline: `${lowest.name} Needs Attention`,
    explanation: `${lowest.name} is the lowest-scoring category in this result.`,
    impact: "Fixing the lowest category first usually removes the most immediate friction.",
    recommendationId: recommendationForCategory(lowest.id),
  };
}

export function getCombinedConditions(context: DiagnosticContext): CombinedCondition[] {
  const { answers, categories } = context;
  const googlePresence = findCategory(categories, "googlePresence").score;
  const reviewConfidence = findCategory(categories, "reviewConfidence").score;
  const websiteTrust = findCategory(categories, "websiteTrust").score;
  const callReadiness = findCategory(categories, "callReadiness").score;
  const weakCount = categories.filter((category) => category.score < 8).length;
  const oldReview = ["over_ninety_days", "never", "unsure"].includes(answers.reviewRecency);
  const oldPhoto = ["over_ninety_days", "never", "unsure"].includes(answers.photoRecency);
  const weakResponses = ["rarely", "never", "no_reviews"].includes(answers.reviewResponseRate);
  const conditions: CombinedCondition[] = [];

  if (oldReview && oldPhoto && weakResponses) {
    conditions.push({
      id: "inactive_appearance",
      label: "Inactive appearance",
      recommendationId: "add_recent_photos",
    });
  }

  if (googlePresence >= 12 && websiteTrust < 8 && reviewConfidence < 10) {
    conditions.push({
      id: "visible_but_unconvincing",
      label: "Visible but unconvincing",
      recommendationId: "add_website_proof",
    });
  }

  if (reviewConfidence >= 16 && websiteTrust >= 12 && callReadiness < 10) {
    conditions.push({
      id: "trusted_but_difficult_to_contact",
      label: "Trusted but difficult to contact",
      recommendationId: "create_mobile_call_path",
    });
  }

  if (weakCount >= 3) {
    conditions.push({
      id: "weak_overall_foundation",
      label: "Weak overall foundation",
      recommendationId: "complete_google_information",
    });
  }

  return conditions;
}

export function recommendationForCategory(categoryId: CategoryId): string {
  const map: Record<CategoryId, string> = {
    googlePresence: "complete_google_information",
    reviewConfidence: "start_review_request_habit",
    websiteTrust: "add_website_proof",
    callReadiness: "create_clear_cta",
    businessConsistency: "correct_conflicting_information",
  };

  return map[categoryId];
}
