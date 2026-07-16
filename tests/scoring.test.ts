import assert from "node:assert/strict";
import test from "node:test";
import { buildAssessmentResult } from "../src/lib/assessment/buildResult";
import { getBiggestRisk, getCombinedConditions } from "../src/lib/assessment/diagnostics";
import { getResultTier } from "../src/lib/assessment/tiering";
import {
  googleStatusPoints,
  photoRecencyPoints,
  reviewCountPoints,
  reviewRecencyPoints,
  reviewResponsePoints,
  scoreAnswers,
  websiteStatusPoints,
} from "../src/lib/assessment/scoring";
import type { AssessmentAnswers } from "../src/lib/assessment/types";

const baseAnswers: AssessmentAnswers = {
  firstName: "Chad",
  businessName: "Smith Plumbing",
  city: "Austin",
  websiteStatus: "current",
  websiteUrl: "https://example.com",
  googleProfileStatus: "managed",
  googleProfileUrl: "https://example.com/profile",
  googleProfileDetails: {
    correctPhone: true,
    currentHours: true,
    servicesListed: true,
    serviceAreaListed: true,
  },
  reviewCount: "100_plus",
  reviewRecency: "seven_days",
  reviewResponseRate: "almost_every",
  photoRecency: "seven_days",
  websiteTrustSignals: {
    servicesAndAreas: true,
    realPhotos: true,
    trustProof: true,
    mobileFriendly: true,
  },
  callReadinessSignals: {
    visiblePhone: true,
    tapToCall: true,
    clearNextStep: true,
    responseExpectations: true,
  },
  consistencySignals: {
    businessNameMatches: true,
    phoneMatches: true,
    hoursMatch: true,
    serviceAreaMatches: true,
  },
  noComparableAssets: false,
  consistencyUnsure: false,
  email: "owner@example.com",
  consent: true,
};

function answer(overrides: Partial<AssessmentAnswers>): AssessmentAnswers {
  return {
    ...baseAnswers,
    ...overrides,
    googleProfileDetails: {
      ...baseAnswers.googleProfileDetails,
      ...overrides.googleProfileDetails,
    },
    websiteTrustSignals: {
      ...baseAnswers.websiteTrustSignals,
      ...overrides.websiteTrustSignals,
    },
    callReadinessSignals: {
      ...baseAnswers.callReadinessSignals,
      ...overrides.callReadinessSignals,
    },
    consistencySignals: {
      ...baseAnswers.consistencySignals,
      ...overrides.consistencySignals,
    },
  };
}

test("scoring maps match the approved point values", () => {
  assert.equal(googleStatusPoints.managed, 6);
  assert.equal(googleStatusPoints.unmanaged, 3);
  assert.equal(googleStatusPoints.unsure, 1);
  assert.equal(googleStatusPoints.none, 0);
  assert.equal(photoRecencyPoints.ninety_days, 3);
  assert.equal(reviewCountPoints["50_99"], 7);
  assert.equal(reviewRecencyPoints.thirty_days, 6);
  assert.equal(reviewResponsePoints.some, 2);
  assert.equal(websiteStatusPoints.basic, 1);
});

test("perfect score caps every category at 20 and overall at 100", () => {
  const result = buildAssessmentResult(baseAnswers);

  assert.equal(result.overallScore, 100);
  assert.equal(result.categories.length, 5);
  assert.ok(result.categories.every((category) => category.score === 20 && category.maximum === 20));
});

test("zero score and not-sure consistency behavior work", () => {
  const zero = answer({
    websiteStatus: "unsure",
    googleProfileStatus: "none",
    googleProfileDetails: {
      correctPhone: false,
      currentHours: false,
      servicesListed: false,
      serviceAreaListed: false,
    },
    photoRecency: "unsure",
    reviewCount: "unsure",
    reviewRecency: "unsure",
    reviewResponseRate: "no_reviews",
    websiteTrustSignals: {
      servicesAndAreas: false,
      realPhotos: false,
      trustProof: false,
      mobileFriendly: false,
    },
    callReadinessSignals: {
      visiblePhone: false,
      tapToCall: false,
      clearNextStep: false,
      responseExpectations: false,
    },
    consistencySignals: {
      businessNameMatches: true,
      phoneMatches: true,
      hoursMatch: true,
      serviceAreaMatches: true,
    },
    consistencyUnsure: true,
  });
  const categories = scoreAnswers(zero);

  assert.equal(categories.reduce((total, category) => total + category.score, 0), 0);
  assert.equal(categories.find((category) => category.id === "businessConsistency")?.score, 0);
});

test("tier boundaries are deterministic", () => {
  assert.equal(getResultTier(49), "Calls May Be Leaking");
  assert.equal(getResultTier(50), "Trust Is Breaking Down");
  assert.equal(getResultTier(69), "Trust Is Breaking Down");
  assert.equal(getResultTier(70), "Strong Foundation, Noticeable Gaps");
  assert.equal(getResultTier(84), "Strong Foundation, Noticeable Gaps");
  assert.equal(getResultTier(85), "Ready to Earn the Call");
});

test("critical issue priority selects conflicting phone before other risks", () => {
  const risky = answer({
    googleProfileStatus: "unmanaged",
    callReadinessSignals: {
      visiblePhone: false,
      tapToCall: false,
      clearNextStep: true,
      responseExpectations: true,
    },
    consistencySignals: {
      businessNameMatches: true,
      phoneMatches: false,
      hoursMatch: true,
      serviceAreaMatches: true,
    },
  });
  const categories = scoreAnswers(risky);
  const risk = getBiggestRisk({ answers: risky, categories, overallScore: 0 });

  assert.equal(risk.id, "conflicting_phone_information");
});

test("combined conditions are detected", () => {
  const inactive = answer({
    reviewRecency: "over_ninety_days",
    photoRecency: "over_ninety_days",
    reviewResponseRate: "rarely",
  });
  const categories = scoreAnswers(inactive);
  const conditions = getCombinedConditions({ answers: inactive, categories, overallScore: 0 });

  assert.ok(conditions.some((condition) => condition.id === "inactive_appearance"));
});

test("result returns exactly three recommendation families and relevant quick win", () => {
  const result = buildAssessmentResult(
    answer({
      callReadinessSignals: {
        visiblePhone: false,
        tapToCall: false,
        clearNextStep: false,
        responseExpectations: false,
      },
    }),
  );
  const families = new Set(result.recommendations.map((recommendation) => recommendation.issueFamily));

  assert.equal(result.recommendations.length, 3);
  assert.equal(families.size, 3);
  assert.equal(result.recommendations[0].id, "create_mobile_call_path");
  assert.equal(result.quickWin.id, "visible_phone");
});
