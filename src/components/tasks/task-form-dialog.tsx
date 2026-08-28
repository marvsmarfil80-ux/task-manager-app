"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { taskFormSchema } from "@/lib/validations/task";
import { useProjects } from "@/hooks/use-projects";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import type { Task, TaskStatus } from "@/types";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  defaultProjectId?: number;
}

const statusItems: { label: string; value: TaskStatus }[] = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

export function TaskFormDialog({ open, onOpenChange, task, defaultProjectId }: TaskFormDialogProps) {
  const isEdit = !!task;
  const { data: projects } = useProjects();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const form = useForm<z.input<typeof taskFormSchema>, unknown, z.output<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      project_id: task?.project_id ?? defaultProjectId ?? undefined,
      status: task?.status ?? "todo",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: task?.title ?? "",
        project_id: task?.project_id ?? defaultProjectId ?? undefined,
        status: task?.status ?? "todo",
      });
    }
  }, [open, task, defaultProjectId, form]);

  const isPending = createTask.isPending || updateTask.isPending;
  const mutationError = isEdit ? updateTask.error : createTask.error;
  const projectItems = (projects ?? []).map((p) => ({ label: p.name, value: String(p.id) }));

  async function onSubmit(values: z.output<typeof taskFormSchema>) {
    try {
      if (isEdit && task) {
        await updateTask.mutateAsync({ id: task.id, data: { title: values.title, status: values.status } });
        toast.success("Task updated");
      } else {
        await createTask.mutateAsync(values);
        toast.success("Task created");
      }
      onOpenChange(false);
      form.reset();
    } catch {
      // surfaced via mutationError below
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create Task"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEdit && (
              <FormField
                control={form.control}
                name="project_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    {defaultProjectId ? (
                      <p className="text-sm rounded-md border px-3 py-2 bg-muted text-muted-foreground">
                        {projects?.find((p) => p.id === defaultProjectId)?.name ?? `Project #${defaultProjectId}`}
                      </p>
                    ) : (
                      <Select
                        items={projectItems}
                        value={field.value ? String(field.value) : undefined}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={projectItems.length ? "Select a project" : "No projects yet"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                    {!defaultProjectId && projectItems.length === 0 && (
                      <p className="text-xs text-muted-foreground">Create a project first before adding tasks.</p>
                    )}
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select items={statusItems} value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutationError && <p className="text-sm text-destructive">{mutationError.message}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || (!isEdit && !defaultProjectId && projectItems.length === 0)}>
                {isPending ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save Changes" : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}