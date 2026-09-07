import { useDeletePermission } from "@/hooks/permission/usePermissions"
import { type PermissionItem } from "@/hooks/permission/usePermissions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeletePermissionModalProps {
  permission: PermissionItem | null
  onClose: () => void
}

export default function DeletePermissionModal({
  permission,
  onClose,
}: DeletePermissionModalProps) {
  const { mutate: deletePermission, isPending: isDeleting } =
    useDeletePermission()

  const handleDeleteConfirm = () => {
    if (!permission) return

    deletePermission(
      { id: permission.id },
      {
        onSuccess: () => onClose(),
      }
    )
  }

  return (
    <Dialog open={!!permission} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Permission</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete the permission{" "}
            <span className="font-semibold text-foreground">
              {permission?.action || (permission as any)?.name || "this permission"}
            </span>
            ? Roles using this permission will be affected.
          </DialogDescription>
        </DialogHeader >

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
        {isDeleting ? "Deleting..." : "Delete Permission"}
      </Button>
    </DialogFooter>
      </DialogContent >
    </Dialog >
  )
}
