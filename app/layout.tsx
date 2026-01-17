import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Bubble Map - Visualizing Circular Money Flows in the AI Industry",
  description:
    "Interactive visualization of AI industry investments, partnerships, and circular capital flows. Track how billions flow between OpenAI, Microsoft, NVIDIA, and other tech giants. Is this the next tech bubble?",
  keywords: [
    "AI bubble",
    "AI industry bubble",
    "tech bubble",
    "AI investments",
    "OpenAI Microsoft investment",
    "NVIDIA AI",
    "AI market bubble",
    "artificial intelligence bubble",
    "tech industry investments",
    "AI company valuations",
    "circular capital flows",
    "AI deal tracker",
    "AI money flow",
    "tech bubble visualization",
    "AI investment map",
    "AI market analysis",
    "dot com bubble AI",
    "AI overvaluation",
    "AI hype bubble",
  ],
  authors: [{ name: "AI Bubble Map" }],
  creator: "AI Bubble Map",
  publisher: "AI Bubble Map",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AI Bubble Map",
    title: "AI Bubble Map - Visualizing Circular Money Flows in the AI Industry",
    description:
      "Track how billions flow in circles between AI giants. Microsoft invests in OpenAI, OpenAI spends on Azure and NVIDIA, NVIDIA sells back to Microsoft. See the pattern.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Bubble Map - Is AI the Next Tech Bubble?",
    description:
      "Interactive visualization showing how $350B+ flows in circles between AI companies. The same dollars keep changing hands.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
