import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
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
  title: "SanakaHub | Centralized SETGOI Student Utility & Campus Portal",
  description: "Ultra-fast student utility, MAKAUT PYQ vault, SGPA calculator, campus directory, and discussion portal for Sanaka Educational Trust's Group of Institutions, Durgapur.",
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
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
