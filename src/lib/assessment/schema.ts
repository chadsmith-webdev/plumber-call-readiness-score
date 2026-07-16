import type {
  AssessmentAnswers,
  GoogleProfileStatus,
  Recency,
  ReviewCount,
  ReviewResponseRate,
  ValidationFailure,
  ValidationResult,
  WebsiteStatus,
} from "./types";
import { cleanOptionalText, cleanText, hasScriptLikeInput } from "../utils/sanitize";
import { normalizeUrl } from "../utils/urls";

const websiteStatuses: WebsiteStatus[] = ["current", "outdated", "basic", "none", "unsure"];
const googleStatuses: GoogleProfileStatus[] = ["managed", "unmanaged", "unsure", "none"];
const reviewCounts: ReviewCount[] = ["100_plus", "50_99", "25_49", "10_24", "1_9", "none", "unsure"];
const recencies: Recency[] = ["seven_days", "thirty_days", "ninety_days", "over_ninety_days", "never", "unsure"];
const responseRates: ReviewResponseRate[] = ["almost_every", "most", "some", "rarely", "never", "no_reviews"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return typeof value === "string" && allowed.includes(value as T) ? (value as T) : fallback;
}

function bool(value: unknown): boolean {
  return value === true;
}

function boolGroup(value: unknown, keys: string[]): Record<string, boolean> {
  const source = isRecord(value) ? value : {};
  return keys.reduce<Record<string, boolean>>((group, key) => {
    group[key] = bool(source[key]);
    return group;
  }, {});
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateText(name: string, value: string, errors: Record<string, string>) {
  if (!value) {
    errors[name] = "This field is required.";
  } else if (hasScriptLikeInput(value)) {
    errors[name] = "Remove script-like characters before continuing.";
  }
}

export function validateAssessmentPayload(payload: unknown): ValidationResult | ValidationFailure {
  const data = isRecord(payload) ? payload : {};
  const errors: Record<string, string> = {};
  const firstName = cleanText(data.firstName, 80);
  const businessName = cleanText(data.businessName, 120);
  const city = cleanText(data.city, 120);
  const email = cleanText(data.email, 160).toLowerCase();
  const mobile = cleanOptionalText(data.mobile, 40);
  const websiteStatus = enumValue(data.websiteStatus, websiteStatuses, "unsure");
  const googleProfileStatus = enumValue(data.googleProfileStatus, googleStatuses, "unsure");
  const websiteUrl = normalizeUrl(data.websiteUrl);
  const googleProfileUrl = normalizeUrl(data.googleProfileUrl);
  const noComparableAssets = bool(data.noComparableAssets);
  const consistencyUnsure = bool(data.consistencyUnsure);

  validateText("firstName", firstName, errors);
  validateText("businessName", businessName, errors);
  validateText("city", city, errors);

  if (!email) {
    errors.email = "Email is required.";
  } else if (!validateEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (data.honeypot) {
    errors.form = "Submission could not be accepted.";
  }

  if (!bool(data.consent)) {
    errors.consent = "Consent is required before we can send the result.";
  }

  if (!["none", "unsure"].includes(websiteStatus) && data.websiteUrl && !websiteUrl) {
    errors.websiteUrl = "Enter a valid website URL.";
  }

  if (!["none", "unsure"].includes(googleProfileStatus) && data.googleProfileUrl && !googleProfileUrl) {
    errors.googleProfileUrl = "Enter a valid Google profile URL.";
  }

  const rawConsistencySignals = boolGroup(data.consistencySignals, [
    "businessNameMatches",
    "phoneMatches",
    "hoursMatch",
    "serviceAreaMatches",
  ]);

  const answers: AssessmentAnswers = {
    firstName,
    businessName,
    city,
    websiteStatus,
    websiteUrl,
    googleProfileStatus,
    googleProfileUrl,
    googleProfileDetails: boolGroup(data.googleProfileDetails, [
      "correctPhone",
      "currentHours",
      "servicesListed",
      "serviceAreaListed",
    ]) as AssessmentAnswers["googleProfileDetails"],
    reviewCount: enumValue(data.reviewCount, reviewCounts, "unsure"),
    reviewRecency: enumValue(data.reviewRecency, recencies, "unsure"),
    reviewResponseRate: enumValue(data.reviewResponseRate, responseRates, "no_reviews"),
    photoRecency: enumValue(data.photoRecency, recencies, "unsure"),
    websiteTrustSignals: boolGroup(data.websiteTrustSignals, [
      "servicesAndAreas",
      "realPhotos",
      "trustProof",
      "mobileFriendly",
    ]) as AssessmentAnswers["websiteTrustSignals"],
    callReadinessSignals: boolGroup(data.callReadinessSignals, [
      "visiblePhone",
      "tapToCall",
      "clearNextStep",
      "responseExpectations",
    ]) as AssessmentAnswers["callReadinessSignals"],
    consistencySignals:
      noComparableAssets || consistencyUnsure
        ? {
            businessNameMatches: false,
            phoneMatches: false,
            hoursMatch: false,
            serviceAreaMatches: false,
          }
        : (rawConsistencySignals as AssessmentAnswers["consistencySignals"]),
    noComparableAssets,
    consistencyUnsure,
    email,
    mobile,
    consent: bool(data.consent),
    honeypot: cleanOptionalText(data.honeypot, 80),
  };

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, answers };
}
