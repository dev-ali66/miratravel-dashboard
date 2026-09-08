import { useState } from "react"
import { Sliders, Save, CheckCircle2, RotateCcw, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function PaymentConfigPage() {
  const [config, setConfig] = useState({
    standardDepositPercentage: 30,
    balanceDueDaysBeforeDeparture: 60,
    lateBookingCutoffDays: 60,
    requestConfirmationGraceHours: 48,
    defaultCurrency: "EUR",
    allowManualPaymentRecord: true,
    requireCancellationReason: true,
    requireRejectionReason: true,
    autoExpireUnpaidApprovedRequests: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Payment & booking rules updated successfully")
    }, 500)
  }

  const handleReset = () => {
    setConfig({
      standardDepositPercentage: 30,
      balanceDueDaysBeforeDeparture: 60,
      lateBookingCutoffDays: 60,
      requestConfirmationGraceHours: 48,
      defaultCurrency: "EUR",
      allowManualPaymentRecord: true,
      requireCancellationReason: true,
      requireRejectionReason: true,
      autoExpireUnpaidApprovedRequests: true,
    })
    toast.info("Rules reset to standard specification v1.0 defaults")
  }

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Sliders className="h-7 w-7 text-primary" />
            Payment Rules & Booking Policy
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Global business rules for booking approvals, staged deposit percentages, and late booking thresholds (MIRA Travel v1.0).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            <span>Reset Defaults</span>
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 shadow-sm">
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save Policy"}</span>
          </Button>
        </div>
      </div>

      {/* Rules Form */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Core Calculation Engine */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">
                Staged Deposit & Cutoff Thresholds
              </h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="deposit-pct" className="text-xs font-semibold">
                  Standard Deposit Percentage (%)
                </Label>
                <Input
                  id="deposit-pct"
                  type="number"
                  min={5}
                  max={90}
                  value={config.standardDepositPercentage}
                  onChange={(e) => handleChange("standardDepositPercentage", Number(e.target.value))}
                />
                <p className="text-[11px] text-muted-foreground">
                  Applied when booking approval occurs &gt; {config.lateBookingCutoffDays} days before departure (Default: 30%).
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cutoff-days" className="text-xs font-semibold">
                  Late Booking Cutoff Rule (Days before Departure)
                </Label>
                <Input
                  id="cutoff-days"
                  type="number"
                  min={1}
                  max={180}
                  value={config.lateBookingCutoffDays}
                  onChange={(e) => handleChange("lateBookingCutoffDays", Number(e.target.value))}
                />
                <p className="text-[11px] text-muted-foreground">
                  When approval is ≤ {config.lateBookingCutoffDays} days, 100% full payment is immediately required.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="grace-hours" className="text-xs font-semibold">
                  Customer Request Confirmation Window (Hours)
                </Label>
                <Input
                  id="grace-hours"
                  type="number"
                  min={12}
                  max={168}
                  value={config.requestConfirmationGraceHours}
                  onChange={(e) => handleChange("requestConfirmationGraceHours", Number(e.target.value))}
                />
                <p className="text-[11px] text-muted-foreground">
                  Time allowed for customer to complete first payment link after admin approval.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governance & Safety */}
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <h3 className="text-base font-semibold text-foreground">
                Audit & Governance Controls
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-foreground">Mandatory Cancellation Reason</span>
                  <span className="text-[11px] text-muted-foreground">Require audit reason when staff cancels a booking</span>
                </div>
                <Switch
                  checked={config.requireCancellationReason}
                  onCheckedChange={(checked) => handleChange("requireCancellationReason", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-foreground">Mandatory Rejection Reason</span>
                  <span className="text-[11px] text-muted-foreground">Require feedback reason when rejecting travel requests</span>
                </div>
                <Switch
                  checked={config.requireRejectionReason}
                  onCheckedChange={(checked) => handleChange("requireRejectionReason", checked)}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background/50 p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-foreground">Offline Payment Registration</span>
                  <span className="text-[11px] text-muted-foreground">Allow staff to record manual bank transfer/POS transactions</span>
                </div>
                <Switch
                  checked={config.allowManualPaymentRecord}
                  onCheckedChange={(checked) => handleChange("allowManualPaymentRecord", checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
