import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useManageRole, type RoleItem } from "@/hooks/role/useRoles"
import {
  useGetPermissions,
  type PermissionItem,
} from "@/hooks/permission/usePermissions"
import { cn } from "@/lib/utils"
import { Check, Loader2 } from "lucide-react"

interface RoleFormModalProps {
  open: boolean
  role: RoleItem | null
  onClose: () => void
}

export default function RoleFormModal({
  open,
  role,
  onClose,
}: RoleFormModalProps) {
  const isEditing = !!role

  const [name, setName] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [activeResource, setActiveResource] = useState<string>("")

  const { mutate: manageRole, isPending } = useManageRole()
  const { data: permissionsData, isLoading: permissionsLoading } =
    useGetPermissions(1, 100)

  const allPermissions: PermissionItem[] = permissionsData?.data || []

  // Populate form when editing
  useEffect(() => {
    if (role) {
      setName(role.name || "")
      // permissions may be strings or objects — normalize to ID strings
      const permIds = (role.permissions || []).map((p: any) =>
        typeof p === "string" ? p : p.id
      )
      setSelectedPermissions(permIds)
    } else {
      setName("")
      setSelectedPermissions([])
    }
  }, [role, open])

  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId]
    )
  }

  const handleSubmit = () => {
    if (!name.trim()) return

    manageRole(
      {
        ...(isEditing ? { id: role.id } : {}),
        name: name.trim(),
        permissions: selectedPermissions,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            onClose()
          }
        },
      }
    )
  }

  // Group permissions by resource
  const groupedPermissions = allPermissions.reduce(
    (acc, perm) => {
      const mod = perm.resource || "General"
      if (!acc[mod]) acc[mod] = []
      acc[mod].push(perm)
      return acc
    },
    {} as Record<string, PermissionItem[]>
  )

  const resourceNames = Object.keys(groupedPermissions).sort()

  useEffect(() => {
    if (resourceNames.length > 0 && !activeResource) {
      setActiveResource(resourceNames[0])
    }
  }, [resourceNames, activeResource])

  // Helper to get display label for a permission
  const getPermLabel = (perm: PermissionItem) => {
    return `${perm.action} - ${perm.scope}`
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Role" : "Create Role"}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-5">
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="iam-role-name"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Role Name
            </label>
            <input
              id="iam-role-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Admin, Moderator, Editor"
              className={cn(
                "w-full rounded-lg border border-border/60 bg-background/80 px-4 py-2.5 text-sm text-foreground",
                "placeholder:text-muted-foreground/50",
                "outline-none transition-all duration-200",
                "focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              )}
            />
          </div>

          {/* Permissions Checklist */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Permissions
            </p>

            {permissionsLoading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading permissions...
              </div>
            ) : allPermissions.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground/60">
                No permissions available.
              </p>
            ) : (
              <div className="flex flex-col md:flex-row h-[320px] rounded-xl border border-border/50 bg-muted/10 overflow-hidden">
                {/* Left Sidebar: Resources */}
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border/30 bg-muted/20 overflow-y-auto">
                  {resourceNames.map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setActiveResource(res)}
                      className={cn(
                        "w-full border-l-2 px-4 py-3 text-left text-sm transition-colors cursor-pointer",
                        activeResource === res
                          ? "border-primary bg-background font-semibold text-primary"
                          : "border-transparent text-muted-foreground hover:bg-muted/30"
                      )}
                    >
                      {res}
                    </button>
                  ))}
                </div>

                {/* Right Content: Permissions for active resource */}
                <div className="w-full md:w-2/3 overflow-y-auto p-3">
                  {activeResource && groupedPermissions[activeResource] ? (
                    <div className="flex flex-col gap-1.5">
                      <div className="mb-2 px-2">
                        <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                          {activeResource} Permissions
                        </span>
                      </div>
                      
                      {groupedPermissions[activeResource].map((perm) => {
                        const isChecked = selectedPermissions.includes(perm.id)
                        const label = getPermLabel(perm)

                        return (
                          <button
                            key={perm.id}
                            type="button"
                            onClick={() => togglePermission(perm.id)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors duration-150 cursor-pointer",
                              "hover:bg-muted/30",
                              isChecked && "bg-primary/5 border border-primary/20"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
                                isChecked
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border/60 bg-background"
                              )}
                            >
                              {isChecked && (
                                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                              )}
                            </div>
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isChecked ? "text-foreground" : "text-muted-foreground"
                              )}
                            >
                              {label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {selectedPermissions.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedPermissions.length} permission
                {selectedPermissions.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isPending || !name.trim()}
            className="cursor-pointer gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Role"
            ) : (
              "Create Role"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
