const SCRIPT_PATTERN = /<\s*script|javascript:|data:text\/html|on\w+\s*=/i;

export function cleanText(value: unknown, maxLength = 120): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function hasScriptLikeInput(value: string): boolean {
  return SCRIPT_PATTERN.test(value);
}

export function cleanOptionalText(value: unknown, maxLength = 160): string | undefined {
  const cleaned = cleanText(value, maxLength);
  return cleaned.length > 0 ? cleaned : undefined;
}
