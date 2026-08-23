"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";

export function RecentProjects() {
  const { data, isLoading, isError } = useProjects();

  const recent = data
    ? [...data].sort((a, b) => b.id - a.id).slice(0, 5)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}

        {isError && <p className="text-sm text-destructive">Failed to load projects.</p>}

        {!isLoading && !isError && recent.length === 0 && (
          <p className="text-sm text-muted-foreground">No projects yet.</p>
        )}

        {recent.map((project) => (
          <div key={project.id} className="flex items-center justify-between border-b pb-2 last:border-0">
            <div>
              <p className="text-sm font-medium">{project.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {project.description ?? "No description"}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">Owner: {project.owner.name}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}