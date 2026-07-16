export function getResultTier(score: number): string {
  if (score >= 85) return "Ready to Earn the Call";
  if (score >= 70) return "Strong Foundation, Noticeable Gaps";
  if (score >= 50) return "Trust Is Breaking Down";
  return "Calls May Be Leaking";
}

export function getTierHeadline(score: number): string {
  if (score >= 85) {
    return "Your main job is protecting the trust signals already working.";
  }

  if (score >= 70) {
    return "You have visible strengths, but a few gaps may still create hesitation.";
  }

  if (score >= 50) {
    return "Homeowners may find you, then pause before reaching out.";
  }

  return "Basic trust or contact signals may be missing before the call happens.";
}

export function getSummary(score: number, businessName: string): string {
  const tier = getResultTier(score).toLowerCase();
  return `${businessName} is in the "${tier}" range. The score is based only on the information submitted and points to the first practical trust and contact issues to inspect.`;
}
