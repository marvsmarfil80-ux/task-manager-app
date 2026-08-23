import Link from "next/link";
import { LayoutDashboard, FolderKanban, CheckSquare, Users } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, active: true },
  { label: "Projects", href: "#", icon: FolderKanban, active: false },
  { label: "Tasks", href: "#", icon: CheckSquare, active: false },
  { label: "Team", href: "#", icon: Users, active: false },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r bg-sidebar text-sidebar-foreground p-4 flex flex-col gap-1">
      <div className="px-2 pb-4 font-semibold text-lg">Task Manager</div>
      {navItems.map(({ label, href, icon: Icon, active }) =>
        active ? (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ) : (
          <div
            key={label}
            aria-disabled="true"
            title="Coming in a later phase"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/50 cursor-not-allowed select-none"
          >
            <Icon className="h-4 w-4" />
            {label}
          </div>
        )
      )}
    </aside>
  );
}