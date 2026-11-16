import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Berhan Demiralp · AI / ML Engineer",
  description:
    "Selected projects in machine learning, computer vision and software engineering by Berhan Demiralp.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
