import ToolsSidebar from "../../../src/components/ToolsSidebar";
import ToolsAuthGuard from "../../../src/components/ToolsAuthGuard";
import ToolStatusGuard from "../../../src/components/ToolStatusGuard";
import ToolsWorkspaceWrapper from "../../../src/components/ToolsWorkspaceWrapper";
import OnboardingTour from "../../../src/components/dashboard/OnboardingTour";

export default async function ToolsLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  return (
    <div className="relative min-h-screen bg-[#0a0015] flex font-sans">
      <ToolsSidebar />
      
      {/* Main Workspace Area with dynamic collapse margin */}
      <ToolsWorkspaceWrapper>
        <ToolsAuthGuard>
          <ToolStatusGuard>
            <OnboardingTour />
            {children}
          </ToolStatusGuard>
        </ToolsAuthGuard>
      </ToolsWorkspaceWrapper>
    </div>
  );
}
