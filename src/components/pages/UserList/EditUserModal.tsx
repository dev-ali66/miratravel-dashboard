import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
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
import { Loader2 } from "lucide-react"
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
    role: "USER",
    roleId: "",
    status: "ACTIVE",
    free_lead_used: false,
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
      role: user.roles?.toUpperCase() || "USER",
      roleId: currentRole?.id || "",
      status: user.status || "ACTIVE",

      // Instructor হলে existing value নেবে
      free_lead_used:
        user.roles?.toUpperCase() === "INSTRUCTOR"
          ? (user.instructorInfo?.free_lead_used ?? false)
          : false,
    })
  }, [user, rolesData])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleRoleChange = (roleId: string) => {
    const selectedRole = rolesData?.data?.find((role) => role.id === roleId)

    const selectedRoleName = selectedRole?.name?.toUpperCase() || "USER"

    setFormData((prev) => ({
      ...prev,
      roleId,
      role: selectedRoleName,

      // Instructor না হলে false
      free_lead_used:
        selectedRoleName === "INSTRUCTOR" ? prev.free_lead_used : false,
    }))
  }

  const handleFreeLeadChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      free_lead_used: value === "true",
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
        role: formData.role,
        roles: formData.role,
        roleId: formData.roleId,
        status: formData.status,

        // শুধুমাত্র instructor এর জন্য পাঠানো হবে
        ...(formData.role === "INSTRUCTOR" && {
          free_lead_used: formData.free_lead_used,
        }),
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-first-name">First Name</Label>

              <Input
                id="edit-first-name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-last-name">Last Name</Label>

              <Input
                id="edit-last-name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-user-email">Email</Label>

            <Input
              id="edit-user-email"
              type="email"
              required
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Role & Status */}
          <div className="grid grid-cols-2 gap-4">
            {/* Role */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-user-role">Role</Label>

              <Select
                value={formData.roleId}
                onValueChange={handleRoleChange}
                disabled={rolesLoading}
              >
                <SelectTrigger id="edit-user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>

                <SelectContent>
                  {rolesLoading ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : rolesData?.data?.length ? (
                    rolesData.data.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No roles found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-user-status">Status</Label>

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

                  <SelectItem value="DEACTIVE">Deactive</SelectItem>

                  <SelectItem value="BLOCKED">Blocked</SelectItem>

                  <SelectItem value="SUSPENDED">Suspended</SelectItem>

                  <SelectItem value="PENDING">Pending</SelectItem>

                  <SelectItem value="DELETED">Deleted</SelectItem>

                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Free Lead Used - Instructor Only */}
          {formData.role === "INSTRUCTOR" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-free-lead-used">Free Lead Used</Label>

              <Select
                value={String(formData.free_lead_used)}
                onValueChange={handleFreeLeadChange}
              >
                <SelectTrigger id="edit-free-lead-used">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="false">No</SelectItem>

                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                Select whether this instructor has already used their free lead.
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="mt-4 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[120px] cursor-pointer"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
