import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Compass,
  Calendar,
  Euro,
  Gauge,
  Sparkles,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  Loader2,
  Mail,
  Phone,
  User,
  Copy,
  Check,
  MessageSquare,
} from "lucide-react"
import type { JourneyWizardRequestItem } from "@/hooks/requests/useGetJourneyWizardRequests"
import {
  useUpdateJourneyWizardRequestStatus,
  useDeleteJourneyWizardRequest,
} from "@/hooks/requests/useGetJourneyWizardRequests"
import { toast } from "sonner"

interface JourneyWizardDetailsModalProps {
  request: JourneyWizardRequestItem | null
  onClose: () => void
}

export default function JourneyWizardDetailsModal({
  request,
  onClose,
}: JourneyWizardDetailsModalProps) {
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateJourneyWizardRequestStatus()
  const { mutate: deleteRequest, isPending: isDeleting } =
    useDeleteJourneyWizardRequest()

  const [notes, setNotes] = useState(request?.notes || "")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!request) return null

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    toast.success(`${label} copied to clipboard`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const formattedDate = new Date(request.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleStatusChange = (newStatus: string) => {
    updateStatus(
      { id: request.id, status: newStatus, notes },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this wizard request?")) {
      deleteRequest(request.id, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl text-card-foreground"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-start gap-3 border-b border-border/60 pb-4 pr-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Journey Planner Request
                </h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    request.status === "NEW"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : request.status === "CONTACTED"
                      ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      : request.status === "IN_PROGRESS"
                      ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  }`}
                >
                  {request.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Received on {formattedDate}
              </p>
            </div>
          </div>

          {/* Modal Content Grid */}
          <div className="mt-5 flex flex-col gap-5 text-xs">
            {/* Explorer / Requester Contact Details Card */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
              <span className="font-bold text-foreground uppercase tracking-wider text-[11px] block flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" /> Requester Explorer Contact Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Requester Name */}
                <div className="flex flex-col gap-0.5 rounded-lg border border-border/50 bg-background p-2.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Explorer Name</span>
                  <span className="text-xs font-bold text-foreground truncate">
                    {request.name || "Explorer / Explorer Group"}
                  </span>
                </div>

                {/* Requester Email */}
                <div className="flex flex-col gap-0.5 rounded-lg border border-border/50 bg-background p-2.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Email Address</span>
                  {request.email ? (
                    <div className="flex items-center justify-between gap-1">
                      <a
                        href={`mailto:${request.email}`}
                        className="text-xs font-bold text-primary underline underline-offset-2 truncate flex items-center gap-1"
                        title="Send Email"
                      >
                        <Mail className="h-3 w-3 shrink-0" />
                        <span className="truncate">{request.email}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(request.email!, "Email")}
                        className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                        title="Copy Email"
                      >
                        {copiedField === "Email" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs italic text-muted-foreground">Not provided</span>
                  )}
                </div>

                {/* Requester Phone */}
                <div className="flex flex-col gap-0.5 rounded-lg border border-border/50 bg-background p-2.5">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Phone Number</span>
                  {request.phone ? (
                    <div className="flex items-center justify-between gap-1">
                      <a
                        href={`tel:${request.phone}`}
                        className="text-xs font-bold text-foreground hover:text-primary truncate flex items-center gap-1"
                        title="Call Phone"
                      >
                        <Phone className="h-3 w-3 shrink-0 text-emerald-600" />
                        <span className="truncate">{request.phone}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(request.phone!, "Phone")}
                        className="p-1 rounded text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                        title="Copy Phone"
                      >
                        {copiedField === "Phone" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs italic text-muted-foreground">Not provided</span>
                  )}
                </div>
              </div>

              {request.notes && (
                <div className="pt-2 border-t border-primary/10">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-amber-500" /> Explorer Custom Requests / Initial Message:
                  </span>
                  <p className="text-xs text-foreground leading-relaxed mt-1 font-medium bg-background/80 p-2.5 rounded-md border border-border/40 whitespace-pre-wrap">
                    {request.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Metrics */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 flex flex-col gap-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Duration
                </span>
                <span className="font-semibold text-foreground">
                  {request.duration || "Not specified"}
                </span>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 flex flex-col gap-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Euro className="h-3.5 w-3.5 text-emerald-500" /> Budget
                </span>
                <span className="font-semibold text-foreground">
                  {request.budgetText || (request.budget ? `€${request.budget}` : "Not specified")}
                </span>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 flex flex-col gap-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Gauge className="h-3.5 w-3.5 text-amber-500" /> Pace
                </span>
                <span className="font-semibold text-foreground">
                  {request.pace || "Balanced"}
                </span>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-3 flex flex-col gap-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Comfort
                </span>
                <span className="font-semibold text-foreground">
                  {request.comfortLevel || "Comfort"}
                </span>
              </div>
            </div>

            {/* Detailed Selection Categories */}
            <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/10 p-4">
              {/* Journey Types */}
              <div>
                <span className="font-semibold text-foreground block mb-1.5 uppercase text-[10px] tracking-wider text-muted-foreground">
                  Journey Types
                </span>
                {request.journeyTypes && request.journeyTypes.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {request.journeyTypes.map((type) => (
                      <span
                        key={type}
                        className="rounded-md bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 font-medium"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">None selected</span>
                )}
              </div>

              {/* Travel Styles */}
              <div>
                <span className="font-semibold text-foreground block mb-1.5 uppercase text-[10px] tracking-wider text-muted-foreground">
                  Travel Styles
                </span>
                {request.travelStyles && request.travelStyles.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {request.travelStyles.map((style) => (
                      <span
                        key={style}
                        className="rounded-md bg-secondary/60 text-foreground border border-border px-2.5 py-1 font-medium"
                      >
                        {style}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">None selected</span>
                )}
              </div>

              {/* Perfect For */}
              <div>
                <span className="font-semibold text-foreground block mb-1.5 uppercase text-[10px] tracking-wider text-muted-foreground">
                  Perfect For / Companions
                </span>
                {request.perfectFor && request.perfectFor.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {request.perfectFor.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 font-medium flex items-center gap-1"
                      >
                        <Users className="h-3 w-3" /> {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">None selected</span>
                )}
              </div>
            </div>

            {/* Admin Internal Notes */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-foreground">
                Internal Admin Notes / Designer Comments:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes for travel designers (e.g., Client contacted via WhatsApp, prefers Croatia coast)..."
                className="w-full rounded-lg border border-border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[70px]"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/20 cursor-pointer transition-colors"
            >
              {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium mr-1">Mark Status:</span>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange("CONTACTED")}
                className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-500/20 transition-colors cursor-pointer"
              >
                Contacted
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange("IN_PROGRESS")}
                className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-600 hover:bg-purple-500/20 transition-colors cursor-pointer"
              >
                In Progress
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusChange("CLOSED")}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Close Request
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
