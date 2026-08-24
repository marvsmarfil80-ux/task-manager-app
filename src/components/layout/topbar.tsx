import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b px-4 md:px-6 py-4">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <ModeToggle />
    </header>
  );
}