import { useState } from "react"
import {
  Send,
  Search,
  FilterX,
  Download,
  MailCheck,
  TrendingUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface Subscriber {
  id: string
  email: string
  source: "FOOTER_FORM" | "HOMEPAGE_HERO" | "CHECKOUT_OPT_IN" | "CONCIERGE_LEAD"
  status: "SUBSCRIBED" | "UNSUBSCRIBED" | "BOUNCED"
  tags: string[]
  openRate: number
  joinedAt: string
}

const mockSubscribers: Subscriber[] = [
  {
    id: "sub-1",
    email: "e.vance@belgravia.co.uk",
    source: "CONCIERGE_LEAD",
    status: "SUBSCRIBED",
    tags: ["VIP Private Client", "Asia Enthusiast"],
    openRate: 85,
    joinedAt: "2026-06-12",
  },
  {
    id: "sub-2",
    email: "claire.fontaine@geneve-wealth.ch",
    source: "HOMEPAGE_HERO",
    status: "SUBSCRIBED",
    tags: ["Alpine Luxury", "Helicopter Expeditions"],
    openRate: 72,
    joinedAt: "2026-07-01",
  },
  {
    id: "sub-3",
    email: "m.rossi@milanodesign.it",
    source: "FOOTER_FORM",
    status: "SUBSCRIBED",
    tags: ["Mediterranean", "Yachting"],
    openRate: 64,
    joinedAt: "2026-07-15",
  },
  {
    id: "sub-4",
    email: "james.thorne@londonre.com",
    source: "CHECKOUT_OPT_IN",
    status: "SUBSCRIBED",
    tags: ["Confirmed Traveler"],
    openRate: 91,
    joinedAt: "2026-08-03",
  },
  {
    id: "sub-5",
    email: "sarah.jenkins@californiatech.io",
    source: "FOOTER_FORM",
    status: "UNSUBSCRIBED",
    tags: ["General Digest"],
    openRate: 20,
    joinedAt: "2026-03-10",
  },
  {
    id: "sub-6",
    email: "bounce.test@invalid-domain-corp.co",
    source: "HOMEPAGE_HERO",
    status: "BOUNCED",
    tags: ["Unreachable"],
    openRate: 0,
    joinedAt: "2026-08-20",
  },
]

const statusStyles: Record<string, string> = {
  SUBSCRIBED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  UNSUBSCRIBED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  BOUNCED: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
}

export default function NewsletterPage() {
  const [subscribers] = useState<Subscriber[]>(mockSubscribers)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [sourceFilter, setSourceFilter] = useState("ALL")

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Email,Source,Status,Tags,OpenRate,JoinedAt"]
        .concat(
          filtered.map(
            (s) =>
              `"${s.email}","${s.source}","${s.status}","${s.tags.join(";")}","${s.openRate}%","${s.joinedAt}"`
          )
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `mira_newsletter_subscribers_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filtered = subscribers.filter((s) => {
    if (search) {
      const q = search.toLowerCase()
      const match =
        s.email.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      if (!match) return false
    }
    if (statusFilter !== "ALL" && s.status !== statusFilter) return false
    if (sourceFilter !== "ALL" && s.source !== sourceFilter) return false
    return true
  })

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Send className="h-7 w-7 text-primary" />
            Newsletter & Editorial Subscribers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Audience mailing lists, editorial dispatch subscriptions, and automated campaign reach.
          </p>
        </div>

        <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Export CSV Roster</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Active Subscribers</span>
              <MailCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {subscribers.filter((s) => s.status === "SUBSCRIBED").length.toLocaleString()} Active
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Monthly Growth</span>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">+14.2%</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Average Open Rate</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">62.8%</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Deliverability Health</span>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">99.4%</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by subscriber email or audience tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] bg-background/50">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="SUBSCRIBED">Subscribed</SelectItem>
              <SelectItem value="UNSUBSCRIBED">Unsubscribed</SelectItem>
              <SelectItem value="BOUNCED">Bounced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[170px] bg-background/50">
              <SelectValue placeholder="Source: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Sources</SelectItem>
              <SelectItem value="FOOTER_FORM">Footer Form</SelectItem>
              <SelectItem value="HOMEPAGE_HERO">Homepage Hero</SelectItem>
              <SelectItem value="CHECKOUT_OPT_IN">Checkout Opt-in</SelectItem>
              <SelectItem value="CONCIERGE_LEAD">Concierge Lead</SelectItem>
            </SelectContent>
          </Select>

          {(search || statusFilter !== "ALL" || sourceFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearch("")
                setStatusFilter("ALL")
                setSourceFilter("ALL")
              }}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">Subscriber Email</th>
                <th className="px-5 py-3.5">Source Channel</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Audience Segment Tags</th>
                <th className="px-5 py-3.5">Open Rate</th>
                <th className="px-5 py-3.5 text-right">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {filtered.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-medium text-xs text-foreground">
                    {s.email}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    {s.source.replace(/_/g, " ")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase",
                        statusStyles[s.status]
                      )}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {s.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-xs text-foreground">{s.openRate}%</span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-muted-foreground">
                    {s.joinedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
