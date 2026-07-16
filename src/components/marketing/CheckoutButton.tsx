"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/integrations/analytics";
import styles from "./CheckoutButton.module.css";

export function CheckoutButton() {
  const [message, setMessage] = useState("");
  const checkoutUrl = process.env.NEXT_PUBLIC_ACTION_PLAN_CHECKOUT_URL;

  function handleClick() {
    trackEvent("action_plan_cta_clicked");

    if (!checkoutUrl) {
      setMessage("Checkout is not configured yet. Add NEXT_PUBLIC_ACTION_PLAN_CHECKOUT_URL to enable the hosted Stripe handoff.");
      return;
    }

    trackEvent("checkout_opened");
    window.location.href = checkoutUrl;
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.button} type="button" onClick={handleClick}>
        Get My Personalized Action Plan
      </button>
      {message && <p role="status">{message}</p>}
    </div>
  );
}
