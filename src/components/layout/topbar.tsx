"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-auth";

export function Topbar({ title }: { title: string }) {
  const router = useRouter();
  const logout = useLogout();

  async function handleLogout() {
    await logout.mutateAsync();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between border-b px-4 md:px-6 py-4">
      <div className="flex items-center gap-2">
        <MobileSidebar />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button variant="ghost" size="icon" onClick={handleLogout} disabled={logout.isPending} aria-label="Log out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}