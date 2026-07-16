import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./ButtonLink.module.css";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary";
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  return <Link className={`${styles.button} ${styles[variant]} ${className}`} {...props} />;
}
