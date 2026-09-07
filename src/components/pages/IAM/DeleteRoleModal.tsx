import { useDeleteRole } from "@/hooks/role/useRoles"
import { type RoleItem } from "@/hooks/role/useRoles"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteRoleModalProps {
  role: RoleItem | null
  onClose: () => void
}

export default function DeleteRoleModal({
  role,
  onClose,
}: DeleteRoleModalProps) {
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole()

  const handleDeleteConfirm = () => {
    if (!role) return

    deleteRole(
      { id: role.id },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  return (
    <Dialog open={!!role} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Role</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete the role{" "}
            <span className="font-semibold text-foreground">
              {role?.name || "this role"}
            </span>
            ? This action cannot be undone. Users with this role may lose access.
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
            {isDeleting ? "Deleting..." : "Delete Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
