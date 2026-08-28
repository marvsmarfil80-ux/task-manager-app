"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteProject } from "@/hooks/use-projects";
import type { Project } from "@/types";
import { toast } from "sonner";

interface DeleteProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onDeleted?: () => void;
}

export function DeleteProjectDialog({ open, onOpenChange, project, onDeleted }: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject();

  async function handleDelete() {
    if (!project) return;
        try {
      await deleteProject.mutateAsync(project.id);
      toast.success("Project deleted");
      onOpenChange(false);
    } catch {
      // surfaced below via deleteProject.isError
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">{project?.name}</span> and cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {deleteProject.isError && (
          <p className="text-sm text-destructive">{deleteProject.error.message}</p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProject.isPending}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteProject.isPending}>
            {deleteProject.isPending ? "Deleting..." : "Delete Project"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}