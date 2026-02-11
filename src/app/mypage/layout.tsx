import MyPageSidebar from "./MyPageSidebar";

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
