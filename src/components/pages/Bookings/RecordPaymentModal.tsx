import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  useRecordManualPayment,
  useGetPaymentSchedules,
} from "@/hooks/booking/usePayments"
import type { BookingItem } from "@/hooks/booking/useBookings"
import {
  CreditCard,
  Calendar,
  FileText,
  DollarSign,
  Loader2,
  Building,
} from "lucide-react"

interface RecordPaymentModalProps {
  booking: BookingItem | null
  isOpen: boolean
  onClose: () => void
}

export function RecordPaymentModal({
  booking,
  isOpen,
  onClose,
}: RecordPaymentModalProps) {
  const { mutate: recordPayment, isPending } = useRecordManualPayment()
  const { data: schedules } = useGetPaymentSchedules(booking?.id)

  const activeSchedule = schedules?.[0]
  const scheduleItems = activeSchedule?.items || []

  // Outstanding amount or first unpaid item amount
  const initialAmount = Number(booking?.outstandingAmount) || 0

  const [amount, setAmount] = useState<number>(initialAmount)
  const [currency, setCurrency] = useState<string>(booking?.currency || "EUR")
  const [scheduleItemId, setScheduleItemId] = useState<string>("")
  const [method, setMethod] = useState<string>("Bank Transfer")
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  )
  const [pspTransactionRef, setPspTransactionRef] = useState<string>("")
  const [adminNotes, setAdminNotes] = useState<string>("")

  useEffect(() => {
    if (booking) {
      setAmount(Number(booking.outstandingAmount) || 0)
      setCurrency(booking.currency || "EUR")
    }
    if (scheduleItems.length > 0) {
      const firstUnpaid = scheduleItems.find((item) => item.status !== "PAID")
      if (firstUnpaid) {
        setScheduleItemId(firstUnpaid.id)
        const dueAmount = Number(firstUnpaid.calculatedAmount) - Number(firstUnpaid.paidAmount)
        if (dueAmount > 0) {
          setAmount(dueAmount)
        }
      }
    }
  }, [booking, scheduleItems])

  if (!booking) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || amount <= 0) return

    recordPayment(
      {
        bookingId: booking.id,
        scheduleItemId: scheduleItemId || undefined,
        amount,
        currency,
        method,
        paymentDate: new Date(paymentDate).toISOString(),
        pspTransactionRef: pspTransactionRef.trim() || undefined,
        adminNotes: adminNotes.trim() || undefined,
        status: "SUCCEEDED",
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-primary">
            <CreditCard className="h-5 w-5" />
            <DialogTitle className="text-lg font-bold">
              Record Manual Payment
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Register an offline bank transfer, cash, or terminal payment received for Booking {booking.bookingNumber}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Amount & Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                Received Amount <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-border bg-background p-2.5 text-sm font-mono font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                disabled={isPending}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Currency
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-2.5 text-sm font-semibold uppercase text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Target Milestone Schedule Item */}
          {scheduleItems.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Apply To Milestone / Schedule Item
              </label>
              <select
                value={scheduleItemId}
                onChange={(e) => setScheduleItemId(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                disabled={isPending}
              >
                <option value="">Auto-Apply to Next Due Item</option>
                {scheduleItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    #{item.sequence} {item.label} — Due: {currency} {item.calculatedAmount} ({item.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Building className="h-3.5 w-3.5" />
                Payment Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                disabled={isPending}
              >
                <option value="Bank Transfer">Bank Transfer (Wire/SEPA)</option>
                <option value="Cash">Cash (In-person)</option>
                <option value="Card Terminal POS">Card Terminal (POS)</option>
                <option value="Cheque">Bank Cheque</option>
                <option value="Manual Override">Manual Admin Override</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Payment Date
              </label>
              <input
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                disabled={isPending}
              />
            </div>
          </div>

          {/* Reference & Audit Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Transaction / Bank Reference
            </label>
            <input
              type="text"
              value={pspTransactionRef}
              onChange={(e) => setPspTransactionRef(e.target.value)}
              placeholder="e.g. SWIFT: TR-982348 or Receipt #402"
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
              disabled={isPending}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              Admin / Audit Notes
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal verification notes, banker name, invoice cross-ref..."
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              disabled={isPending}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t border-border/60 pt-3">
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
              disabled={!amount || amount <= 0 || isPending}
              className="cursor-pointer gap-2 bg-primary text-primary-foreground"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Payment Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
