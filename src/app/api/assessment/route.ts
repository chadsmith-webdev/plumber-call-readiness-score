import { NextResponse } from "next/server";
import { buildAssessmentResult } from "@/lib/assessment/buildResult";
import { validateAssessmentPayload } from "@/lib/assessment/schema";
import { sendResultEmail } from "@/lib/integrations/email";
import { persistResult } from "@/lib/integrations/persistence";
import { syncLead } from "@/lib/integrations/crm";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ errors: { form: "Invalid request body." } }, { status: 400 });
  }

  const validation = validateAssessmentPayload(payload);

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const result = buildAssessmentResult(validation.answers);

  void Promise.allSettled([
    sendResultEmail(result, validation.answers.email),
    syncLead(validation.answers, result),
    persistResult(validation.answers, result),
  ]);

  return NextResponse.json({ result });
}
