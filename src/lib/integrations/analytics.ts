type EventProperties = Record<string, string | number | boolean | undefined>;

const piiKeys = ["email", "phone", "mobile", "businessName", "firstName", "websiteUrl", "googleProfileUrl"];

function stripPersonalData(properties: EventProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key]) => !piiKeys.includes(key)),
  ) as EventProperties;
}

export function trackEvent(name: string, properties?: EventProperties) {
  const safeProperties = stripPersonalData(properties);

  if (typeof window === "undefined") {
    if (process.env.NODE_ENV !== "production") {
      console.info("[local-event]", name, safeProperties);
    }
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[local-event]", name, safeProperties);
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, properties: safeProperties }),
    keepalive: true,
  }).catch(() => undefined);
}
