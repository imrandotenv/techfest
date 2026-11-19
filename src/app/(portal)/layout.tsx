export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[calc(100vh-14rem)] bg-[#FAFAFA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {children}
      </div>
    </div>
  );
}
