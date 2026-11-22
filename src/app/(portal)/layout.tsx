export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 md:pt-28 pb-28 md:pb-20">
        {children}
      </div>
    </div>
  );
}
