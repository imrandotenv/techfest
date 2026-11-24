import React from 'react';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#F7F8FA] relative">
      {/* Subtle Architectural Dot Grid Pattern in Header Zone */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,black_30%,transparent_80%)] opacity-40"
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-24 pb-20">
        {children}
      </div>
    </div>
  );
}
