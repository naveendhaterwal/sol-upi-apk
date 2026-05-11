import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SolUPI — Pay Any UPI Merchant Using Solana",
  description:
    "SolUPI brings familiar UPI-style payments to Solana SPL assets. Scan & pay merchants instantly with SOL, USDC and other SPL tokens.",
  keywords: ["SolUPI", "Solana", "UPI", "payments", "SPL tokens", "fintech", "India", "crypto"],
  authors: [{ name: "SolUPI Team" }],
  openGraph: {
    title: "SolUPI — Pay Any UPI Merchant Using Solana",
    description: "Familiar UPI-style payments powered by Solana SPL assets.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SolUPI — Pay Any UPI Merchant Using Solana",
    description: "Familiar UPI-style payments powered by Solana SPL assets.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("dark h-full antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
