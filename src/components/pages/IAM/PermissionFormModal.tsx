import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useManagePermission, type PermissionItem } from "@/hooks/permission/usePermissions"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface PermissionFormModalProps {
  open: boolean
  permission: PermissionItem | null
  onClose: () => void
}

export default function PermissionFormModal({
  open,
  permission,
  onClose,
}: PermissionFormModalProps) {
  const isEditing = !!permission

  const [action, setAction] = useState<"CREATE" | "READ" | "UPDATE" | "DELETE">("READ")
  const [scope, setScope] = useState<"OWN" | "ANY" | "OTHER">("ANY")
  const [resource, setResource] = useState("")

  const { mutate: managePermission, isPending } = useManagePermission()

  // Populate form when editing
  useEffect(() => {
    if (permission) {
      setAction(permission.action || "READ")
      setScope(permission.scope || "ANY")
      setResource(permission.resource || "")
    } else {
      setAction("READ")
      setScope("ANY")
      setResource("")
    }
  }, [permission, open])

  const handleSubmit = () => {
    managePermission(
      {
        ...(isEditing ? { id: permission.id } : {}),
        action,
        scope,
        resource: resource.trim() || undefined,
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

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Permission" : "Create Permission"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-5">
          {/* Action Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="iam-perm-action"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Action
            </label>
            <select
              id="iam-perm-action"
              value={action}
              onChange={(e) => setAction(e.target.value as any)}
              className={cn(
                "w-full rounded-lg border border-border/60 bg-background/80 px-4 py-2.5 text-sm text-foreground",
                "outline-none transition-all duration-200",
                "focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              )}
            >
              <option value="CREATE">CREATE</option>
              <option value="READ">READ</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          {/* Scope Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="iam-perm-scope"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Scope
            </label>
            <select
              id="iam-perm-scope"
              value={scope}
              onChange={(e) => setScope(e.target.value as any)}
              className={cn(
                "w-full rounded-lg border border-border/60 bg-background/80 px-4 py-2.5 text-sm text-foreground",
                "outline-none transition-all duration-200",
                "focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              )}
            >
              <option value="OWN">OWN</option>
              <option value="ANY">ANY</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>

          {/* Resource Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="iam-perm-resource"
              className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              Resource
            </label>
            <select
              id="iam-perm-resource"
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className={cn(
                "w-full rounded-lg border border-border/60 bg-background/80 px-4 py-2.5 text-sm text-foreground",
                "outline-none transition-all duration-200",
                "focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              )}
            >
              <option value="" disabled>Select a resource</option>
              <option value="Auth">Auth</option>
              <option value="Booking">Booking</option>
              <option value="CmsPage">CmsPage</option>
              <option value="CmsPageSection">CmsPageSection</option>
              <option value="CountryPage">CountryPage</option>
              <option value="CountryPageSection">CountryPageSection</option>
              <option value="Journey">Journey</option>
              <option value="JourneyAccommodation">JourneyAccommodation</option>
              <option value="JourneyAddOn">JourneyAddOn</option>
              <option value="JourneyItinerary">JourneyItinerary</option>
              <option value="Location">Location</option>
              <option value="PaymentConfig">PaymentConfig</option>
              <option value="PaymentRecord">PaymentRecord</option>
              <option value="PaymentSchedule">PaymentSchedule</option>
              <option value="PaymentScheduleItem">PaymentScheduleItem</option>
              <option value="Permission">Permission</option>
              <option value="PlacePage">PlacePage</option>
              <option value="PlacePageSection">PlacePageSection</option>
              <option value="RegionPage">RegionPage</option>
              <option value="RegionPageSection">RegionPageSection</option>
              <option value="Role">Role</option>
              <option value="Session">Session</option>
              <option value="UserPersonalInfo">UserPersonalInfo</option>
              <option value="UserSettings">UserSettings</option>
            </select>
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
            disabled={isPending}
            className="cursor-pointer gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update Permission"
            ) : (
              "Create Permission"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
