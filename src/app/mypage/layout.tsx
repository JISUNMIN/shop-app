import MyPageSidebar from "./MyPageSidebar";
import FullWidthSection from "@/components/layout/FullWidthSection";

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <FullWidthSection>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          <div className="flex gap-6">
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <MyPageSidebar />
              </div>
            </div>

            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </FullWidthSection>
  );
}
