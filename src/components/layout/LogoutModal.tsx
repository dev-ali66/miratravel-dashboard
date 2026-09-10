import { useState } from "react"
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
import { useUserSessions } from "@/hooks/auth/useUserSessions"
import { Loader2, Laptop, ShieldAlert, CheckCircle2 } from "lucide-react"

interface LogoutModalProps {
  open: boolean
  onClose: () => void
}

export function LogoutModal({ open, onClose }: LogoutModalProps) {
  const [logoutScope, setLogoutScope] = useState<"this" | "all">("this")
  const { mutate: logout, isPending } = useLogout()
  const { data: sessionStats } = useUserSessions()

  const totalActive = sessionStats?.totalActiveDevices ?? 1

  const handleConfirmLogout = () => {
    logout(
      { allDevices: logoutScope === "all" },
      {
        onSettled: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isPending) onClose()
      }}
    >
      <DialogContent className="max-w-md rounded-2xl p-6 sm:p-7 shadow-2xl border-border/80 bg-card">
        <DialogHeader className="text-left space-y-1.5">
          <DialogTitle className="text-lg font-bold text-foreground">
            Sign Out of Your Account
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose whether you want to terminate your session on this browser only or disconnect all connected devices.
          </DialogDescription>
        </DialogHeader>

        {/* Option Choice Cards */}
        <div className="space-y-3 my-2">
          {/* Option 1: This Device */}
          <div
            onClick={() => setLogoutScope("this")}
            className={`group relative flex items-start gap-3.5 rounded-xl border p-3.5 cursor-pointer transition-all ${
              logoutScope === "this"
                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30"
                : "border-border/70 hover:border-border hover:bg-muted/40"
            }`}
          >
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                logoutScope === "this"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:text-foreground"
              }`}
            >
              <Laptop className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  This Device Only
                </span>
                {logoutScope === "this" && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Revoke the session on this current browser only. Other logged-in devices will remain active.
              </p>
            </div>
          </div>

          {/* Option 2: All Devices */}
          <div
            onClick={() => setLogoutScope("all")}
            className={`group relative flex items-start gap-3.5 rounded-xl border p-3.5 cursor-pointer transition-all ${
              logoutScope === "all"
                ? "border-destructive bg-destructive/5 shadow-xs ring-1 ring-destructive/30"
                : "border-border/70 hover:border-border hover:bg-muted/40"
            }`}
          >
            <div
              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                logoutScope === "all"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-muted text-muted-foreground group-hover:text-foreground"
              }`}
            >
              <ShieldAlert className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span>Log Out of All Devices</span>
                  <span className="rounded bg-destructive/15 px-1.5 py-0.2 text-[10px] font-bold text-destructive">
                    {totalActive} Device{totalActive > 1 ? "s" : ""}
                  </span>
                </span>
                {logoutScope === "all" && (
                  <CheckCircle2 className="h-4 w-4 text-destructive" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Immediately terminate all active sessions across all desktop browsers, laptops, and mobile devices.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-2 pt-2 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={onClose}
            className="w-full sm:w-auto text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={logoutScope === "all" ? "destructive" : "default"}
            disabled={isPending}
            onClick={handleConfirmLogout}
            className="w-full sm:w-auto text-xs flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : logoutScope === "all" ? (
              <span>Sign Out All ({totalActive}) Devices</span>
            ) : (
              <span>Sign Out This Device</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
