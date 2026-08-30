"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUsers } from "@/hooks/use-users";
import { useTasks, useAssignUser, useUnassignUser } from "@/hooks/use-tasks";

interface AssignUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number | null;
}

export function AssignUsersDialog({ open, onOpenChange, taskId }: AssignUsersDialogProps) {
  const { data: tasks } = useTasks();
  const { data: users, isLoading: usersLoading } = useUsers();
  const assignUser = useAssignUser();
  const unassignUser = useUnassignUser();
  const [search, setSearch] = useState("");

  const task = tasks?.find((t) => t.id === taskId) ?? null;

  if (!task) return null;

  const assignedIds = new Set(task.assignees.map((u) => u.id));
  const filteredUsers = (users ?? []).filter((u) => u.name.toLowerCase().includes(search.trim().toLowerCase()));
  const isMutating = assignUser.isPending || unassignUser.isPending;

  function toggleUser(userId: number, currentlyAssigned: boolean) {
    if (!task || isMutating) return;
    if (currentlyAssigned) {
      unassignUser.mutate({ taskId: task.id, userId });
    } else {
      assignUser.mutate({ taskId: task.id, userId });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Users — {task.title}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1">
          {usersLoading && <p className="text-sm text-muted-foreground py-4">Loading users...</p>}
          {!usersLoading && filteredUsers.length === 0 && <p className="text-sm text-muted-foreground py-4">No users found.</p>}

          {filteredUsers.map((user) => {
            const isAssigned = assignedIds.has(user.id);
            return (
              <label key={user.id} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-accent cursor-pointer">
                <Checkbox checked={isAssigned} disabled={isMutating} onCheckedChange={() => toggleUser(user.id, isAssigned)} />
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </label>
            );
          })}
        </div>

        {(assignUser.isError || unassignUser.isError) && (
          <p className="text-sm text-destructive">Something went wrong updating assignment. Try again.</p>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
