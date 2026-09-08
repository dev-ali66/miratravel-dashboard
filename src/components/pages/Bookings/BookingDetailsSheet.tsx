import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  type BookingItem,
  useRejectBooking,
  useCancelBooking,
} from "@/hooks/booking/useBookings"
import {
  useGetPaymentSchedules,
  useGetPaymentRecords,
  type PaymentScheduleItem,
} from "@/hooks/booking/usePayments"
import {
  User,
  PlaneTakeoff,
  CreditCard,
  X,
  Check,
  Ban,
  Calendar,
  Layers,
  Copy,
  PlusCircle,
  Clock,
  History,
  Mail,
  Phone,
  MessageSquare,
  Users,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ApproveBookingModal } from "./ApproveBookingModal"
import { RecordPaymentModal } from "./RecordPaymentModal"
import { BookingActionReasonModal } from "./BookingActionReasonModal"

interface BookingDetailsSheetProps {
  booking: BookingItem | null
  onClose: () => void
}

export default function BookingDetailsSheet({
  booking,
  onClose,
}: BookingDetailsSheetProps) {
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false)
  const [actionReasonModal, setActionReasonModal] = useState<{
    isOpen: boolean
    mode: "reject" | "cancel"
  }>({ isOpen: false, mode: "reject" })

  const { mutate: rejectBooking, isPending: isRejecting } = useRejectBooking()
  const { mutate: cancelBooking, isPending: isCanceling } = useCancelBooking()

  const { data: schedules, isLoading: isLoadingSchedules } = useGetPaymentSchedules(
    booking?.id
  )
  const { data: paymentRecords, isLoading: isLoadingRecords } = useGetPaymentRecords(
    booking?.id
  )

  const activeSchedule = schedules?.[0]
  const scheduleItems: PaymentScheduleItem[] = activeSchedule?.items || []

  if (!booking) return null

  const isPendingAction = isRejecting || isCanceling

  const handleActionConfirm = (reason: string) => {
    if (actionReasonModal.mode === "reject") {
      rejectBooking(
        { id: booking.id, reason },
        {
          onSuccess: () => {
            setActionReasonModal({ isOpen: false, mode: "reject" })
            onClose()
          },
        }
      )
    } else {
      cancelBooking(
        { id: booking.id, reason },
        {
          onSuccess: () => {
            setActionReasonModal({ isOpen: false, mode: "cancel" })
            onClose()
          },
        }
      )
    }
  }

  const formatDate = (d?: string | null) => {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const copyPaymentLink = (itemId: string, label: string) => {
    const payUrl = `${window.location.origin}/pay/${itemId}`
    navigator.clipboard.writeText(payUrl)
    toast.success(`Copied payment link for "${label}" to clipboard`)
  }

  const getItemStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "DUE":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "SCHEDULED":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
      case "FAILED":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
      case "WAIVED":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  return (
    <>
      <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl p-6">
          {/* Header */}
          <DialogHeader className="border-b border-border/60 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
              <DialogTitle className="flex flex-col gap-1 text-xl font-bold">
                <div className="flex items-center gap-2">
                  <span>Booking {booking.bookingNumber}</span>
                  <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                    {booking.currency}
                  </span>
                </div>
                <span className="text-xs font-normal text-muted-foreground">
                  Submitted on {formatDate(booking.createdAt)}
                </span>
              </DialogTitle>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-primary/20">
                  {booking.bookingStatus.replace(/_/g, " ")}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground border border-border">
                  {booking.paymentStatus.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </DialogHeader>

          {/* Grid Layout */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Columns: Traveler, Logistics, Payment Milestones, & Transactions */}
            <div className="md:col-span-2 flex flex-col gap-5">
              {/* Traveler & Logistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Traveler Card */}
                <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/10 p-4">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <User className="h-3.5 w-3.5" />
                    Traveler Information
                  </h3>
                  <div className="flex flex-col gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">Full Name</span>
                      <span className="font-semibold text-foreground text-sm">
                        {booking.travelerFirstName} {booking.travelerLastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="truncate">{booking.travelerEmail}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span>{booking.travelerPhone || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-foreground">
                      <Users className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span>
                        {booking.adults} Adults, {booking.children} Children ({booking.travelerType || "SOLO"})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logistics Card */}
                <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/10 p-4">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <PlaneTakeoff className="h-3.5 w-3.5" />
                    Trip Logistics
                  </h3>
                  <div className="flex flex-col gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">Journey Package</span>
                      <span className="font-semibold text-foreground text-sm line-clamp-1">
                        {booking.journey?.title || "Custom Journey"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">Arrival Date</span>
                        <span className="font-medium text-foreground">{formatDate(booking.travelArrivalDate)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase">Departure Date</span>
                        <span className="font-medium text-foreground">{formatDate(booking.travelDepartureDate)}</span>
                      </div>
                    </div>
                    {booking.travelerMessage && (
                      <div className="border-t border-border/60 pt-1.5 mt-0.5">
                        <span className="text-muted-foreground flex items-center gap-1 text-[10px] uppercase">
                          <MessageSquare className="h-3 w-3" /> Special Request / Note
                        </span>
                        <p className="text-[11px] text-foreground italic mt-0.5 line-clamp-2">
                          "{booking.travelerMessage}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Schedule Milestones Timeline (Spec §7, §10, §11) */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-muted/10 p-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <Layers className="h-3.5 w-3.5" />
                    Scheduled Payment Milestones (Staged Timeline)
                  </h3>
                  {activeSchedule && (
                    <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                      Template: {activeSchedule.templateType.replace(/_/g, " ")}
                    </span>
                  )}
                </div>

                {isLoadingSchedules ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    Loading payment schedule...
                  </div>
                ) : scheduleItems.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground flex flex-col items-center gap-1.5">
                    <Clock className="h-5 w-5 text-muted-foreground/60" />
                    <span>No payment schedule generated yet.</span>
                    <span className="text-[11px] opacity-70">
                      Approve this booking to calculate the 30/70 or 100% payment milestones.
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {scheduleItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-border/60 bg-background/60 hover:bg-background transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-2.5">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary font-mono shrink-0">
                            {item.sequence || idx + 1}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs text-foreground">{item.label}</span>
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                                  getItemStatusBadge(item.status)
                                )}
                              >
                                {item.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" /> Due: {formatDate(item.dueDate)} ({item.dueRule.replace(/_/g, " ")})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0">
                          <div className="text-right">
                            <span className="font-mono text-xs font-bold text-foreground block">
                              {booking.currency} {Number(item.calculatedAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            {Number(item.paidAmount) > 0 && (
                              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block">
                                Paid: {booking.currency} {Number(item.paidAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => copyPaymentLink(item.id, item.label)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            title="Copy Direct Checkout Link"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Records / Transaction Audit History */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-muted/10 p-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <History className="h-3.5 w-3.5" />
                    Transaction & Payment History
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRecordPaymentModal(true)}
                    className="h-7 text-xs gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="h-3 w-3 text-primary" />
                    Record Payment
                  </Button>
                </div>

                {isLoadingRecords ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    Loading transactions...
                  </div>
                ) : !paymentRecords || paymentRecords.length === 0 ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    No payment transactions recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground text-[10px] uppercase">
                          <th className="pb-1.5 font-semibold">Date</th>
                          <th className="pb-1.5 font-semibold">Method / Ref</th>
                          <th className="pb-1.5 font-semibold">Status</th>
                          <th className="pb-1.5 text-right font-semibold">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {paymentRecords.map((rec) => (
                          <tr key={rec.id} className="py-2">
                            <td className="py-2 text-foreground font-medium">
                              {formatDate(rec.paymentDate)}
                            </td>
                            <td className="py-2 text-muted-foreground">
                              <span className="text-foreground font-semibold">{rec.method || "Manual"}</span>
                              {rec.pspTransactionRef && (
                                <span className="block font-mono text-[10px] opacity-70">
                                  {rec.pspTransactionRef}
                                </span>
                              )}
                            </td>
                            <td className="py-2">
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
                                  rec.status === "SUCCEEDED"
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                )}
                              >
                                {rec.status}
                              </span>
                            </td>
                            <td className="py-2 text-right font-mono font-bold text-foreground">
                              {rec.currency} {Number(rec.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Financials & Admin Action Panel */}
            <div className="flex flex-col gap-4">
              {/* Financial Summary */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/10 p-4">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <CreditCard className="h-3.5 w-3.5" />
                  Financial Summary
                </h3>

                <div className="flex flex-col gap-2.5 text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-background p-2.5 border border-border/60">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-mono font-bold text-foreground">
                      {booking.confirmedTotal
                        ? `${booking.currency} ${Number(booking.confirmedTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : "Pending Approval"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-2.5 border border-emerald-500/20">
                    <span className="text-emerald-700 dark:text-emerald-300 font-medium">Paid Amount</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      {booking.currency} {Number(booking.paidAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-amber-500/10 p-2.5 border border-amber-500/20">
                    <span className="text-amber-700 dark:text-amber-300 font-medium">Outstanding</span>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                      {booking.currency} {Number(booking.outstandingAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Actions Panel */}
              <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/10 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Admin Actions
                </h3>

                <div className="flex flex-col gap-2">
                  {/* Approve Booking (Request Submitted / Under Review) */}
                  {(booking.bookingStatus === "REQUEST_SUBMITTED" ||
                    booking.bookingStatus === "UNDER_REVIEW") && (
                    <>
                      <Button
                        type="button"
                        onClick={() => setShowApproveModal(true)}
                        className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve & Send Offer
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActionReasonModal({ isOpen: true, mode: "reject" })}
                        className="w-full gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-500/20 cursor-pointer text-xs"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject Request
                      </Button>
                    </>
                  )}

                  {/* Record Payment Button */}
                  {booking.bookingStatus !== "REQUEST_SUBMITTED" &&
                    booking.bookingStatus !== "CANCELLED" &&
                    booking.bookingStatus !== "REJECTED" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowRecordPaymentModal(true)}
                        className="w-full gap-2 cursor-pointer text-xs border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Record Manual Payment
                      </Button>
                    )}

                  {/* Cancel Booking */}
                  {booking.bookingStatus !== "REQUEST_SUBMITTED" &&
                    booking.bookingStatus !== "CANCELLED" &&
                    booking.bookingStatus !== "REJECTED" && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => setActionReasonModal({ isOpen: true, mode: "cancel" })}
                        className="w-full gap-2 cursor-pointer text-xs"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Cancel Booking
                      </Button>
                    )}

                  {/* Terminal Status Notification */}
                  {(booking.bookingStatus === "CANCELLED" || booking.bookingStatus === "REJECTED") && (
                    <div className="flex items-center justify-center p-3 text-xs text-rose-600 bg-rose-500/10 rounded-lg border border-rose-500/20">
                      This booking has been {booking.bookingStatus.toLowerCase()}.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sub-Modals */}
      <ApproveBookingModal
        booking={booking}
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
      />

      <RecordPaymentModal
        booking={booking}
        isOpen={showRecordPaymentModal}
        onClose={() => setShowRecordPaymentModal(false)}
      />

      <BookingActionReasonModal
        isOpen={actionReasonModal.isOpen}
        onClose={() => setActionReasonModal({ isOpen: false, mode: "reject" })}
        onConfirm={handleActionConfirm}
        title={actionReasonModal.mode === "reject" ? "Reject Travel Request" : "Cancel Confirmed Booking"}
        description={
          actionReasonModal.mode === "reject"
            ? `Please specify why you are rejecting Booking ${booking.bookingNumber}. This reason will be logged in the audit trail.`
            : `Please specify the reason for cancelling Booking ${booking.bookingNumber}. All unpaid schedule items will be closed.`
        }
        confirmButtonText={actionReasonModal.mode === "reject" ? "Confirm Rejection" : "Confirm Cancellation"}
        confirmButtonVariant="destructive"
        isPending={isPendingAction}
      />
    </>
  )
}
