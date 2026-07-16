import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Plumber Call-Readiness Score | Local Search Ally",
  description:
    "A free assessment for plumbing companies that identifies likely trust and contact gaps before a homeowner calls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
