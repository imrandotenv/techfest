import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/navigation/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SETTech — B.Tech Engineering Cockpit for SETGOI",
    template: "%s | SETTech",
  },
  description:
    "Ultra-fast student utility, AI Viva Studio, verified MAKAUT PYQ vault, 10-point SGPA calculator, and campus portal for Sanaka Educational Trust's Group of Institutions (SETGOI), Durgapur.",
  applicationName: "SETTech",
  authors: [{ name: "SETGOI B.Tech Engineers" }],
  generator: "Next.js",
  keywords: [
    "SETTech",
    "SETGOI",
    "Sanaka Educational Trust",
    "MAKAUT notes",
    "MAKAUT PYQ",
    "AI Viva Studio",
    "SGPA Calculator",
    "Durgapur Engineering",
    "B.Tech CSE",
  ],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
    shortcut: '/icon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "SETTech — B.Tech Engineering Cockpit for SETGOI",
    description:
      "Ultra-fast student utility, AI Viva Studio with Groq Whisper, verified MAKAUT PYQ vault, SGPA calculator, and discussion portal for SETGOI School of Engineering.",
    siteName: "SETTech",
  },
  twitter: {
    card: "summary_large_image",
    title: "SETTech — B.Tech Engineering Cockpit for SETGOI",
    description:
      "Ultra-fast student utility, AI Viva Studio with Groq Whisper, verified MAKAUT PYQ vault, and SGPA tools for SETGOI B.Tech students.",
    creator: "@SETTechSETGOI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#0F172A',
          colorForeground: '#0F172A',
          colorMutedForeground: '#475569',
          colorBackground: '#FFFFFF',
          colorInput: '#FFFFFF',
          colorInputForeground: '#0F172A',
          colorBorder: '#E2E8F0',
          borderRadius: '0.75rem',
          fontFamily: 'Inter, var(--font-geist-sans), sans-serif',
        },
        elements: {
          card: 'shadow-sm border border-[#E2E8F0] rounded-2xl bg-white',
          formButtonPrimary:
            'bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl py-3 transition-colors shadow-2xs font-sans',
          socialButtonsBlockButton:
            'border border-[#E2E8F0] hover:bg-slate-50 text-xs font-medium rounded-xl py-2.5 transition-colors font-sans text-[#0F172A]',
          footerActionLink: 'text-[#2563EB] hover:text-blue-700 font-medium text-xs font-sans',
          formFieldInput:
            'border-[#E2E8F0] focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] text-xs rounded-xl py-2.5 px-3 font-sans',
          userButtonAvatarBox: 'w-7 h-7 border border-[#E2E8F0] rounded-full',
          userButtonPopoverCard: 'shadow-xl border border-[#E2E8F0] rounded-xl',
        },
      }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#09090B] selection:bg-[#2563EB] selection:text-white">
          <FloatingNav />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <CookieBanner />
        </body>
      </html>
    </ClerkProvider>
  );
}
