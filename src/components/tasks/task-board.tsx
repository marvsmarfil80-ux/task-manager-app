import { TaskColumn } from "./task-column";
import type { Task, TaskStatus } from "@/types";

const columns: { label: string; status: TaskStatus }[] = [
  { label: "To Do", status: "todo" },
  { label: "In Progress", status: "in_progress" },
  { label: "Done", status: "done" },
];

interface TaskBoardProps {
  tasks: Task[];
  showProject?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAssign: (task: Task) => void;
}

export function TaskBoard({ tasks, showProject = true, onEdit, onDelete, onAssign }: TaskBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
      {columns.map((col) => (
        <TaskColumn key={col.status} title={col.label} status={col.status} tasks={tasks} showProject={showProject} onEdit={onEdit} onDelete={onDelete} onAssign={onAssign} />
      ))}
    </div>
  );
}