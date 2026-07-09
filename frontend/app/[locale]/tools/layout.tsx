import Navbar from "../../../src/components/Navbar";
import ToolsSidebar from "../../../src/components/ToolsSidebar";
import ToolsAuthGuard from "../../../src/components/ToolsAuthGuard";

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
    <div className="relative min-h-screen bg-[#0a0015] flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 flex mt-16 md:mt-20">
        <ToolsSidebar />
        
        {/* Main Workspace Area */}
        <main className={`flex-1 transition-all duration-300 w-full lg:w-auto relative ${isRtl ? 'lg:mr-72' : 'lg:ml-72'}`}>
          <ToolsAuthGuard>
            {children}
          </ToolsAuthGuard>
        </main>
      </div>
    </div>
  );
}
