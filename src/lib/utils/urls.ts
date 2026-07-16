export function normalizeUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const trimmed = value.trim();
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);

    if (!["http:", "https:"].includes(url.protocol)) {
      return undefined;
    }

    return url.toString();
  } catch {
    return undefined;
  }
}
