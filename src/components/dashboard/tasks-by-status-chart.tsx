"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTasks } from "@/hooks/use-tasks";

export function TasksByStatusChart() {
  const { data, isLoading, isError } = useTasks();

  const counts = { todo: 0, in_progress: 0, done: 0 };
  data?.forEach((task) => {
    if (task.status in counts) counts[task.status as keyof typeof counts]++;
  });

  const chartData = [
    { status: "To Do", count: counts.todo },
    { status: "In Progress", count: counts.in_progress },
    { status: "Done", count: counts.done },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-48 w-full" />}
        {isError && <p className="text-sm text-destructive">Failed to load tasks.</p>}
        {!isLoading && !isError && (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="status" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Bar dataKey="count" fill="var(--primary)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}