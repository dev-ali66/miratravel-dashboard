import { useState, useCallback, useEffect } from "react"
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Smartphone,
  History,
  AlertCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { apiPrivate } from "@/lib/api-client"
import { PasswordRules, isPasswordStrong } from "./PasswordRules"

interface PasswordSecuritySectionProps {
  onOpenDevicesModal?: () => void
  onNavigateAuditLogs?: () => void
}

export function PasswordSecuritySection({
  onOpenDevicesModal,
  onNavigateAuditLogs,
}: PasswordSecuritySectionProps) {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState<number>(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState(false)

  // Cooldown countdown effect for backend 60s rate limit
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 1 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (!touched) setTouched(true)
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }

  const validate = useCallback((): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (!form.oldPassword || !form.oldPassword.trim()) {
      errs.oldPassword = "Current password is required"
    }

    if (!form.newPassword || !form.newPassword.trim()) {
      errs.newPassword = "New password is required"
    } else if (form.newPassword.length < 8) {
      errs.newPassword = "Password must be at least 8 characters"
    } else if (!isPasswordStrong(form.newPassword)) {
      errs.newPassword = "Password must fulfill all security requirements below"
    } else if (form.oldPassword && form.newPassword === form.oldPassword) {
      errs.newPassword = "New password must be different from current password"
    }

    if (!form.confirmPassword || !form.confirmPassword.trim()) {
      errs.confirmPassword = "Please confirm your new password"
    } else if (form.newPassword !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match"
    }

    return errs
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cooldown > 0) {
      toast.info(`Please wait ${cooldown} seconds before submitting again.`)
      return
    }

    const validationErrors = validate()
    setErrors(validationErrors)
    // Match frontend: do NOT show a toast on validation errors, display inline messages
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setLoading(true)
    try {
      const res = await apiPrivate.post("/auth/change-password", {
        currentPassword: form.oldPassword,
        newPassword: form.newPassword,
      })

      if (res.data?.success || res.status === 200) {
        toast.success("Password updated successfully!")
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
        setErrors({})
        setTouched(false)
        setShowOld(false)
        setShowNew(false)
        setShowConfirm(false)
        // Activate 60s cooldown to respect backend security limit
        setCooldown(60)
      } else {
        toast.error(res.data?.message || "Failed to update password.")
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        // Backend rate limit reached, start cooldown timer immediately
        setCooldown(60)
      } else {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to update password. Please check your current password."
        // Avoid double toast if interceptor already handled it
        if (!message.includes("Too many requests")) {
          toast.error(message)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" })
    setErrors({})
    setTouched(false)
    setShowOld(false)
    setShowNew(false)
    setShowConfirm(false)
  }

  return (
    <div className="w-full rounded-xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                Password & Security
              </h2>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                Credentials
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Change your admin password and manage account security parameters.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Old Password */}
          <div className="flex flex-col gap-1">
            <div
              className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${errors.oldPassword
                ? "border-destructive focus-within:border-destructive ring-2 ring-destructive/10"
                : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
            >
              <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                Old Password <span className="text-destructive">*</span>
              </label>
              <input
                type={showOld ? "text" : "password"}
                value={form.oldPassword}
                onChange={handleChange("oldPassword")}
                placeholder="Enter current password"
                disabled={loading}
                autoComplete="current-password"
                className="h-full w-full bg-transparent px-3.5 pr-10 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowOld((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showOld ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-destructive pl-1">{errors.oldPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <div
              className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${errors.newPassword
                ? "border-destructive focus-within:border-destructive ring-2 ring-destructive/10"
                : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
            >
              <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                New Password <span className="text-destructive">*</span>
              </label>
              <input
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={handleChange("newPassword")}
                placeholder="Enter new strong password"
                disabled={loading}
                autoComplete="new-password"
                className="h-full w-full bg-transparent px-3.5 pr-10 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-destructive pl-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1">
            <div
              className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${errors.confirmPassword
                ? "border-destructive focus-within:border-destructive ring-2 ring-destructive/10"
                : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
            >
              <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                Confirm New Password <span className="text-destructive">*</span>
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="Re-enter new password"
                disabled={loading}
                autoComplete="new-password"
                className="h-full w-full bg-transparent px-3.5 pr-10 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive pl-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Password Strength Checklist & Bar */}
        {form.newPassword.length > 0 && (
          <div className="rounded-md border border-border/60 bg-muted/20 p-4 transition-all">
            <PasswordRules password={form.newPassword} />
          </div>
        )}

        {/* Rate limit warning banner when active */}
        {cooldown > 0 && (
          <div className="flex items-center gap-2.5 rounded-md border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
            <div className="flex-1">
              <span className="font-semibold">Security Rate Limit Active:</span>{" "}
              Backend security policy enforces 1 password attempt per minute. You can retry in{" "}
              <span className="font-bold underline">{cooldown} seconds</span>.
            </div>
          </div>
        )}

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <div className="text-xs text-muted-foreground hidden sm:block">
            A confirmation email will be sent once your credentials are changed.
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading || cooldown > 0}
              className="flex items-center gap-2 px-6 h-10 shadow-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="h-4 w-4" />
                  <span>Retry in {cooldown}s</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Update Password</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Security & Sessions Quick Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Active Devices & Sessions
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Audit currently connected browsers & devices
                </p>
              </div>
            </div>
            {onOpenDevicesModal && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenDevicesModal}
                className="text-xs h-8 cursor-pointer"
              >
                Inspect
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border border-border/70 bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <History className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  Security Audit Logs
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Review historical login and credential changes
                </p>
              </div>
            </div>
            {onNavigateAuditLogs && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onNavigateAuditLogs}
                className="text-xs h-8 cursor-pointer"
              >
                View Logs
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
