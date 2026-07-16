export function getCheckoutUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_ACTION_PLAN_CHECKOUT_URL;
  return value && value.trim().length > 0 ? value : undefined;
}
