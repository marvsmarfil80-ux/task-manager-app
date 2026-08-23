"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/hooks/use-tasks";

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  todo: "outline",
  in_progress: "secondary",
  done: "default",
};

export function RecentTasks() {
  const { data, isLoading, isError } = useTasks();

  const recent = data
    ? [...data].sort((a, b) => b.id - a.id).slice(0, 5)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}

        {isError && <p className="text-sm text-destructive">Failed to load tasks.</p>}

        {!isLoading && !isError && recent.length === 0 && (
          <p className="text-sm text-muted-foreground">No tasks yet.</p>
        )}

        {recent.map((task) => (
          <div key={task.id} className="flex items-center justify-between border-b pb-2 last:border-0">
            <div>
              <p className="text-sm font-medium">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.project.name}</p>
            </div>
            <Badge variant={statusVariant[task.status] ?? "outline"}>{task.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}