'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Pen, Shield } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui'
import { updateUserRole } from '@/lib/actions'
import { UserRole } from '@/types/auth'

const editRoleSchema = z.object({
  role: z.nativeEnum(UserRole)
})

type EditRoleFormValues = z.infer<typeof editRoleSchema>

interface EditRoleDialogProps {
  userId: string
  currentRole: string
  userName: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function EditRoleDialog({
  userId,
  currentRole,
  userName,
  open: controlledOpen,
  onOpenChange,
  children
}: EditRoleDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon">
            <Pen className="size-3" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Update the role for {userName}. This will affect their access permissions.
          </DialogDescription>
        </DialogHeader>
        <EditRoleForm userId={userId} currentRole={currentRole} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

interface EditRoleFormProps {
  userId: string
  currentRole: string
  onSuccess: () => void
  className?: string
}

function EditRoleForm({ userId, currentRole, onSuccess, className }: EditRoleFormProps) {
  const [isPending, startTransition] = React.useTransition()
  const queryClient = useQueryClient()

  const form = useForm<EditRoleFormValues>({
    resolver: zodResolver(editRoleSchema),
    defaultValues: {
      role: currentRole as UserRole
    }
  })

  async function onSubmit(values: EditRoleFormValues) {
    startTransition(async () => {
      try {
        const result = await updateUserRole(userId, values.role)

        if (result.success) {
          toast.success('Role updated successfully', {
            description: `User role has been changed to ${values.role}.`
          })
          // Invalidate and refetch users query
          await queryClient.invalidateQueries({ queryKey: ['users'] })
          onSuccess()
        } else {
          toast.error('Failed to update role', {
            description: result.error || 'An error occurred while updating the role.'
          })
        }
      } catch (_error) {
        toast.error('Failed to update role', {
          description: 'An unexpected error occurred. Please try again.'
        })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>
                      <div className="flex items-center gap-2">
                        <Shield className="size-4" />
                        <span>Admin</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={UserRole.EDITOR}>
                      <div className="flex items-center gap-2">
                        <Shield className="size-4" />
                        <span>Editor</span>
                      </div>
                    </SelectItem>
                    <SelectItem value={UserRole.MEMBER}>
                      <div className="flex items-center gap-2">
                        <Shield className="size-4" />
                        <span>Member</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Update Role
          </Button>
        </div>
      </form>
    </Form>
  )
}
