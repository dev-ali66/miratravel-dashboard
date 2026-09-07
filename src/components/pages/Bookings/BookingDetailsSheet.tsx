import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  type BookingItem,
  useApproveBooking,
  useRejectBooking,
  useCancelBooking,
} from "@/hooks/booking/useBookings"
import { Loader2, User, PlaneTakeoff, CreditCard, X, Check, Ban } from "lucide-react"

interface BookingDetailsSheetProps {
  booking: BookingItem | null
  onClose: () => void
}

export default function BookingDetailsSheet({
  booking,
  onClose,
}: BookingDetailsSheetProps) {
  const { mutate: approveBooking, isPending: isApproving } = useApproveBooking()
  const { mutate: rejectBooking, isPending: isRejecting } = useRejectBooking()
  const { mutate: cancelBooking, isPending: isCanceling } = useCancelBooking()

  if (!booking) return null

  const isPending = isApproving || isRejecting || isCanceling

  const handleApprove = () => {
    approveBooking(booking.id, {
      onSuccess: onClose,
    })
  }

  const handleReject = () => {
    if (confirm("Are you sure you want to reject this booking request?")) {
      rejectBooking(booking.id, { onSuccess: onClose })
    }
  }

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this confirmed booking?")) {
      cancelBooking(booking.id, { onSuccess: onClose })
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      {/* 
        Using a standard dialog but wide. 
        If you prefer a slide-in sheet, you would normally use Sheet from shadcn.
      */}
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="flex flex-col gap-1 text-xl font-bold">
              Booking {booking.bookingNumber}
              <span className="text-sm font-normal text-muted-foreground">
                Submitted on {formatDate(booking.createdAt)}
              </span>
            </DialogTitle>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground border border-border/60">
                {booking.bookingStatus.replace(/_/g, " ")}
              </span>
              <span className="rounded-full bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground border border-border/60">
                {booking.paymentStatus.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column: Traveler & Logistics */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-muted/10 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                <User className="h-4 w-4" />
                Traveler Info
              </h3>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Name</span>
                  <span className="font-medium text-foreground">{booking.travelerFirstName} {booking.travelerLastName}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Email</span>
                  <span className="font-medium text-foreground">{booking.travelerEmail}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Phone</span>
                  <span className="font-medium text-foreground">{booking.travelerPhone || "—"}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Party Type</span>
                    <span className="font-medium text-foreground">{(booking as any).travelerType || "—"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Guests</span>
                    <span className="font-medium text-foreground">
                      {booking.adults} Adults, {booking.children} Children
                    </span>
                  </div>
                </div>
              </div >
            </div >

    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-muted/10 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
        <PlaneTakeoff className="h-4 w-4" />
        Logistics
      </h3>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Journey</span>
          <span className="font-medium text-foreground">
            {booking.journey?.title || booking.journeyId}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Arrival</span>
            <span className="font-medium text-foreground">{formatDate(booking.travelArrivalDate)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Departure</span>
            <span className="font-medium text-foreground">{formatDate(booking.travelDepartureDate)}</span>
          </div>
        </div>
      </div>
    </div>
          </div >

    {/* Right Column: Financials & Actions */ }
    < div className = "flex flex-col gap-6" >
      <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-muted/10 p-5">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
          <CreditCard className="h-4 w-4" />
          Financials
        </h3>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between rounded-lg bg-background p-3 border border-border/50">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-foreground">
              {booking.confirmedTotal ? `${booking.currency} ${booking.confirmedTotal}` : "Pending Approval"}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-3 border border-emerald-500/20">
            <span className="text-emerald-600 dark:text-emerald-400">Paid Amount</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {booking.currency} {booking.paidAmount}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-amber-500/10 p-3 border border-amber-500/20">
            <span className="text-amber-600 dark:text-amber-400">Outstanding</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {booking.currency} {booking.outstandingAmount}
            </span>
          </div>
        </div>
      </div>

  {/* Actions Panel */ }
  <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-muted/10 p-5 mt-auto">
    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
      Actions
    </h3>

    <div className="flex flex-col gap-3">
      {/* Approval logic based on status */}
      {(booking.bookingStatus === "REQUEST_SUBMITTED" || booking.bookingStatus === "UNDER_REVIEW") && (
        <>
          <Button
            onClick={handleApprove}
            disabled={isPending}
            className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer"
          >
            {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Approve Booking
          </Button>
          <Button
            onClick={handleReject}
            disabled={isPending}
            variant="outline"
            className="w-full gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/20 cursor-pointer"
          >
            {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            Reject Request
          </Button>
        </>
      )}

      {/* Cancel logic */}
      {booking.bookingStatus !== "REQUEST_SUBMITTED" &&
        booking.bookingStatus !== "UNDER_REVIEW" &&
        booking.bookingStatus !== "CANCELLED" &&
        booking.bookingStatus !== "REJECTED" && (
          <Button
            onClick={handleCancel}
            disabled={isPending}
            variant="destructive"
            className="w-full gap-2 cursor-pointer"
          >
            {isCanceling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
            Cancel Booking
          </Button>
        )}

      {/* Status message if fully terminal */}
      {(booking.bookingStatus === "CANCELLED" || booking.bookingStatus === "REJECTED") && (
        <div className="flex items-center justify-center p-3 text-sm text-rose-500 bg-rose-500/10 rounded-lg border border-rose-500/20">
          This booking has been {booking.bookingStatus.toLowerCase()}.
        </div>
      )}
    </div>
  </div>
          </div >
        </div >
      </DialogContent >
    </Dialog >
  )
}
