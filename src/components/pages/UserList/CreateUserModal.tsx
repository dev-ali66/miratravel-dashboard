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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, UserPlus } from "lucide-react"
import { useCreateUser } from "@/hooks/users/useCreateUser"

interface CreateUserModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateUserModal({ open, onClose }: CreateUserModalProps) {
  const { mutate: createUser, isPending } = useCreateUser()

  const [formData, setFormData] = useState({
    email: "",
    password: "Pa$$w0rd.",
    firstName: "",
    lastName: "",
    phone: "",
    role: "USER",
    status: "ACTIVE",
    isVerified: true,
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email) return

    createUser(
      {
        email: formData.email,
        password: formData.password || "Pa$$w0rd.",
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        phone: formData.phone || undefined,
        role: formData.role,
        status: formData.status,
        isVerified: formData.isVerified,
      },
      {
        onSuccess: () => {
          setFormData({
            email: "",
            password: "Pa$$w0rd.",
            firstName: "",
            lastName: "",
            phone: "",
            role: "USER",
            status: "ACTIVE",
            isVerified: true,
          })
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription className="text-xs">
                Create a new user account with initial role and credentials.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
          {/* Email & Password */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-email" className="text-xs font-semibold">
                Email Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-email"
                type="email"
                required
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-password" className="text-xs font-semibold">
                Initial Password
              </Label>
              <Input
                id="create-password"
                type="text"
                placeholder="Pa$$w0rd."
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-first-name" className="text-xs font-semibold">
                First Name
              </Label>
              <Input
                id="create-first-name"
                placeholder="First name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-last-name" className="text-xs font-semibold">
                Last Name
              </Label>
              <Input
                id="create-last-name"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-phone" className="text-xs font-semibold">
              Phone Number
            </Label>
            <Input
              id="create-phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-role" className="text-xs font-semibold">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(val) => handleChange("role", val)}
              >
                <SelectTrigger id="create-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User (Standard)</SelectItem>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="create-status" className="text-xs font-semibold">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleChange("status", val)}
              >
                <SelectTrigger id="create-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Auto-verify Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-foreground">
                Email Verified
              </span>
              <span className="text-[11px] text-muted-foreground">
                Mark email as pre-verified without sending verification OTP
              </span>
            </div>
            <Switch
              checked={formData.isVerified}
              onCheckedChange={(checked) => handleChange("isVerified", checked)}
            />
          </div>

          {/* Footer Buttons */}
          <DialogFooter className="mt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formData.email}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
