import { useDeleteUser } from "@/hooks/users/useDeleteUser"
import { type UserItem } from "@/hooks/users/useGetUsers"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteUserModalProps {
  user: UserItem | null
  onClose: () => void
}

export default function DeleteUserModal({
  user,
  onClose,
}: DeleteUserModalProps) {
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()

  const handleDeleteConfirm = () => {
    if (!user) return

    deleteUser(
      {
        id: user.id,
        isDeleted: true,
      },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email || "this user"

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{displayName}</span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
