import type { AssessmentAnswers, CategoryResult, CategoryStatus } from "./types";

export const googleStatusPoints = {
  managed: 6,
  unmanaged: 3,
  unsure: 1,
  none: 0,
} as const;

export const photoRecencyPoints = {
  seven_days: 6,
  thirty_days: 5,
  ninety_days: 3,
  over_ninety_days: 1,
  never: 0,
  unsure: 0,
} as const;

export const reviewCountPoints = {
  "100_plus": 8,
  "50_99": 7,
  "25_49": 5,
  "10_24": 3,
  "1_9": 1,
  none: 0,
  unsure: 0,
} as const;

export const reviewRecencyPoints = {
  seven_days: 7,
  thirty_days: 6,
  ninety_days: 4,
  over_ninety_days: 1,
  never: 0,
  unsure: 0,
} as const;

export const reviewResponsePoints = {
  almost_every: 5,
  most: 4,
  some: 2,
  rarely: 1,
  never: 0,
  no_reviews: 0,
} as const;

export const websiteStatusPoints = {
  current: 4,
  outdated: 2,
  basic: 1,
  none: 0,
  unsure: 0,
} as const;

function countChecked(record: Record<string, boolean>, pointsEach: number): number {
  return Object.values(record).filter(Boolean).length * pointsEach;
}

export function getCategoryStatus(score: number): CategoryStatus {
  if (score >= 16) return "Strong";
  if (score >= 12) return "Stable";
  if (score >= 8) return "Needs Attention";
  return "High Priority";
}

export function scoreAnswers(answers: AssessmentAnswers): CategoryResult[] {
  const googlePresence =
    googleStatusPoints[answers.googleProfileStatus] +
    countChecked(answers.googleProfileDetails, 2) +
    photoRecencyPoints[answers.photoRecency];

  const reviewConfidence =
    reviewCountPoints[answers.reviewCount] +
    reviewRecencyPoints[answers.reviewRecency] +
    reviewResponsePoints[answers.reviewResponseRate];

  const websiteTrust =
    websiteStatusPoints[answers.websiteStatus] + countChecked(answers.websiteTrustSignals, 4);

  const callReadiness = countChecked(answers.callReadinessSignals, 5);

  const businessConsistency =
    answers.noComparableAssets || answers.consistencyUnsure
      ? 0
      : countChecked(answers.consistencySignals, 5);

  return [
    {
      id: "googlePresence",
      name: "Google Presence",
      score: Math.min(20, googlePresence),
      maximum: 20,
      status: getCategoryStatus(googlePresence),
      description: "Profile access, core information, services, area, and recent photos.",
    },
    {
      id: "reviewConfidence",
      name: "Review Confidence",
      score: Math.min(20, reviewConfidence),
      maximum: 20,
      status: getCategoryStatus(reviewConfidence),
      description: "Review volume, freshness, and response habits.",
    },
    {
      id: "websiteTrust",
      name: "Website Trust",
      score: Math.min(20, websiteTrust),
      maximum: 20,
      status: getCategoryStatus(websiteTrust),
      description: "Clarity, proof, photos, and mobile trust signals.",
    },
    {
      id: "callReadiness",
      name: "Call Readiness",
      score: Math.min(20, callReadiness),
      maximum: 20,
      status: getCategoryStatus(callReadiness),
      description: "How clearly a homeowner can call or choose the next step.",
    },
    {
      id: "businessConsistency",
      name: "Business Consistency",
      score: Math.min(20, businessConsistency),
      maximum: 20,
      status: getCategoryStatus(businessConsistency),
      description: "Whether business details match across the website and Google profile.",
    },
  ];
}

export function getOverallScore(categories: CategoryResult[]): number {
  return categories.reduce((total, category) => total + category.score, 0);
}
