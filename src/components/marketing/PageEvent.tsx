"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/integrations/analytics";

export function PageEvent({ name }: { name: string }) {
  useEffect(() => {
    trackEvent(name);
  }, [name]);

  return null;
}

export function TrackedLink({
  children,
  className,
  eventName,
  href,
}: {
  children: ReactNode;
  className?: string;
  eventName: string;
  href: string;
}) {
  return (
    <a
      className={className}
      href={href}
      onClick={() => {
        trackEvent(eventName);
      }}
    >
      {children}
    </a>
  );
}
