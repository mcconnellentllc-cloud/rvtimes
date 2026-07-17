import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RV Times",
  description: "Everything about my RV, in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
