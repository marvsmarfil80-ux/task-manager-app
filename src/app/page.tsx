import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { StatsSection } from "@/components/dashboard/stats-section";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TasksByStatusChart } from "@/components/dashboard/tasks-by-status-chart";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title="Dashboard" />
        <main className="flex-1 p-6 space-y-6">
          <StatsSection />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentProjects />
            <RecentTasks />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <TasksByStatusChart />
          </div>
        </main>
      </div>
    </div>
  );
}