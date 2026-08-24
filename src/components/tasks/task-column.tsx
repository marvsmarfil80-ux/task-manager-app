import type { Task, TaskStatus } from "@/types";
import { TaskCard } from "./task-card";

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  showProject?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAssign: (task: Task) => void;
}

export function TaskColumn({ title, status, tasks, showProject, onEdit, onDelete, onAssign }: TaskColumnProps) {
  const columnTasks = tasks.filter((t) => t.status === status);

  return (
    <div className="flex-1 min-w-[260px] sm:min-w-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-xs text-muted-foreground">{columnTasks.length}</span>
      </div>
      <div className="space-y-3">
        {columnTasks.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6 border border-dashed rounded-md">No tasks</p>
        )}
        {columnTasks.map((task) => (
          <TaskCard key={task.id} task={task} showProject={showProject} onEdit={onEdit} onDelete={onDelete} onAssign={onAssign} />
        ))}
      </div>
    </div>
  );
}