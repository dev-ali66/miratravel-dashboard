import { useState, useMemo } from "react"
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
  type BookingItem,
  useApproveBooking,
} from "@/hooks/booking/useBookings"
import {
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertTriangle,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ApproveBookingModalProps {
  booking: BookingItem | null
  isOpen: boolean
  onClose: () => void
}

type TemplateOption = "AUTO" | "STANDARD_30_70" | "FULL_PAYMENT" | "FIXED_DEPOSIT" | "CUSTOM_3_STAGE"

export function ApproveBookingModal({
  booking,
  isOpen,
  onClose,
}: ApproveBookingModalProps) {
  const { mutate: approveBooking, isPending } = useApproveBooking()

  // Base inputs
  const initialTotal = booking?.confirmedTotal
    ? Number(booking.confirmedTotal)
    : booking?.journey?.price
    ? Number(booking.journey.price)
    : 3500

  const [confirmedTotal, setConfirmedTotal] = useState<number>(initialTotal)
  const [currency, setCurrency] = useState<string>(booking?.currency || "EUR")
  const [template, setTemplate] = useState<TemplateOption>("AUTO")
  const [fixedDepositAmount, setFixedDepositAmount] = useState<number>(500)
  const [overrideReason] = useState<string>("")

  // Calculate days between today and departure date
  const { daysUntilDeparture, isWithin60Days, departureDateFormatted, finalDueDateFormatted } =
    useMemo(() => {
      if (!booking?.travelDepartureDate) {
        return {
          daysUntilDeparture: 90,
          isWithin60Days: false,
          departureDateFormatted: "—",
          finalDueDateFormatted: "—",
        }
      }
      const depDate = new Date(booking.travelDepartureDate)
      const now = new Date()
      const diffTime = depDate.getTime() - now.getTime()
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      const sixtyDaysBefore = new Date(depDate.getTime() - 60 * 24 * 60 * 60 * 1000)

      return {
        daysUntilDeparture: days,
        isWithin60Days: days <= 60,
        departureDateFormatted: depDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        finalDueDateFormatted: sixtyDaysBefore.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }
    }, [booking])

  // Active resolved rule
  const resolvedTemplate = useMemo(() => {
    if (template === "AUTO") {
      return isWithin60Days ? "FULL_PAYMENT" : "STANDARD_30_70"
    }
    return template
  }, [template, isWithin60Days])

  // Calculated Schedule Items Breakdown
  const previewItems = useMemo(() => {
    const total = Number(confirmedTotal) || 0

    if (resolvedTemplate === "FULL_PAYMENT") {
      return [
        {
          sequence: 1,
          label: "Full Payment",
          calculation: "100% of Total",
          amount: total,
          dueRule: "Immediate upon approval",
          dueDate: "Today",
        },
      ]
    }

    if (resolvedTemplate === "FIXED_DEPOSIT") {
      const deposit = Math.min(fixedDepositAmount, total)
      const balance = Math.max(0, total - deposit)
      return [
        {
          sequence: 1,
          label: "Fixed Deposit",
          calculation: `Fixed ${currency} ${deposit}`,
          amount: deposit,
          dueRule: "Immediate upon approval",
          dueDate: "Today",
        },
        {
          sequence: 2,
          label: "Final Balance",
          calculation: "Remaining Balance",
          amount: balance,
          dueRule: "60 days before departure",
          dueDate: finalDueDateFormatted,
        },
      ]
    }

    if (resolvedTemplate === "CUSTOM_3_STAGE") {
      const deposit = Math.round(total * 0.3 * 100) / 100
      const stage2 = Math.round(total * 0.3 * 100) / 100
      const stage3 = Math.round((total - deposit - stage2) * 100) / 100
      return [
        {
          sequence: 1,
          label: "Initial Deposit (30%)",
          calculation: "30% of Total",
          amount: deposit,
          dueRule: "Immediate upon approval",
          dueDate: "Today",
        },
        {
          sequence: 2,
          label: "Second Installment (30%)",
          calculation: "30% of Total",
          amount: stage2,
          dueRule: "90 days before departure",
          dueDate: "90 days before",
        },
        {
          sequence: 3,
          label: "Final Balance (40%)",
          calculation: "Remaining 40%",
          amount: stage3,
          dueRule: "60 days before departure",
          dueDate: finalDueDateFormatted,
        },
      ]
    }

    // Default: STANDARD_30_70
    const deposit = Math.round(total * 0.3 * 100) / 100
    const balance = Math.round((total - deposit) * 100) / 100
    return [
      {
        sequence: 1,
        label: "Deposit Payment (30%)",
        calculation: "30% of Total",
        amount: deposit,
        dueRule: "Immediate upon approval",
        dueDate: "Today",
      },
      {
        sequence: 2,
        label: "Final Balance (70%)",
        calculation: "70% Remaining",
        amount: balance,
        dueRule: "60 days before departure",
        dueDate: finalDueDateFormatted,
      },
    ]
  }, [confirmedTotal, resolvedTemplate, fixedDepositAmount, currency, finalDueDateFormatted])

  if (!booking) return null

  const handleApproveSubmit = () => {
    const total = Number(confirmedTotal)
    if (!total || total <= 0) return

    let scheduleOverride = undefined

    if (template === "FIXED_DEPOSIT") {
      scheduleOverride = {
        overrideReason: overrideReason.trim() || "Admin fixed deposit schedule override",
        items: [
          {
            label: "Fixed Deposit",
            calculationType: "FIXED" as const,
            ruleValue: fixedDepositAmount,
            dueRule: "IMMEDIATE_AFTER_APPROVAL" as const,
          },
          {
            label: "Final Balance",
            calculationType: "REMAINDER" as const,
            dueRule: "DAYS_BEFORE_DEPARTURE" as const,
            dueValue: 60,
          },
        ],
      }
    } else if (template === "CUSTOM_3_STAGE") {
      scheduleOverride = {
        overrideReason: overrideReason.trim() || "Admin 3-stage installment schedule override",
        items: [
          {
            label: "Initial Deposit",
            calculationType: "PERCENTAGE" as const,
            ruleValue: 30,
            dueRule: "IMMEDIATE_AFTER_APPROVAL" as const,
          },
          {
            label: "Second Installment",
            calculationType: "PERCENTAGE" as const,
            ruleValue: 30,
            dueRule: "DAYS_BEFORE_DEPARTURE" as const,
            dueValue: 90,
          },
          {
            label: "Final Balance",
            calculationType: "REMAINDER" as const,
            dueRule: "DAYS_BEFORE_DEPARTURE" as const,
            dueValue: 60,
          },
        ],
      }
    } else if (template === "FULL_PAYMENT" && !isWithin60Days) {
      scheduleOverride = {
        overrideReason: overrideReason.trim() || "Admin requested 100% full payment upfront",
        items: [
          {
            label: "Full Payment",
            calculationType: "PERCENTAGE" as const,
            ruleValue: 100,
            dueRule: "IMMEDIATE_AFTER_APPROVAL" as const,
          },
        ],
      }
    }

    approveBooking(
      {
        id: booking.id,
        data: {
          confirmedTotal: total,
          currency,
          scheduleOverride,
        },
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
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="border-b border-border/60 pb-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold text-foreground">
              Approve Booking {booking.bookingNumber}
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-1">
            Review final pricing, departure countdown rules, and confirm the scheduled payment milestones before sending offer to traveler.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-3">
          {/* Rule Countdown Banner */}
          <div
            className={cn(
              "flex flex-col gap-2 rounded-xl p-4 border text-sm",
              isWithin60Days
                ? "bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-200"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                {isWithin60Days ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                ) : (
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                )}
                <span>
                  {daysUntilDeparture} Days Until Departure ({departureDateFormatted})
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-background/80 border border-current">
                {isWithin60Days ? "≤ 60 Days Rule" : "> 60 Days Rule"}
              </span>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              {isWithin60Days
                ? "Since departure is 60 days or less from today, the system automatically mandates 100% Full Payment due immediately (no deposit option)."
                : "Since departure is more than 60 days away, standard Mira rules apply: 30% Deposit due immediately, and 70% Final Balance due on " +
                  finalDueDateFormatted +
                  " (60 days prior to departure)."}
            </p>
          </div>

          {/* Pricing & Currency Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                Confirmed Total Price <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={confirmedTotal || ""}
                  onChange={(e) => setConfirmedTotal(Number(e.target.value))}
                  placeholder="e.g. 3500.00"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono"
                  disabled={isPending}
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-muted-foreground">
                  {currency}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                disabled={isPending}
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CHF">CHF (Fr)</option>
              </select>
            </div>
          </div>

          {/* Schedule Template Override Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-primary" />
              Payment Schedule Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setTemplate("AUTO")}
                className={cn(
                  "p-2.5 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer",
                  template === "AUTO"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <div className="font-bold">Auto Rule</div>
                <div className="text-[10px] opacity-70">
                  {isWithin60Days ? "100% Full" : "30% / 70% Staged"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate("STANDARD_30_70")}
                className={cn(
                  "p-2.5 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer",
                  template === "STANDARD_30_70"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <div className="font-bold">30% / 70% Plan</div>
                <div className="text-[10px] opacity-70">Standard Deposit</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate("FULL_PAYMENT")}
                className={cn(
                  "p-2.5 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer",
                  template === "FULL_PAYMENT"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <div className="font-bold">Full 100%</div>
                <div className="text-[10px] opacity-70">Immediate Total</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate("FIXED_DEPOSIT")}
                className={cn(
                  "p-2.5 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer",
                  template === "FIXED_DEPOSIT"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <div className="font-bold">Fixed Deposit</div>
                <div className="text-[10px] opacity-70">Custom Amount</div>
              </button>
            </div>
          </div>

          {/* Fixed Deposit Specific Input */}
          {template === "FIXED_DEPOSIT" && (
            <div className="flex flex-col gap-1.5 p-3 rounded-lg border border-border bg-muted/20">
              <label className="text-xs font-semibold text-foreground">
                Fixed Deposit Amount ({currency})
              </label>
              <input
                type="number"
                min="50"
                step="10"
                value={fixedDepositAmount}
                onChange={(e) => setFixedDepositAmount(Number(e.target.value))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-bold font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          )}

          {/* Calculated Schedule Preview Table */}
          <div className="flex flex-col gap-2 rounded-xl border border-border/80 bg-muted/10 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Generated Payment Milestones Breakdown
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="pb-2 font-semibold">Milestone</th>
                    <th className="pb-2 font-semibold">Calculation</th>
                    <th className="pb-2 font-semibold">Due Rule</th>
                    <th className="pb-2 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {previewItems.map((item) => (
                    <tr key={item.sequence} className="py-2">
                      <td className="py-2.5 font-semibold text-foreground">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary font-bold mr-2">
                          {item.sequence}
                        </span>
                        {item.label}
                      </td>
                      <td className="py-2.5 text-muted-foreground">{item.calculation}</td>
                      <td className="py-2.5 font-medium text-foreground">
                        {item.dueRule} ({item.dueDate})
                      </td>
                      <td className="py-2.5 text-right font-mono font-bold text-foreground">
                        {currency} {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs">
              <span className="font-semibold text-muted-foreground">Total Scheduled Amount</span>
              <span className="font-mono text-sm font-bold text-primary">
                {currency} {confirmedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 border-t border-border/60 pt-4">
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
            type="button"
            onClick={handleApproveSubmit}
            disabled={!confirmedTotal || confirmedTotal <= 0 || isPending}
            className="cursor-pointer gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Confirm & Approve Offer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
