import type { DiagnosticContext } from "./diagnostics";
import type { QuickWin } from "./types";

const quickWins: Record<string, QuickWin> = {
  conflicting_phone: {
    id: "conflicting_phone",
    headline: "Correct the Phone Number Everywhere",
    action: "Check the website and Google profile, then update the phone number wherever it differs.",
    estimatedTime: "15-30 minutes",
    expectedBenefit: "Homeowners are less likely to hesitate or call the wrong number.",
  },
  visible_phone: {
    id: "visible_phone",
    headline: "Make the Phone Number Visible",
    action: "Add the phone number to the site header or first screen.",
    estimatedTime: "15 minutes",
    expectedBenefit: "Visitors can find the call path faster.",
  },
  tap_to_call: {
    id: "tap_to_call",
    headline: "Add Tap-to-Call",
    action: "Turn the mobile phone number into a telephone link.",
    estimatedTime: "10-20 minutes",
    expectedBenefit: "Mobile visitors can call without copying the number.",
  },
  google_recovery: {
    id: "google_recovery",
    headline: "Begin Google Profile Recovery",
    action: "Start the Google ownership or recovery process for the existing profile.",
    estimatedTime: "20-30 minutes",
    expectedBenefit: "You start regaining control of the public profile.",
  },
  google_field: {
    id: "google_field",
    headline: "Complete One Missing Google Field",
    action: "Update one missing core field such as hours, services, service area, or phone.",
    estimatedTime: "10-15 minutes",
    expectedBenefit: "The profile becomes more useful and current.",
  },
  photos: {
    id: "photos",
    headline: "Add Three Recent Work Photos",
    action: "Upload three recent, real job photos to the Google profile.",
    estimatedTime: "15-20 minutes",
    expectedBenefit: "The business looks more active online.",
  },
  review_request: {
    id: "review_request",
    headline: "Request One Recent Review",
    action: "Ask one recently satisfied customer for a review.",
    estimatedTime: "5-10 minutes",
    expectedBenefit: "Review freshness begins moving in the right direction.",
  },
  review_replies: {
    id: "review_replies",
    headline: "Reply to Five Recent Reviews",
    action: "Respond to the five newest reviews in a clear, practical voice.",
    estimatedTime: "20-30 minutes",
    expectedBenefit: "The profile looks more actively managed.",
  },
  services: {
    id: "services",
    headline: "Clarify Services and Service Area",
    action: "Add one plain sentence naming the core services and area served.",
    estimatedTime: "15 minutes",
    expectedBenefit: "Homeowners can decide faster whether the business fits their need.",
  },
  proof: {
    id: "proof",
    headline: "Place Proof Near the Call Action",
    action: "Add one customer review or trust marker near the main website CTA.",
    estimatedTime: "20 minutes",
    expectedBenefit: "Trust support appears where hesitation often happens.",
  },
  cta: {
    id: "cta",
    headline: "Choose One Primary CTA",
    action: "Pick one main action and make it consistent across the first screen.",
    estimatedTime: "15 minutes",
    expectedBenefit: "Visitors know what to do next.",
  },
  quarterly: {
    id: "quarterly",
    headline: "Schedule a Quarterly Accuracy Review",
    action: "Set a recurring reminder to check Google, website, and public business details.",
    estimatedTime: "5 minutes",
    expectedBenefit: "Strong assets are less likely to drift out of date.",
  },
};

export function selectQuickWin(context: DiagnosticContext): QuickWin {
  const { answers } = context;
  const comparableAssets = !answers.noComparableAssets && !answers.consistencyUnsure;

  if (!answers.consistencySignals.phoneMatches && comparableAssets) return quickWins.conflicting_phone;
  if (!answers.callReadinessSignals.visiblePhone) return quickWins.visible_phone;
  if (!answers.callReadinessSignals.tapToCall) return quickWins.tap_to_call;
  if (answers.googleProfileStatus === "unmanaged") return quickWins.google_recovery;
  if (Object.values(answers.googleProfileDetails).some((value) => !value)) return quickWins.google_field;
  if (["over_ninety_days", "never", "unsure"].includes(answers.photoRecency)) return quickWins.photos;
  if (["over_ninety_days", "never", "unsure"].includes(answers.reviewRecency)) return quickWins.review_request;
  if (["rarely", "never"].includes(answers.reviewResponseRate)) return quickWins.review_replies;
  if (!answers.websiteTrustSignals.servicesAndAreas) return quickWins.services;
  if (!answers.websiteTrustSignals.trustProof) return quickWins.proof;
  if (!answers.callReadinessSignals.clearNextStep) return quickWins.cta;

  return quickWins.quarterly;
}
