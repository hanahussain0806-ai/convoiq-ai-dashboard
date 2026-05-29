import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConvoIQ — AI Sentiment Intelligence",
  description: "Real-time conversation sentiment analysis powered by Llama 3.3 via Groq",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="noise-bg">{children}</body>
    </html>
  );
}