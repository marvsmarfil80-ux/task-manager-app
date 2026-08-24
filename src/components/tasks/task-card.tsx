"use client";

import { MoreVertical, Pencil, Trash2, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUpdateTask } from "@/hooks/use-tasks";
import type { Task, TaskStatus } from "@/types";

const statusItems: { label: string; value: TaskStatus }[] = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

interface TaskCardProps {
  task: Task;
  showProject?: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAssign: (task: Task) => void;
}

export function TaskCard({ task, showProject = true, onEdit, onDelete, onAssign }: TaskCardProps) {
  const updateTask = useUpdateTask();

    function handleStatusChange(value: TaskStatus | null) {
    if (!value) return;
    updateTask.mutate({ id: task.id, data: { status: value } });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" aria-label="Task actions" />}
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAssign(task)}>
              <UserPlus className="h-4 w-4" /> Assign users
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task)} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-3">
        {showProject && <p className="text-xs text-muted-foreground">{task.project.name}</p>}

        <Select items={statusItems} value={task.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-7 text-xs w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {task.assignees.length > 0 ? (
          <div className="flex items-center gap-1 flex-wrap">
            {task.assignees.map((user) => (
              <Badge key={user.id} variant="secondary" className="gap-1">
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-[10px]">{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                {user.name}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Unassigned</p>
        )}
      </CardContent>
    </Card>
  );
}