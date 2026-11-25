import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/navigation/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { RolePreviewProvider } from "@/context/RolePreviewContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://settech.ceimran.in';

export const metadata: Metadata = {
  metadataBase: new URL('https://settech.ceimran.in'),
  title: {
    default: "SETTech — Official B.Tech Academic Suite | SETGOI Durgapur",
    template: "%s | SETTech",
  },
  description:
    "Verified MAKAUT notes, PYQs, AI Viva prep, SGPA & 75% attendance calculators, and engineering Q&A for SETGOI students.",
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
    title: "SETTech — Official B.Tech Academic Suite | SETGOI Durgapur",
    description:
      "Verified MAKAUT notes, PYQs, AI Viva prep, SGPA & 75% attendance calculators, and engineering Q&A for SETGOI students.",
    siteName: "SETTech",
  },
  twitter: {
    card: "summary_large_image",
    title: "SETTech — Official B.Tech Academic Suite | SETGOI Durgapur",
    description:
      "Verified MAKAUT notes, PYQs, AI Viva prep, SGPA & 75% attendance calculators, and engineering Q&A for SETGOI students.",
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
          fontFamily: 'var(--font-sans), Inter, system-ui, sans-serif',
        },
        elements: {
          card: 'shadow-sm border border-[#E2E8F0] rounded-2xl bg-white font-sans',
          formButtonPrimary:
            'bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold rounded-xl py-3 transition-colors shadow-2xs font-sans',
          socialButtonsBlockButton:
            'border border-[#E2E8F0] hover:bg-slate-50 text-xs font-medium rounded-xl py-2.5 transition-colors font-sans text-[#0F172A]',
          footerActionLink: 'text-[#2563EB] hover:text-blue-700 font-medium text-xs font-sans',
          formFieldInput:
            'border-[#E2E8F0] focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] text-xs rounded-xl py-2.5 px-3 font-sans',
          userButtonAvatarBox: 'w-7 h-7 border border-[#E2E8F0] rounded-full',
          userButtonPopoverCard: 'shadow-xl border border-[#E2E8F0] rounded-xl font-sans',
        },
      }}
    >
      <html
        lang="en"
        className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
      >
        <body className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#09090B] font-sans antialiased selection:bg-[#2563EB] selection:text-white">
          <RolePreviewProvider>
            <FloatingNav />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <CookieBanner />
          </RolePreviewProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
