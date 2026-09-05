import { Loader2, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RequestDetailsModalProps {
  selectedUser: any | null
  setSelectedUser: (user: any | null) => void
  isUpdating: boolean
  updateStatus: (data: {
    id: string
    isVerified: boolean
    status?: string
  }) => void
}

export default function RequestDetailsModal({
  selectedUser,
  setSelectedUser,
  isUpdating,
  updateStatus,
}: RequestDetailsModalProps) {
  return (
    <Dialog
      open={!!selectedUser}
      onOpenChange={(open) => !open && setSelectedUser(null)}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Instructor Request Details</DialogTitle>
          <DialogDescription>
            Review the detailed information for this applicant.
          </DialogDescription>
        </DialogHeader>

        {selectedUser && (
          <div className="mt-2 flex flex-col gap-5">
            <div className="flex items-center gap-4 border-b border-border/40 pb-5">
              <img
                src={
                  selectedUser.userPersonalInfo?.photoUrl?.[0] ||
                  "https://i.pravatar.cc/150?u=default"
                }
                alt="Profile"
                className="h-16 w-16 rounded-full border border-border object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold">
                  {selectedUser.userPersonalInfo?.firstName
                    ? `${selectedUser.userPersonalInfo.firstName} ${selectedUser.userPersonalInfo.lastName || ""}`
                    : "No Name"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {selectedUser.email}
                </span>
                <span className="mt-1.5 w-fit rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary uppercase">
                  {selectedUser.roles?.[0]?.name || "USER"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-xl border border-border/40 bg-muted/20 p-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Skill Level
                </span>
                <span className="font-medium text-foreground capitalize">
                  {Array.isArray(selectedUser.instructorInfo?.skill)
                    ? selectedUser.instructorInfo.skill.join(", ").toLowerCase()
                    : selectedUser.instructorInfo?.skill?.toLowerCase() ||
                      "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Experience
                </span>
                <span className="font-medium text-foreground">
                  {selectedUser.instructorInfo?.experience || "Not provided"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Preferred Time
                </span>
                <span className="font-medium text-foreground capitalize">
                  {Array.isArray(selectedUser.instructorInfo?.preferredTime)
                    ? selectedUser.instructorInfo.preferredTime
                        .join(", ")
                        .toLowerCase()
                    : selectedUser.instructorInfo?.preferredTime?.toLowerCase() ||
                      "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Verification Status
                </span>
                <span
                  className={`font-medium ${selectedUser.isVerified ? "text-emerald-500" : "text-amber-500"}`}
                >
                  {selectedUser.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>

            {selectedUser.instructorInfo?.license?.length > 0 && (
              <div className="mt-2 flex flex-col">
                <span className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Licenses & Documents
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.instructorInfo.license.map(
                    (lic: string, i: number) => (
                      <a
                        key={i}
                        href={lic}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-50 items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-primary transition-all hover:border-primary/30 hover:bg-muted"
                      >
                        <div className="truncate">View Document {i + 1}</div>
                      </a>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end gap-3 border-t border-border/40 pt-4">
              <button
                className="flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-500/20 active:scale-95 disabled:opacity-50"
                disabled={isUpdating}
                onClick={() => {
                  updateStatus({
                    id: selectedUser.id,
                    isVerified: false,
                    status: "INACTIVE",
                  })
                  setSelectedUser(null)
                }}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Reject
              </button>
              <button
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm shadow-primary/20 transition-colors hover:bg-primary/90 active:scale-95 disabled:opacity-50"
                disabled={isUpdating || selectedUser.isVerified}
                onClick={() => {
                  updateStatus({
                    id: selectedUser.id,
                    isVerified: true,
                    status: "ACTIVE",
                  })
                  setSelectedUser(null)
                }}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Approve Request
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
