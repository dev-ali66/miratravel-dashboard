import { useState, useEffect } from "react"
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
import { Loader2, UserCog } from "lucide-react"
import { useEditUser } from "@/hooks/users/useEditUser"
import { type UserItem } from "@/hooks/users/useGetUsers"
import { useGetRoles } from "@/hooks/role/useRoles"

interface EditUserModalProps {
  user: UserItem | null
  onClose: () => void
}

export default function EditUserModal({ user, onClose }: EditUserModalProps) {
  const { mutate: editUser, isPending } = useEditUser()
  const { data: rolesData, isLoading: rolesLoading } = useGetRoles(1, 100)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "USER",
    roleId: "",
    status: "ACTIVE",
    isVerified: true,
    password: "",
  })

  useEffect(() => {
    if (!user) return

    const currentRole = rolesData?.data?.find(
      (role) => role.name.toUpperCase() === user.roles?.toUpperCase()
    )

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.roles?.toUpperCase() || "USER",
      roleId: currentRole?.id || user.roleId || "",
      status: user.status || "ACTIVE",
      isVerified: user.isVerified ?? true,
      password: "",
    })
  }, [user, rolesData])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRoleChange = (roleIdOrName: string) => {
    const selectedRole = rolesData?.data?.find((role) => role.id === roleIdOrName || role.name === roleIdOrName)
    const selectedRoleName = selectedRole?.name?.toUpperCase() || roleIdOrName.toUpperCase()

    setFormData((prev) => ({
      ...prev,
      roleId: selectedRole?.id || "",
      role: selectedRoleName,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    editUser(
      {
        id: user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        roles: formData.role,
        roleId: formData.roleId || undefined,
        status: formData.status,
        isVerified: formData.isVerified,
        ...(formData.password ? { password: formData.password } : {}),
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription className="text-xs">
                Update account details, role permissions, and access status.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-first-name" className="text-xs font-semibold">First Name</Label>
              <Input
                id="edit-first-name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-last-name" className="text-xs font-semibold">Last Name</Label>
              <Input
                id="edit-last-name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-user-email" className="text-xs font-semibold">Email</Label>
              <Input
                id="edit-user-email"
                type="email"
                required
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-user-phone" className="text-xs font-semibold">Phone</Label>
              <Input
                id="edit-user-phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-2 gap-3">
            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-user-role" className="text-xs font-semibold">Role</Label>
              <Select
                value={formData.roleId || formData.role}
                onValueChange={handleRoleChange}
                disabled={rolesLoading}
              >
                <SelectTrigger id="edit-user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {rolesData?.data?.length ? (
                    rolesData.data.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="USER">USER</SelectItem>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="MANAGER">MANAGER</SelectItem>
                      <SelectItem value="EDITOR">EDITOR</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-user-status" className="text-xs font-semibold">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger id="edit-user-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Password Optional */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-new-password" className="text-xs font-semibold">
              New Password <span className="text-xs font-normal text-muted-foreground">(leave blank to keep current)</span>
            </Label>
            <Input
              id="edit-new-password"
              type="password"
              placeholder="Enter new password if changing"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          {/* Email Verified Toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-foreground">
                Email Verification Status
              </span>
              <span className="text-[11px] text-muted-foreground">
                Mark account as email-verified
              </span>
            </div>
            <Switch
              checked={formData.isVerified}
              onCheckedChange={(checked) => handleChange("isVerified", checked)}
            />
          </div>

          {/* Buttons */}
          <DialogFooter className="mt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[120px]"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
