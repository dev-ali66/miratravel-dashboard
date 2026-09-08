import { useState } from "react"
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle2,
  Send,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface NotificationTrigger {
  id: string
  name: string
  eventKey: string
  description: string
  channels: {
    email: boolean
    sms: boolean
    inApp: boolean
    adminSlack: boolean
  }
  templateSubject: string
  templateSnippet: string
  isActive: boolean
  lastTriggered: string
}

const mockTriggers: NotificationTrigger[] = [
  {
    id: "trig-1",
    name: "Booking Request Received",
    eventKey: "booking.requested",
    description: "Fires immediately when traveler submits a deposit on a luxury journey.",
    channels: { email: true, sms: true, inApp: true, adminSlack: true },
    templateSubject: "MIRA Confirmation: We have received your booking reservation #{{booking_id}}",
    templateSnippet:
      "Dear {{traveler_name}}, thank you for reserving your place on {{journey_title}}. Our concierge team is preparing your itinerary dossier.",
    isActive: true,
    lastTriggered: "10 mins ago",
  },
  {
    id: "trig-2",
    name: "Deposit Payment Succeeded (25%)",
    eventKey: "payment.deposit.success",
    description: "Fired by Stripe webhook after 25% non-refundable deposit is charged.",
    channels: { email: true, sms: false, inApp: true, adminSlack: true },
    templateSubject: "Official Receipt: Deposit Received for {{journey_title}}",
    templateSnippet:
      "We confirm receipt of {{paid_amount}}. Your remaining balance of {{balance_due}} will be due 60 days before departure on {{balance_due_date}}.",
    isActive: true,
    lastTriggered: "2 hours ago",
  },
  {
    id: "trig-3",
    name: "60-Day Final Balance Payment Due",
    eventKey: "payment.balance.reminder",
    description: "Automated cron triggered exactly 60 days prior to journey departure.",
    channels: { email: true, sms: true, inApp: true, adminSlack: false },
    templateSubject: "Action Required: Final Balance Payment Due for {{journey_title}}",
    templateSnippet:
      "Dear {{traveler_name}}, your departure is approaching on {{departure_date}}. Please complete your remaining balance of {{balance_due}} to finalize luxury lodging and private transfers.",
    isActive: true,
    lastTriggered: "Yesterday at 09:00",
  },
  {
    id: "trig-4",
    name: "Bespoke Concierge Proposal Ready",
    eventKey: "concierge.proposal.sent",
    description: "Triggered when a travel designer generates and publishes a custom proposal link.",
    channels: { email: true, sms: true, inApp: false, adminSlack: false },
    templateSubject: "Your Bespoke Curation Dossier is Ready: {{destination}}",
    templateSnippet:
      "Your private travel designer {{designer_name}} has tailored a comprehensive day-by-day itinerary proposal. Click here to review your private experience.",
    isActive: true,
    lastTriggered: "3 hours ago",
  },
  {
    id: "trig-5",
    name: "Itinerary & Flight Schedule Update",
    eventKey: "itinerary.modified",
    description: "Fires if flights, luxury villas, or private helicopter timings are updated.",
    channels: { email: true, sms: true, inApp: true, adminSlack: false },
    templateSubject: "Important Itinerary Update for {{journey_title}}",
    templateSnippet:
      "An adjustment has been made to your day-to-day schedule. Please review your updated travel portal schedule.",
    isActive: false,
    lastTriggered: "5 days ago",
  },
]

export default function NotificationsPage() {
  const [triggers, setTriggers] = useState<NotificationTrigger[]>(mockTriggers)
  const [selectedPreview, setSelectedPreview] = useState<NotificationTrigger | null>(null)
  const [sentToast, setSentToast] = useState<string | null>(null)

  const handleToggleActive = (id: string) => {
    setTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    )
  }

  const handleToggleChannel = (id: string, channel: keyof NotificationTrigger["channels"]) => {
    setTriggers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, channels: { ...t.channels, [channel]: !t.channels[channel] } }
          : t
      )
    )
  }

  const handleTestDispatch = (trigger: NotificationTrigger) => {
    setSentToast(`Test event '${trigger.eventKey}' simulated successfully!`)
    setTimeout(() => setSentToast(null), 3500)
  }

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Bell className="h-7 w-7 text-primary" />
            Automated Notification Triggers & Delivery
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure lifecycle event triggers, email reminders, SMS alerts, and concierge notifications.
          </p>
        </div>

        {sentToast && (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            {sentToast}
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Active Workflows</span>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {triggers.filter((t) => t.isActive).length} / {triggers.length} Active
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Email Deliverability</span>
            <div className="mt-1 text-2xl font-bold text-foreground">99.8% (Resend)</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">SMS Provider</span>
            <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">Twilio VIP</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Admin Webhooks</span>
            <div className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">Connected</div>
          </CardContent>
        </Card>
      </div>

      {/* Triggers List */}
      <div className="space-y-4">
        {triggers.map((trig) => (
          <Card
            key={trig.id}
            className={cn(
              "border-border/60 bg-card/60 backdrop-blur-xl transition-all",
              !trig.isActive && "opacity-60"
            )}
          >
            <CardContent className="p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-foreground">{trig.name}</h3>
                    <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                      {trig.eventKey}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">{trig.description}</p>
                  <div className="text-[11px] text-muted-foreground">
                    Last dispatched: <strong className="text-foreground">{trig.lastTriggered}</strong>
                  </div>
                </div>

                {/* Channel Selector */}
                <div className="flex flex-wrap items-center gap-4 bg-muted/40 p-3 rounded-lg border border-border/50 text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trig.channels.email}
                      onChange={() => handleToggleChannel(trig.id, "email")}
                      className="rounded text-primary"
                    />
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Email</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trig.channels.sms}
                      onChange={() => handleToggleChannel(trig.id, "sms")}
                      className="rounded text-primary"
                    />
                    <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>SMS</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trig.channels.inApp}
                      onChange={() => handleToggleChannel(trig.id, "inApp")}
                      className="rounded text-primary"
                    />
                    <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>In-App</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={trig.channels.adminSlack}
                      onChange={() => handleToggleChannel(trig.id, "adminSlack")}
                      className="rounded text-primary"
                    />
                    <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Slack</span>
                  </label>
                </div>

                {/* Actions & Switch */}
                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPreview(trig)}
                    className="h-8 text-xs gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTestDispatch(trig)}
                    className="h-8 text-xs gap-1.5 text-primary hover:bg-primary/10"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Test Trigger
                  </Button>

                  <div className="border-l border-border/60 pl-3">
                    <Switch
                      checked={trig.isActive}
                      onCheckedChange={() => handleToggleActive(trig.id)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={!!selectedPreview} onOpenChange={(open) => !open && setSelectedPreview(null)}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Notification Template Preview</DialogTitle>
            <DialogDescription className="text-xs">
              Live variable mapping for {selectedPreview?.eventKey}
            </DialogDescription>
          </DialogHeader>

          {selectedPreview && (
            <div className="space-y-4 pt-2 text-xs">
              <div>
                <span className="font-semibold text-foreground">Email Subject Line:</span>
                <div className="mt-1 rounded-md bg-muted/50 p-2.5 font-medium text-foreground border border-border">
                  {selectedPreview.templateSubject}
                </div>
              </div>

              <div>
                <span className="font-semibold text-foreground">Message Body:</span>
                <div className="mt-1 rounded-md bg-muted/30 p-3 leading-relaxed text-muted-foreground border border-border">
                  {selectedPreview.templateSnippet}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
