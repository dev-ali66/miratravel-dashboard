import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/auth/useLogout"
import { Loader2 } from "lucide-react"

interface LogoutModalProps {
  open: boolean
  onClose: () => void
}

export function LogoutModal({ open, onClose }: LogoutModalProps) {
  const { mutate: logout, isPending } = useLogout()

  const handleLogout = (allDevices: boolean = false) => {
    logout(
      { allDevices },
      {
        onSettled: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isPending && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out of your account? Your current session
            will be revoked and you will need to sign in again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" disabled={isPending} onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => handleLogout(false)}
            className="flex items-center gap-1.5"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <span>Log Out</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
