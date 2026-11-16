import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/navigation/Navbar";
import { MobileDock } from "@/components/navigation/MobileDock";
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
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#FAFAFA] text-zinc-900 selection:bg-zinc-900 selection:text-white">
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <MobileDock />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
