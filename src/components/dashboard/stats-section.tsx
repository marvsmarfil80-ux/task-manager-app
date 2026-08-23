"use client";

import { FolderKanban, CheckSquare, Users } from "lucide-react";
import { StatCard } from "./stat-card";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { useUsers } from "@/hooks/use-users";

export function StatsSection() {
  const projects = useProjects();
  const tasks = useTasks();
  const users = useUsers();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Total Projects"
        value={projects.data?.length}
        icon={FolderKanban}
        isLoading={projects.isLoading}
        isError={projects.isError}
      />
      <StatCard
        title="Total Tasks"
        value={tasks.data?.length}
        icon={CheckSquare}
        isLoading={tasks.isLoading}
        isError={tasks.isError}
      />
      <StatCard
        title="Team Members"
        value={users.data?.length}
        icon={Users}
        isLoading={users.isLoading}
        isError={users.isError}
      />
    </div>
  );
}