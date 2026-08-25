"use client";

import { useState } from "react";
import { Plus, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { AssignUsersDialog } from "@/components/tasks/assign-users-dialog";
import { useTasks } from "@/hooks/use-tasks";
import type { Task } from "@/types";

export function ProjectTasksTab({ projectId }: { projectId: number }) {
  const { data: tasks, isLoading, isError } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [assigningTaskId, setAssigningTaskId] = useState<number | null>(null);

  const projectTasks = (tasks ?? []).filter((t) => t.project_id === projectId);

  function openCreate() {
    setEditingTask(undefined);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-destructive">Failed to load tasks.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" /> Create Task
        </Button>
      </div>

      {projectTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
          <CheckSquare className="h-8 w-8" />
          <p>No tasks in this project yet.</p>
        </div>
      ) : (
        <TaskBoard
          tasks={projectTasks}
          showProject={false}
          onEdit={openEdit}
          onDelete={setDeletingTask}
          onAssign={(task) => setAssigningTaskId(task.id)}
        />
      )}

      <TaskFormDialog open={formOpen} onOpenChange={setFormOpen} task={editingTask} defaultProjectId={projectId} />
      <DeleteTaskDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)} task={deletingTask} />
      <AssignUsersDialog
        open={assigningTaskId !== null}
        onOpenChange={(open) => !open && setAssigningTaskId(null)}
        taskId={assigningTaskId}
      />
    </div>
  );
}