import type { AssessmentAnswers, AssessmentResult } from "../assessment/types";

export async function syncLead(_answers: AssessmentAnswers, result: AssessmentResult): Promise<void> {
  if (process.env.ENABLE_CRM_SYNC !== "true") {
    if (process.env.NODE_ENV !== "production") {
      console.info("[crm-disabled] Lead sync skipped", {
        assessmentId: result.assessmentId,
        scoreBand: Math.floor(result.overallScore / 10) * 10,
      });
    }
    return;
  }

  throw new Error("CRM adapter is not configured yet.");
}
