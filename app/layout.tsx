import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://berhandemiralp.vercel.app"),
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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
