"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/integrations/analytics";
import { saveDraftAnswers, saveResult, readDraftAnswers } from "@/lib/storage/resultSession";
import type { AssessmentAnswers, AssessmentResult } from "@/lib/assessment/types";
import styles from "./AssessmentForm.module.css";

type StepId = 0 | 1 | 2 | 3 | 4;
type ErrorMap = Record<string, string>;

const stepLabels = [
  "Step 1 of 5: Your Business",
  "Step 2 of 5: Google Presence",
  "Step 3 of 5: Reviews",
  "Step 4 of 5: Website and Calls",
  "Step 5 of 5: Information Check",
] as const;

const initialAnswers: AssessmentAnswers = {
  firstName: "",
  businessName: "",
  city: "",
  websiteStatus: "unsure",
  websiteUrl: "",
  googleProfileStatus: "unsure",
  googleProfileUrl: "",
  googleProfileDetails: {
    correctPhone: false,
    currentHours: false,
    servicesListed: false,
    serviceAreaListed: false,
  },
  reviewCount: "unsure",
  reviewRecency: "unsure",
  reviewResponseRate: "no_reviews",
  photoRecency: "unsure",
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
    businessNameMatches: false,
    phoneMatches: false,
    hoursMatch: false,
    serviceAreaMatches: false,
  },
  noComparableAssets: false,
  consistencyUnsure: false,
  email: "",
  mobile: "",
  consent: false,
  honeypot: "",
};

const websiteStatusOptions = [
  ["current", "Current and useful"],
  ["outdated", "Outdated"],
  ["basic", "Basic"],
  ["none", "No website"],
  ["unsure", "Not sure"],
] as const;

const googleStatusOptions = [
  ["managed", "Claimed and managed"],
  ["unmanaged", "Exists but unmanaged"],
  ["unsure", "Not sure"],
  ["none", "No Google profile"],
] as const;

const recencyOptions = [
  ["seven_days", "Within 7 days"],
  ["thirty_days", "Within 30 days"],
  ["ninety_days", "Within 90 days"],
  ["over_ninety_days", "Over 90 days"],
  ["never", "Never"],
  ["unsure", "Not sure"],
] as const;

const reviewCountOptions = [
  ["100_plus", "100+"],
  ["50_99", "50-99"],
  ["25_49", "25-49"],
  ["10_24", "10-24"],
  ["1_9", "1-9"],
  ["none", "None"],
  ["unsure", "Not sure"],
] as const;

const responseOptions = [
  ["almost_every", "Almost every review"],
  ["most", "Most reviews"],
  ["some", "Some reviews"],
  ["rarely", "Rarely"],
  ["never", "Never"],
  ["no_reviews", "No reviews"],
] as const;

const googleDetailOptions = [
  ["correctPhone", "Correct phone"],
  ["currentHours", "Current hours"],
  ["servicesListed", "Services listed"],
  ["serviceAreaListed", "Service area listed"],
] as const;

const websiteTrustOptions = [
  ["servicesAndAreas", "Services and service areas are clear"],
  ["realPhotos", "Real photos are present"],
  ["trustProof", "Reviews, credentials, experience, insurance, or other proof is present"],
  ["mobileFriendly", "Website is current and mobile-friendly"],
] as const;

const callReadinessOptions = [
  ["visiblePhone", "Phone number is easy to see"],
  ["tapToCall", "Mobile visitors can tap to call"],
  ["clearNextStep", "One clear next step is present"],
  ["responseExpectations", "Response or availability expectations are explained"],
] as const;

const consistencyOptions = [
  ["businessNameMatches", "Business name matches"],
  ["phoneMatches", "Phone number matches"],
  ["hoursMatch", "Business hours match"],
  ["serviceAreaMatches", "Service area matches"],
] as const;

export function AssessmentForm() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>(initialAnswers);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const progress = useMemo(() => `${((step + 1) / stepLabels.length) * 100}%`, [step]);

  useEffect(() => {
    const draft = readDraftAnswers();
    if (draft) {
      queueMicrotask(() => {
        setAnswers((current) => ({ ...current, ...draft }));
      });
    }
    trackEvent("assessment_started", { step: 1 });
  }, []);

  useEffect(() => {
    saveDraftAnswers(answers);
  }, [answers]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorRef.current?.focus();
    }
  }, [errors]);

  function update<K extends keyof AssessmentAnswers>(key: K, value: AssessmentAnswers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function updateGroup<T extends keyof Pick<
    AssessmentAnswers,
    "googleProfileDetails" | "websiteTrustSignals" | "callReadinessSignals" | "consistencySignals"
  >>(group: T, key: keyof AssessmentAnswers[T], value: boolean) {
    setAnswers((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [key]: value,
      },
    }));
  }

  function validateStep(currentStep: StepId): ErrorMap {
    const nextErrors: ErrorMap = {};

    if (currentStep === 0) {
      if (!answers.firstName.trim()) nextErrors.firstName = "First name is required.";
      if (!answers.businessName.trim()) nextErrors.businessName = "Business name is required.";
      if (!answers.city.trim()) nextErrors.city = "City or service area is required.";
      if (!["none", "unsure"].includes(answers.websiteStatus) && answers.websiteUrl) {
        try {
          new URL(/^https?:\/\//.test(answers.websiteUrl) ? answers.websiteUrl : `https://${answers.websiteUrl}`);
        } catch {
          nextErrors.websiteUrl = "Enter a valid website URL.";
        }
      }
    }

    if (currentStep === 1 && !["none", "unsure"].includes(answers.googleProfileStatus) && answers.googleProfileUrl) {
      try {
        new URL(
          /^https?:\/\//.test(answers.googleProfileUrl)
            ? answers.googleProfileUrl
            : `https://${answers.googleProfileUrl}`,
        );
      } catch {
        nextErrors.googleProfileUrl = "Enter a valid Google profile URL.";
      }
    }

    if (currentStep === 4) {
      if (!answers.email.trim()) nextErrors.email = "Email is required.";
      if (answers.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email)) {
        nextErrors.email = "Enter a valid email address.";
      }
      if (!answers.consent) nextErrors.consent = "Consent is required.";
    }

    return nextErrors;
  }

  function handleNext() {
    const nextErrors = validateStep(step);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      trackEvent("assessment_validation_error", { step: step + 1 });
      return;
    }

    setErrors({});
    trackEvent("assessment_step_completed", { step: step + 1 });
    setStep((current) => Math.min(current + 1, 4) as StepId);
  }

  function handleBack() {
    trackEvent("assessment_back_clicked", { step: step + 1 });
    setErrors({});
    setStep((current) => Math.max(current - 1, 0) as StepId);
  }

  async function handleSubmit() {
    const nextErrors = validateStep(4);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      trackEvent("assessment_validation_error", { step: 5 });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    trackEvent("assessment_submitted", { step: 5 });
    trackEvent("email_captured", { step: 5 });

    const response = await fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    });

    const body = (await response.json()) as { result?: AssessmentResult; errors?: ErrorMap };

    if (!response.ok || !body.result) {
      setIsSubmitting(false);
      setErrors(body.errors ?? { form: "The assessment could not be scored. Please try again." });
      trackEvent("assessment_failed", { step: 5 });
      return;
    }

    saveResult(body.result);
    trackEvent("assessment_completed", {
      scoreBand: Math.floor(body.result.overallScore / 10) * 10,
      lowestCategory: body.result.lowestCategory.id,
    });
    trackEvent("result_generated", {
      scoreBand: Math.floor(body.result.overallScore / 10) * 10,
      lowestCategory: body.result.lowestCategory.id,
    });
    router.push("/result");
  }

  function renderErrorSummary() {
    const entries = Object.entries(errors);
    if (entries.length === 0) return null;

    return (
      <div className={styles.errorSummary} tabIndex={-1} ref={errorRef} aria-live="assertive">
        <h2>Check these fields before continuing</h2>
        <ul>
          {entries.map(([field, message]) => (
            <li key={field}>
              <a href={`#${field}`}>{message}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.progressText}>{stepLabels[step]}</div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span style={{ width: progress }} />
      </div>
      {renderErrorSummary()}

      <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
        <input
          aria-hidden="true"
          autoComplete="off"
          className={styles.honeypot}
          id="honeypot"
          name="company_website"
          tabIndex={-1}
          value={answers.honeypot}
          onChange={(event) => update("honeypot", event.target.value)}
        />

        {step === 0 && (
          <section className={styles.stepPanel} aria-labelledby="business-step">
            <h2 id="business-step">Your Business</h2>
            <div className={styles.fieldGrid}>
              <TextField id="firstName" label="First name" value={answers.firstName} error={errors.firstName} onChange={(value) => update("firstName", value)} />
              <TextField id="businessName" label="Business name" value={answers.businessName} error={errors.businessName} onChange={(value) => update("businessName", value)} />
              <TextField id="city" label="Primary city or service area" value={answers.city} error={errors.city} onChange={(value) => update("city", value)} />
            </div>
            <RadioGroup
              legend="Website status"
              name="websiteStatus"
              value={answers.websiteStatus}
              options={websiteStatusOptions}
              onChange={(value) => update("websiteStatus", value)}
            />
            {!["none", "unsure"].includes(answers.websiteStatus) && (
              <TextField id="websiteUrl" label="Website URL" value={answers.websiteUrl ?? ""} error={errors.websiteUrl} onChange={(value) => update("websiteUrl", value)} />
            )}
          </section>
        )}

        {step === 1 && (
          <section className={styles.stepPanel} aria-labelledby="google-step">
            <h2 id="google-step">Google Presence</h2>
            <RadioGroup
              legend="Google profile status"
              name="googleProfileStatus"
              value={answers.googleProfileStatus}
              options={googleStatusOptions}
              onChange={(value) => update("googleProfileStatus", value)}
            />
            {!["none", "unsure"].includes(answers.googleProfileStatus) && (
              <TextField id="googleProfileUrl" label="Google profile URL" value={answers.googleProfileUrl ?? ""} error={errors.googleProfileUrl} onChange={(value) => update("googleProfileUrl", value)} />
            )}
            <CheckboxGroup
              legend="Profile details"
              options={googleDetailOptions}
              values={answers.googleProfileDetails}
              onChange={(key, value) => updateGroup("googleProfileDetails", key, value)}
            />
            <RadioGroup
              legend="Photo recency"
              name="photoRecency"
              value={answers.photoRecency}
              options={recencyOptions}
              onChange={(value) => update("photoRecency", value)}
            />
          </section>
        )}

        {step === 2 && (
          <section className={styles.stepPanel} aria-labelledby="reviews-step">
            <h2 id="reviews-step">Reviews</h2>
            <RadioGroup legend="Review quantity" name="reviewCount" value={answers.reviewCount} options={reviewCountOptions} onChange={(value) => update("reviewCount", value)} />
            <RadioGroup legend="Review recency" name="reviewRecency" value={answers.reviewRecency} options={recencyOptions} onChange={(value) => update("reviewRecency", value)} />
            <RadioGroup legend="Review responses" name="reviewResponseRate" value={answers.reviewResponseRate} options={responseOptions} onChange={(value) => update("reviewResponseRate", value)} />
          </section>
        )}

        {step === 3 && (
          <section className={styles.stepPanel} aria-labelledby="website-calls-step">
            <h2 id="website-calls-step">Website and Calls</h2>
            <CheckboxGroup
              legend="Website trust"
              options={websiteTrustOptions}
              values={answers.websiteTrustSignals}
              onChange={(key, value) => updateGroup("websiteTrustSignals", key, value)}
            />
            <CheckboxGroup
              legend="Call readiness"
              options={callReadinessOptions}
              values={answers.callReadinessSignals}
              onChange={(key, value) => updateGroup("callReadinessSignals", key, value)}
            />
          </section>
        )}

        {step === 4 && (
          <section className={styles.stepPanel} aria-labelledby="information-step">
            <h2 id="information-step">Information Check</h2>
            <div className={styles.notice}>
              Select the consistency items that match. If you do not have both a website and Google profile, or you are not sure, choose the option below.
            </div>
            <CheckboxGroup
              legend="Consistency"
              options={consistencyOptions}
              values={answers.consistencySignals}
              disabled={answers.noComparableAssets || answers.consistencyUnsure}
              onChange={(key, value) => updateGroup("consistencySignals", key, value)}
            />
            <fieldset className={styles.optionGroup}>
              <legend>Alternative options</legend>
              <label className={styles.checkOption}>
                <input
                  type="checkbox"
                  checked={answers.noComparableAssets}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    update("noComparableAssets", checked);
                    if (checked) {
                      update("consistencyUnsure", false);
                      update("consistencySignals", initialAnswers.consistencySignals);
                    }
                  }}
                />
                We do not have both a website and Google profile
              </label>
              <label className={styles.checkOption}>
                <input
                  type="checkbox"
                  checked={answers.consistencyUnsure}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    update("consistencyUnsure", checked);
                    if (checked) {
                      update("noComparableAssets", false);
                      update("consistencySignals", initialAnswers.consistencySignals);
                    }
                  }}
                />
                I am not sure
              </label>
            </fieldset>
            <div className={styles.fieldGrid}>
              <TextField id="email" label="Email" type="email" value={answers.email} error={errors.email} onChange={(value) => update("email", value)} />
              <TextField id="mobile" label="Mobile number (optional)" value={answers.mobile ?? ""} onChange={(value) => update("mobile", value)} />
            </div>
            <label className={styles.consent} id="consent">
              <input type="checkbox" checked={answers.consent} onChange={(event) => update("consent", event.target.checked)} />
              <span>
                I agree to receive my result and practical follow-up from Local Search Ally. I can unsubscribe at any time.
              </span>
            </label>
            {errors.consent && <p className={styles.fieldError}>{errors.consent}</p>}
          </section>
        )}

        <div className={styles.actions}>
          <button className={styles.secondaryButton} type="button" onClick={handleBack} disabled={step === 0 || isSubmitting}>
            Back
          </button>
          {step < 4 ? (
            <button className={styles.primaryButton} type="button" onClick={handleNext}>
              Continue
            </button>
          ) : (
            <button className={styles.primaryButton} type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Scoring..." : "Show Me My Score"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function TextField({
  id,
  label,
  value,
  error,
  type = "text",
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? "true" : "false"}
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <p className={styles.fieldError} id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function RadioGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className={styles.optionGroup}>
      <legend>{legend}</legend>
      <div className={styles.optionGrid}>
        {options.map(([optionValue, label]) => (
          <label className={styles.radioOption} key={optionValue}>
            <input type="radio" name={name} checked={value === optionValue} onChange={() => onChange(optionValue)} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckboxGroup<T extends Record<string, boolean>>({
  legend,
  options,
  values,
  disabled = false,
  onChange,
}: {
  legend: string;
  options: readonly (readonly [keyof T, string])[];
  values: T;
  disabled?: boolean;
  onChange: (key: keyof T, value: boolean) => void;
}) {
  return (
    <fieldset className={styles.optionGroup} disabled={disabled}>
      <legend>{legend}</legend>
      <div className={styles.optionGrid}>
        {options.map(([key, label]) => (
          <label className={styles.checkOption} key={String(key)}>
            <input type="checkbox" checked={values[key]} onChange={(event) => onChange(key, event.target.checked)} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
