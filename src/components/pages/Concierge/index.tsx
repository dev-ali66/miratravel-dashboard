import { useState, useEffect, useCallback } from "react"
import {
  Inbox,
  Search,
  FilterX,
  Eye,
  Trash2,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  User,
  MapPin,
  Users,
  Compass,
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

export interface InquiryItem {
  id: string
  inquiryNumber: string
  fullName: string
  email: string
  phone?: string
  destination?: string
  travelDate?: string
  travelers?: string
  journeyTypes: string[]
  message?: string
  status: "NEW" | "IN_REVIEW" | "CONTACTED" | "CLOSED"
  adminNotes?: string
  createdAt: string
}

const statusStyles: Record<string, string> = {
  NEW: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  IN_REVIEW: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  CONTACTED: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  CLOSED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
}

const API_BASE = "http://localhost:5010/api/v1/inquiry"

export default function InquiryPage() {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchInquiries = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (statusFilter !== "ALL") params.append("status", statusFilter)

      const res = await fetch(`${API_BASE}?${params.toString()}`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setInquiries(json.data)
      } else {
        setInquiries([])
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err)
      setInquiries([])
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchInquiries()
  }, [fetchInquiries])

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch(`${API_BASE}/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const json = await res.json()
      if (json.success) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus as any } : item))
        )
        if (selectedInquiry?.id === inquiryId) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null))
        }
      }
    } catch (err) {
      console.error("Failed to update inquiry status:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async (inquiryId: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return
    try {
      const res = await fetch(`${API_BASE}/${inquiryId}`, {
        method: "DELETE",
      })
      const json = await res.json()
      if (json.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== inquiryId))
        if (selectedInquiry?.id === inquiryId) setSelectedInquiry(null)
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err)
    }
  }

  const newCount = inquiries.filter((i) => i.status === "NEW").length
  const inReviewCount = inquiries.filter((i) => i.status === "IN_REVIEW").length
  const contactedCount = inquiries.filter((i) => i.status === "CONTACTED").length
  const closedCount = inquiries.filter((i) => i.status === "CLOSED").length

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Inbox className="h-7 w-7 text-primary" />
            Travel Inquiries & Customer Submissions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Travel requests submitted by visitors via the "Plan your escape" inquiry form.
          </p>
        </div>

        <Button onClick={fetchInquiries} variant="outline" className="flex items-center gap-2">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          <span>Refresh List</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">New Inquiries</span>
            <div className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{newCount} Pending</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">In Review</span>
            <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">{inReviewCount} Active</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Contacted</span>
            <div className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">{contactedCount} Travelers</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Closed</span>
            <div className="mt-1 text-2xl font-bold text-zinc-500">{closedCount} Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by full name, email, destination, or inquiry ref..."
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
              <SelectItem value="IN_REVIEW">In Review</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
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
                <th className="px-5 py-3.5">Ref #</th>
                <th className="px-5 py-3.5">Traveler Name & Email</th>
                <th className="px-5 py-3.5">Destination & Travel Date</th>
                <th className="px-5 py-3.5">Travelers & Types</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Submitted At</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    Loading travel inquiries...
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No travel inquiries found. Submissions from "Plan your escape" will appear here.
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold">
                      {inquiry.inquiryNumber || `INQ-${inquiry.id.slice(-6)}`}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs">{inquiry.fullName}</span>
                        <span className="text-[11px] text-muted-foreground">{inquiry.email}</span>
                        {inquiry.phone && <span className="text-[10px] text-muted-foreground/80">{inquiry.phone}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold text-foreground">{inquiry.destination || "Not specified"}</span>
                        <span className="text-muted-foreground text-[11px]">{inquiry.travelDate || "Date TBD"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col text-xs gap-1">
                        <span className="font-medium text-foreground">{inquiry.travelers ? `${inquiry.travelers} Guests` : "Guests TBD"}</span>
                        {inquiry.journeyTypes && inquiry.journeyTypes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {inquiry.journeyTypes.map((type, idx) => (
                              <span key={idx} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                {type}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Select
                        value={inquiry.status}
                        onValueChange={(val) => handleStatusChange(inquiry.id, val)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className={cn("h-7 w-[120px] text-xs font-semibold uppercase border px-2 py-0.5", statusStyles[inquiry.status])}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="IN_REVIEW">In Review</SelectItem>
                          <SelectItem value="CONTACTED">Contacted</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="h-7 text-xs"
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(inquiry.id)}
                          className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5 text-primary" />
              Inquiry Details: {selectedInquiry?.inquiryNumber || selectedInquiry?.id}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Full submission details from "Plan your escape" travel inquiry form.
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="mt-3 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-muted/30 p-3.5">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block font-semibold text-foreground">Traveler Name</span>
                    <span>{selectedInquiry.fullName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block font-semibold text-foreground">Email Address</span>
                    <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block font-semibold text-foreground">Phone Number</span>
                    <span>{selectedInquiry.phone || "Not provided"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block font-semibold text-foreground">Destination</span>
                    <span>{selectedInquiry.destination || "Not specified"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block font-semibold text-foreground">Approximate Travel Date</span>
                    <span>{selectedInquiry.travelDate || "Flexible"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="block font-semibold text-foreground">Number of Travelers</span>
                    <span>{selectedInquiry.travelers || "Not specified"}</span>
                  </div>
                </div>
              </div>

              {selectedInquiry.journeyTypes && selectedInquiry.journeyTypes.length > 0 && (
                <div>
                  <span className="flex items-center gap-1.5 font-semibold text-foreground mb-1.5">
                    <Compass className="h-4 w-4 text-primary" />
                    Journey Types Selected:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInquiry.journeyTypes.map((t, i) => (
                      <span key={i} className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="font-semibold text-foreground">Vision / Detailed Description:</span>
                <p className="mt-1 rounded-lg bg-background p-3 border border-border text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message || "No detailed message provided."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">
                  Submitted: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">Status:</span>
                  <Select
                    value={selectedInquiry.status}
                    onValueChange={(val) => handleStatusChange(selectedInquiry.id, val)}
                  >
                    <SelectTrigger className="h-8 w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="IN_REVIEW">In Review</SelectItem>
                      <SelectItem value="CONTACTED">Contacted</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
