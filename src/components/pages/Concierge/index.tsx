import { useState } from "react"
import {
  Sparkles,
  Search,
  FilterX,
  Send,
  Eye,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export interface ConciergeLead {
  id: string
  leadNumber: string
  travelerName: string
  travelerEmail: string
  travelerPhone: string
  destination: string
  preferredDates: string
  duration: string
  partySize: number
  budgetRange: string
  travelStyle: "LUXURY_RETREAT" | "CULTURAL_IMMERSION" | "ADVENTURE_EXPEDITION" | "ROMANTIC_GETAWAY"
  status: "NEW" | "IN_DISCUSSION" | "PROPOSAL_SENT" | "CONVERTED" | "CLOSED"
  assignedDesigner: string
  specialNotes: string
  createdAt: string
}

const mockLeads: ConciergeLead[] = [
  {
    id: "lead-01",
    leadNumber: "CONC-2026-0081",
    travelerName: "Sophia Montgomery",
    travelerEmail: "sophia.montgomery@prestige.co.uk",
    travelerPhone: "+44 7911 123456",
    destination: "Kyoto & Mount Fuji, Japan",
    preferredDates: "Oct 12 - Oct 26, 2026",
    duration: "14 Nights",
    partySize: 2,
    budgetRange: "$15,000 - $25,000",
    travelStyle: "LUXURY_RETREAT",
    status: "IN_DISCUSSION",
    assignedDesigner: "Liam Vance",
    specialNotes: "Prefers private tea master sessions, traditional luxury Ryokan with private Onsen, and Shinkansen Gran Class transfers.",
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: "lead-02",
    leadNumber: "CONC-2026-0082",
    travelerName: "Alexandre Laurent",
    travelerEmail: "a.laurent@parisfinance.fr",
    travelerPhone: "+33 6 12 34 56 78",
    destination: "Dolomites & Lake Como, Italy",
    preferredDates: "Jul 05 - Jul 18, 2026",
    duration: "13 Nights",
    partySize: 4,
    budgetRange: "$20,000 - $35,000",
    travelStyle: "CULTURAL_IMMERSION",
    status: "PROPOSAL_SENT",
    assignedDesigner: "Elena Rossi",
    specialNotes: "Family trip with 2 teens. Needs private Riva boat charter on Lake Como and helicopter transfers across the Dolomites.",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "lead-03",
    leadNumber: "CONC-2026-0083",
    travelerName: "Marcus Sterling",
    travelerEmail: "m.sterling@capitalgroup.com",
    travelerPhone: "+1 (415) 888-9210",
    destination: "Serengeti & Zanzibar, Tanzania",
    preferredDates: "Nov 01 - Nov 14, 2026",
    duration: "13 Nights",
    partySize: 2,
    budgetRange: "$30,000+",
    travelStyle: "ADVENTURE_EXPEDITION",
    status: "NEW",
    assignedDesigner: "Unassigned",
    specialNotes: "Honeymoon safari with luxury tented camps (Singita) and private balloon safaris.",
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
]

const statusStyles: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  IN_DISCUSSION: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  PROPOSAL_SENT: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  CONVERTED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  CLOSED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
}

export default function ConciergePage() {
  const [leads] = useState<ConciergeLead[]>(mockLeads)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedLead, setSelectedLead] = useState<ConciergeLead | null>(null)

  const filtered = leads.filter((l) => {
    if (search) {
      const q = search.toLowerCase()
      const match =
        l.travelerName.toLowerCase().includes(q) ||
        l.travelerEmail.toLowerCase().includes(q) ||
        l.destination.toLowerCase().includes(q) ||
        l.leadNumber.toLowerCase().includes(q)
      if (!match) return false
    }
    if (statusFilter !== "ALL" && l.status !== statusFilter) return false
    return true
  })

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Sparkles className="h-7 w-7 text-amber-500" />
            Concierge Inquiries & Bespoke Curation
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bespoke custom itinerary requests submitted by travelers via the "Curate Your Experience" portal.
          </p>
        </div>

        <Button className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          <span>Create Custom Proposal</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">New Requests</span>
            <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">1 Pending</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">In Discussion</span>
            <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">1 Traveler</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Proposals Sent</span>
            <div className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">1 Draft</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Avg. Budget Range</span>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">$22,500</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by traveler name, email, or destination..."
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
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="IN_DISCUSSION">In Discussion</SelectItem>
              <SelectItem value="PROPOSAL_SENT">Proposal Sent</SelectItem>
              <SelectItem value="CONVERTED">Converted</SelectItem>
            </SelectContent>
          </Select>

          {(search || statusFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearch("")
                setStatusFilter("ALL")
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
                <th className="px-5 py-3.5">Inquiry #</th>
                <th className="px-5 py-3.5">Traveler</th>
                <th className="px-5 py-3.5">Destination & Dates</th>
                <th className="px-5 py-3.5">Budget</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Designer</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {filtered.map((lead) => (
                <tr key={lead.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold">{lead.leadNumber}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-xs">{lead.travelerName}</span>
                      <span className="text-[11px] text-muted-foreground">{lead.travelerEmail}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-foreground">{lead.destination}</span>
                      <span className="text-muted-foreground text-[11px]">{lead.preferredDates} ({lead.duration})</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-bold text-foreground">{lead.budgetRange}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-block rounded-md border px-2 py-0.5 text-xs font-semibold uppercase", statusStyles[lead.status])}>
                      {lead.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{lead.assignedDesigner}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLead(lead)}
                      className="h-7 text-xs"
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Concierge Custom Request Details</DialogTitle>
            <DialogDescription className="text-xs">
              Traveler preferences and curated trip requirements.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="mt-3 space-y-3 text-xs">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-1.5">
                <div><span className="font-semibold text-foreground">Traveler:</span> {selectedLead.travelerName} ({selectedLead.travelerEmail})</div>
                <div><span className="font-semibold text-foreground">Phone:</span> {selectedLead.travelerPhone}</div>
                <div><span className="font-semibold text-foreground">Destination:</span> {selectedLead.destination}</div>
                <div><span className="font-semibold text-foreground">Party Size:</span> {selectedLead.partySize} Guests ({selectedLead.travelStyle.replace("_", " ")})</div>
                <div><span className="font-semibold text-foreground">Budget:</span> {selectedLead.budgetRange}</div>
                <div><span className="font-semibold text-foreground">Trip Designer:</span> {selectedLead.assignedDesigner}</div>
              </div>

              <div>
                <span className="font-semibold text-foreground">Special Traveler Requests & Notes:</span>
                <p className="mt-1 rounded-md bg-background p-2.5 border border-border text-muted-foreground">
                  {selectedLead.specialNotes}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
