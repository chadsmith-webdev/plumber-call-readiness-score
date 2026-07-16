export type WebsiteStatus = "current" | "outdated" | "basic" | "none" | "unsure";

export type GoogleProfileStatus = "managed" | "unmanaged" | "unsure" | "none";

export type ReviewCount =
  | "100_plus"
  | "50_99"
  | "25_49"
  | "10_24"
  | "1_9"
  | "none"
  | "unsure";

export type Recency =
  | "seven_days"
  | "thirty_days"
  | "ninety_days"
  | "over_ninety_days"
  | "never"
  | "unsure";

export type ReviewResponseRate =
  | "almost_every"
  | "most"
  | "some"
  | "rarely"
  | "never"
  | "no_reviews";

export interface AssessmentAnswers {
  firstName: string;
  businessName: string;
  city: string;
  websiteStatus: WebsiteStatus;
  websiteUrl?: string;
  googleProfileStatus: GoogleProfileStatus;
  googleProfileUrl?: string;
  googleProfileDetails: {
    correctPhone: boolean;
    currentHours: boolean;
    servicesListed: boolean;
    serviceAreaListed: boolean;
  };
  reviewCount: ReviewCount;
  reviewRecency: Recency;
  reviewResponseRate: ReviewResponseRate;
  photoRecency: Recency;
  websiteTrustSignals: {
    servicesAndAreas: boolean;
    realPhotos: boolean;
    trustProof: boolean;
    mobileFriendly: boolean;
  };
  callReadinessSignals: {
    visiblePhone: boolean;
    tapToCall: boolean;
    clearNextStep: boolean;
    responseExpectations: boolean;
  };
  consistencySignals: {
    businessNameMatches: boolean;
    phoneMatches: boolean;
    hoursMatch: boolean;
    serviceAreaMatches: boolean;
  };
  noComparableAssets: boolean;
  consistencyUnsure: boolean;
  email: string;
  mobile?: string;
  consent: boolean;
  honeypot?: string;
}

export type CategoryId =
  | "googlePresence"
  | "reviewConfidence"
  | "websiteTrust"
  | "callReadiness"
  | "businessConsistency";

export type CategoryStatus = "Strong" | "Stable" | "Needs Attention" | "High Priority";

export interface CategoryResult {
  id: CategoryId;
  name: string;
  score: number;
  maximum: 20;
  status: CategoryStatus;
  description: string;
}

export interface Recommendation {
  id: string;
  issueFamily: string;
  headline: string;
  whatToFix: string;
  whyItMatters: string;
  howToStart: string;
  expectedBenefit: string;
}

export interface QuickWin {
  id: string;
  headline: string;
  action: string;
  estimatedTime: string;
  expectedBenefit: string;
}

export interface AssessmentResult {
  assessmentId: string;
  businessName: string;
  city: string;
  overallScore: number;
  tier: string;
  tierHeadline: string;
  summary: string;
  categories: CategoryResult[];
  highestCategory: CategoryResult;
  lowestCategory: CategoryResult;
  biggestRisk: {
    id: string;
    headline: string;
    explanation: string;
    impact: string;
  };
  biggestStrength: {
    id: string;
    headline: string;
    explanation: string;
    nextStep: string;
  };
  recommendations: Recommendation[];
  quickWin: QuickWin;
  triggeredConditions: string[];
  createdAt: string;
}

export interface ValidationResult {
  ok: true;
  answers: AssessmentAnswers;
}

export interface ValidationFailure {
  ok: false;
  errors: Record<string, string>;
}
