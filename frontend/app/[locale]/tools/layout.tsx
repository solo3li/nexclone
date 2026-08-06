import ToolsSidebar from "../../../src/components/ToolsSidebar";
import ToolsAuthGuard from "../../../src/components/ToolsAuthGuard";

import ToolStatusGuard from "../../../src/components/ToolStatusGuard";

export default async function ToolsLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const isRtl = locale === 'ar';

  return (
    <div className="relative min-h-screen bg-[#0a0015] flex font-sans">
      <ToolsSidebar />
      
      {/* Main Workspace Area - fullscreen, no top navbar */}
      <main className={`flex-1 transition-all duration-300 w-full lg:w-auto relative ${isRtl ? 'lg:mr-72' : 'lg:ml-72'}`}>
        <ToolsAuthGuard>
          <ToolStatusGuard>
            {children}
          </ToolStatusGuard>
        </ToolsAuthGuard>
      </main>
    </div>
  );
}
