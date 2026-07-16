import type { AssessmentAnswers, AssessmentResult } from "../assessment/types";

export async function persistResult(_answers: AssessmentAnswers, result: AssessmentResult): Promise<void> {
  if (process.env.ENABLE_RESULT_PERSISTENCE !== "true") {
    if (process.env.NODE_ENV !== "production") {
      console.info("[persistence-disabled] Result persistence skipped", {
        assessmentId: result.assessmentId,
      });
    }
    return;
  }

  throw new Error("Persistence adapter is not configured yet.");
}
