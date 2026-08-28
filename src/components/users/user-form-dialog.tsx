"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { userFormSchema, type UserFormValues } from "@/lib/validations/user";
import { useCreateUser, useUpdateUser } from "@/hooks/use-users";
import type { User } from "@/types";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEdit = !!user;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name: user?.name ?? "", email: user?.email ?? "", password: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: user?.name ?? "", email: user?.email ?? "", password: "" });
    }
  }, [open, user, form]);

  const isPending = createUser.isPending || updateUser.isPending;
  const mutationError = isEdit ? updateUser.error : createUser.error;

  async function onSubmit(values: UserFormValues) {
    // Password is only required when creating a new account — the backend's
    // UserUpdate schema doesn't support changing it here.
    if (!isEdit && (!values.password || values.password.length < 8)) {
      form.setError("password", { message: "Password must be at least 8 characters" });
      return;
    }

    try {
      if (isEdit && user) {
        await updateUser.mutateAsync({ id: user.id, data: { name: values.name, email: values.email } });
        toast.success("User updated");
      } else {
        await createUser.mutateAsync({ name: values.name, email: values.email, password: values.password! });
        toast.success("User added");
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
          <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEdit && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="At least 8 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {mutationError && <p className="text-sm text-destructive">{mutationError.message}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (isEdit ? "Saving..." : "Adding...") : isEdit ? "Save Changes" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}