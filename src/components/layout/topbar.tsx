import { ModeToggle } from "@/components/mode-toggle";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-semibold">{title}</h1>
      <ModeToggle />
    </header>
  );
}