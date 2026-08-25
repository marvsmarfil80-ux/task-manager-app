"use client";

import { useMemo, useState } from "react";
import { Plus, Search, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { AssignUsersDialog } from "@/components/tasks/assign-users-dialog";
import { useTasks } from "@/hooks/use-tasks";
import { useProjects } from "@/hooks/use-projects";
import type { Task } from "@/types";

export default function TasksPage() {
  const { data: tasks, isLoading, isError } = useTasks();
  const { data: projects } = useProjects();
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [assigningTaskId, setAssigningTaskId] = useState<number | null>(null);

  const projectItems = [
    { label: "All Projects", value: "all" },
    ...(projects ?? []).map((p) => ({ label: p.name, value: String(p.id) })),
  ];

  const filtered = useMemo(() => {
    if (!tasks) return [];
    let result = tasks;
    if (projectFilter !== "all") {
      result = result.filter((t) => String(t.project_id) === projectFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.project.name.toLowerCase().includes(q) ||
          t.assignees.some((a) => a.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [tasks, search, projectFilter]);

  function openCreate() {
    setEditingTask(undefined);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">All Tasks</h2>
          <p className="text-sm text-muted-foreground">{tasks ? `${tasks.length} total` : "Loading..."}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
          </div>
          <Select items={projectItems} value={projectFilter} onValueChange={(value) => setProjectFilter(value ?? "all")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {projectItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Create Task
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      )}

      {isError && <p className="text-sm text-destructive">Failed to load tasks. Please try again.</p>}

      {!isLoading && !isError && tasks && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center text-muted-foreground">
          <CheckSquare className="h-8 w-8" />
          <p>No tasks yet.</p>
          <Button onClick={openCreate} variant="outline">
            <Plus className="h-4 w-4" /> Create your first task
          </Button>
        </div>
      )}

      {!isLoading && !isError && tasks && tasks.length > 0 && (
        <TaskBoard
          tasks={filtered}
          onEdit={openEdit}
          onDelete={setDeletingTask}
          onAssign={(task) => setAssigningTaskId(task.id)}
        />
      )}

      <TaskFormDialog open={formOpen} onOpenChange={setFormOpen} task={editingTask} />
      <DeleteTaskDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)} task={deletingTask} />
      <AssignUsersDialog
        open={assigningTaskId !== null}
        onOpenChange={(open) => !open && setAssigningTaskId(null)}
        taskId={assigningTaskId}
      />
    </div>
  );
}