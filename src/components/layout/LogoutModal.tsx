import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface LogoutModalProps {
  open: boolean
  onClose: () => void
}

export function LogoutModal({ open, onClose }: LogoutModalProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    // Clear tokens
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    
    // Clear React Query cache
    queryClient.clear()
    
    toast.success("Logged out successfully")
    onClose()
    
    // Redirect to login
    navigate("/login")
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out of your account? You will need to sign in again to access the dashboard.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Log Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
