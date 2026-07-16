import type { AssessmentResult } from "../assessment/types";

export async function sendResultEmail(result: AssessmentResult, email: string): Promise<void> {
  if (process.env.ENABLE_EMAIL_DELIVERY !== "true") {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email-disabled] Result email skipped", {
        assessmentId: result.assessmentId,
        tier: result.tier,
        emailDomain: email.split("@")[1],
      });
    }
    return;
  }

  throw new Error("Email delivery adapter is not configured yet.");
}
