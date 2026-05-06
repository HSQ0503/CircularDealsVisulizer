import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AI Deal Network — Quantifying Circularity in the AI Industry",
  description:
    "A working paper on financial circularity in artificial-intelligence markets. Three metrics, 28 firms, 90 deals, 35 circular structures.",
  keywords: [
    "AI bubble",
    "AI industry bubble",
    "tech bubble",
    "AI investments",
    "OpenAI Microsoft investment",
    "NVIDIA AI",
    "circular capital flows",
    "AI deal tracker",
    "AI money flow",
    "tech bubble visualization",
    "network economics",
  ],
  authors: [{ name: "Shouqi Han" }],
  creator: "Shouqi Han",
  publisher: "AI Deal Network",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI Deal Network",
    title: "AI Deal Network — Quantifying Circularity in the AI Industry",
    description:
      "A working paper companion. Track how billions flow in circles between AI giants.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Deal Network — Quantifying Circularity in the AI Industry",
    description:
      "A working paper on financial circularity in the AI industry.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} ${interTight.variable} ${jetBrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
