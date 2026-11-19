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
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (typeof window === 'undefined') return;

                  function isClerkNoise(val) {
                    if (!val) return false;
                    var str = '';
                    try {
                      if (typeof val === 'string') str = val;
                      else if (val.message || val.stack || val.code) str = (val.code || '') + ' ' + (val.message || '') + ' ' + (val.stack || '');
                      else str = String(val);
                    } catch(e) {}
                    return (
                      str.indexOf('failed_to_load_clerk') !== -1 ||
                      str.indexOf('Failed to load Clerk') !== -1 ||
                      str.indexOf('clerk.sanakahub.durgapur.dev') !== -1 ||
                      str.indexOf('ClerkRuntimeError') !== -1 ||
                      str.indexOf('ERR_NAME_NOT_RESOLVED') !== -1
                    );
                  }

                  var activeConsoleError = console.error;
                  try {
                    Object.defineProperty(console, 'error', {
                      configurable: true,
                      enumerable: true,
                      get: function() {
                        return function() {
                          var args = Array.prototype.slice.call(arguments);
                          for (var i = 0; i < args.length; i++) {
                            if (isClerkNoise(args[i])) return;
                          }
                          if (activeConsoleError) {
                            return activeConsoleError.apply(console, arguments);
                          }
                        };
                      },
                      set: function(fn) {
                        activeConsoleError = fn;
                      }
                    });
                  } catch(e) {
                    console.error = function() {
                      var args = Array.prototype.slice.call(arguments);
                      for (var i = 0; i < args.length; i++) {
                        if (isClerkNoise(args[i])) return;
                      }
                      return activeConsoleError.apply(console, arguments);
                    };
                  }

                  var origAddEventListener = window.addEventListener;
                  window.addEventListener = function(type, listener, options) {
                    if (type === 'unhandledrejection' || type === 'error') {
                      var wrapped = function(event) {
                        var r = event && (event.reason || event.error);
                        if (isClerkNoise(r) || isClerkNoise(event && event.message)) {
                          if (event.preventDefault) event.preventDefault();
                          if (event.stopImmediatePropagation) event.stopImmediatePropagation();
                          return;
                        }
                        return typeof listener === 'function' ? listener.call(this, event) : (listener && listener.handleEvent && listener.handleEvent(event));
                      };
                      return origAddEventListener.call(window, type, wrapped, options);
                    }
                    return origAddEventListener.apply(window, arguments);
                  };

                  function suppressEvent(e) {
                    var r = e && (e.reason || e.error);
                    if (isClerkNoise(r) || isClerkNoise(e && e.message)) {
                      if (e.preventDefault) e.preventDefault();
                      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                      return true;
                    }
                  }
                  window.addEventListener('unhandledrejection', suppressEvent, true);
                  window.addEventListener('error', suppressEvent, true);
                })();
              `,
            }}
          />
        </head>
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
