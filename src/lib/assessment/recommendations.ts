import type { CategoryResult, Recommendation } from "./types";
import { getBiggestRisk, getCombinedConditions, getHighestCategory, getLowestCategory, recommendationForCategory, type DiagnosticContext } from "./diagnostics";

export const recommendations: Record<string, Recommendation> = {
  claim_google_profile: {
    id: "claim_google_profile",
    issueFamily: "google_access",
    headline: "Claim or Recover the Google Profile",
    whatToFix: "Confirm who owns the profile and begin the recovery process if access is missing.",
    whyItMatters: "Unmanaged profiles can drift out of date and make the business look unattended.",
    howToStart: "Find the profile, choose the ownership option, and document the recovery steps.",
    expectedBenefit: "You regain control over the public information homeowners rely on.",
  },
  create_google_profile: {
    id: "create_google_profile",
    issueFamily: "google_foundation",
    headline: "Create and Verify the Google Business Profile",
    whatToFix: "Set up the core Google profile for the plumbing business.",
    whyItMatters: "A verified profile gives homeowners a trusted local source before they call.",
    howToStart: "Create the profile with the correct name, phone, hours, services, and service area.",
    expectedBenefit: "The business has a clearer local presence to build on.",
  },
  complete_google_information: {
    id: "complete_google_information",
    issueFamily: "google_information",
    headline: "Complete the Core Google Information",
    whatToFix: "Fill in missing profile details such as hours, services, area, or phone information.",
    whyItMatters: "Incomplete basics can weaken trust even when the company is visible.",
    howToStart: "Review the profile fields and update one missing or uncertain detail first.",
    expectedBenefit: "Homeowners see a more current and useful profile.",
  },
  add_recent_photos: {
    id: "add_recent_photos",
    issueFamily: "activity",
    headline: "Add Recent Work Photos",
    whatToFix: "Add current, real photos that show the company is active.",
    whyItMatters: "Old or missing photos can make an active contractor look quiet online.",
    howToStart: "Choose three recent job photos and add them to the Google profile.",
    expectedBenefit: "The profile feels more current and credible.",
  },
  start_review_request_habit: {
    id: "start_review_request_habit",
    issueFamily: "reviews",
    headline: "Start a Simple Review-Request Habit",
    whatToFix: "Ask satisfied customers for reviews soon after completed work.",
    whyItMatters: "Fresh reviews help homeowners trust that the company is active now.",
    howToStart: "Send one review request to a recent satisfied customer this week.",
    expectedBenefit: "Review freshness can improve without a complex campaign.",
  },
  respond_to_reviews: {
    id: "respond_to_reviews",
    issueFamily: "review_responses",
    headline: "Respond to Recent Reviews",
    whatToFix: "Reply to recent reviews in a calm, practical voice.",
    whyItMatters: "Responses show that the company pays attention after the job.",
    howToStart: "Reply to the five newest reviews, starting with the most recent.",
    expectedBenefit: "The profile looks more active and professionally managed.",
  },
  clarify_services_and_areas: {
    id: "clarify_services_and_areas",
    issueFamily: "service_clarity",
    headline: "Clarify Services and Service Areas",
    whatToFix: "Make the main plumbing services and locations easy to understand.",
    whyItMatters: "Homeowners need to know quickly whether the company handles their issue and area.",
    howToStart: "Add one clear sentence naming the primary services and service area.",
    expectedBenefit: "Visitors can decide faster whether to call.",
  },
  add_website_proof: {
    id: "add_website_proof",
    issueFamily: "website_proof",
    headline: "Add Real Website Proof",
    whatToFix: "Place a trust signal near the main call action.",
    whyItMatters: "Proof near the point of contact can reduce hesitation.",
    howToStart: "Add one customer review, credential, insurance note, or experience marker near the CTA.",
    expectedBenefit: "The site has more support at the decision point.",
  },
  create_mobile_call_path: {
    id: "create_mobile_call_path",
    issueFamily: "contact_path",
    headline: "Create a Clear Mobile Call Path",
    whatToFix: "Make the phone number visible and tappable on mobile.",
    whyItMatters: "A homeowner ready to call should not have to hunt for the number.",
    howToStart: "Add a visible phone link in the header or first screen of the site.",
    expectedBenefit: "Mobile visitors have a cleaner path from interest to call.",
  },
  create_clear_cta: {
    id: "create_clear_cta",
    issueFamily: "next_step",
    headline: "Create One Clear Next Step",
    whatToFix: "Choose one primary action and make it consistent.",
    whyItMatters: "Multiple unclear actions can dilute the path to contact.",
    howToStart: "Use one primary call action such as Call Now or Request Service.",
    expectedBenefit: "Visitors know what to do next.",
  },
  correct_conflicting_information: {
    id: "correct_conflicting_information",
    issueFamily: "consistency",
    headline: "Correct Conflicting Information",
    whatToFix: "Align phone, hours, name, and service area across public assets.",
    whyItMatters: "Conflicts create doubt and can send calls to the wrong place.",
    howToStart: "Start with the phone number, then verify the other core details.",
    expectedBenefit: "The business looks more trustworthy and easier to contact.",
  },
  build_on_reviews: {
    id: "build_on_reviews",
    issueFamily: "review_strength",
    headline: "Build on Strong Reviews",
    whatToFix: "Use existing review strength more visibly.",
    whyItMatters: "Good reviews can help if homeowners see them at the right moment.",
    howToStart: "Feature a recent review near the main call action or service proof.",
    expectedBenefit: "A strong asset supports more of the contact path.",
  },
  build_on_website: {
    id: "build_on_website",
    issueFamily: "website_strength",
    headline: "Build on Website Trust",
    whatToFix: "Use the strongest website trust signals more intentionally.",
    whyItMatters: "A credible website can support Google and review confidence.",
    howToStart: "Move the best proof closer to the primary call action.",
    expectedBenefit: "Trust signals work harder where hesitation happens.",
  },
  quarterly_information_check: {
    id: "quarterly_information_check",
    issueFamily: "maintenance",
    headline: "Perform a Quarterly Information Check",
    whatToFix: "Schedule a recurring review of public business information.",
    whyItMatters: "Even strong profiles can decay when hours, services, or areas change.",
    howToStart: "Add a calendar reminder to review Google, website, and directory details.",
    expectedBenefit: "The foundation stays accurate as the business changes.",
  },
};

function strongestAssetRecommendation(category: CategoryResult): string {
  if (category.id === "reviewConfidence") return "build_on_reviews";
  if (category.id === "websiteTrust") return "build_on_website";
  if (category.id === "googlePresence") return "add_recent_photos";
  if (category.id === "callReadiness") return "quarterly_information_check";
  return "quarterly_information_check";
}

export function selectRecommendations(context: DiagnosticContext): Recommendation[] {
  const risk = getBiggestRisk(context);
  const lowest = getLowestCategory(context.categories);
  const highest = getHighestCategory(context.categories);
  const candidates = [
    risk.recommendationId,
    recommendationForCategory(lowest.id),
    ...getCombinedConditions(context).map((condition) => condition.recommendationId),
    fastestUsefulRecommendation(context),
    strongestAssetRecommendation(highest),
    "quarterly_information_check",
  ];
  const selected: Recommendation[] = [];
  const families = new Set<string>();

  for (const id of candidates) {
    const recommendation = recommendations[id];
    if (!recommendation || families.has(recommendation.issueFamily)) {
      continue;
    }

    selected.push(recommendation);
    families.add(recommendation.issueFamily);

    if (selected.length === 3) {
      break;
    }
  }

  return selected;
}

function fastestUsefulRecommendation(context: DiagnosticContext): string {
  const { answers } = context;

  if (!answers.googleProfileDetails.servicesListed || !answers.googleProfileDetails.serviceAreaListed) {
    return "complete_google_information";
  }

  if (answers.photoRecency === "over_ninety_days" || answers.photoRecency === "never" || answers.photoRecency === "unsure") {
    return "add_recent_photos";
  }

  if (answers.reviewRecency === "over_ninety_days" || answers.reviewRecency === "never" || answers.reviewRecency === "unsure") {
    return "start_review_request_habit";
  }

  if (!answers.websiteTrustSignals.servicesAndAreas) {
    return "clarify_services_and_areas";
  }

  if (!answers.callReadinessSignals.clearNextStep) {
    return "create_clear_cta";
  }

  return "quarterly_information_check";
}
