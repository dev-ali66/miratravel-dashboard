import { useState } from "react"
import {
  Tag,
  Plus,
  Copy,
  Check,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Pagination } from "@/components/shared/Pagination"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import {
  FilterToolbar,
  FilterGroup,
  FilterSearch,
  FilterSelect,
  FilterActions,
  FilterCreateButton,
  FilterResetButton,
} from "@/components/shared/FilterToolbar"
import { cn } from "@/lib/utils"

export interface PromotionVoucher {
  id: string
  code: string
  description: string
  type: "PERCENTAGE" | "FIXED_AMOUNT"
  discountValue: number
  minBookingValue: number
  maxDiscount?: number
  usageCount: number
  usageLimit: number
  validFrom: string
  validTo: string
  isActive: boolean
  applicableTo: string
}

const mockPromotions: PromotionVoucher[] = [
  {
    id: "promo-1",
    code: "AUTUMN2026",
    description: "Autumn Equinox Early Booking Privileges",
    type: "PERCENTAGE",
    discountValue: 10,
    minBookingValue: 8000,
    maxDiscount: 1500,
    usageCount: 28,
    usageLimit: 50,
    validFrom: "2026-08-01",
    validTo: "2026-10-31",
    isActive: true,
    applicableTo: "All Journeys",
  },
  {
    id: "promo-2",
    code: "PRESTIGE-VIP",
    description: "Private Client Bespoke Journey Voucher",
    type: "FIXED_AMOUNT",
    discountValue: 2000,
    minBookingValue: 20000,
    usageCount: 7,
    usageLimit: 15,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    isActive: true,
    applicableTo: "Custom Concierge Journeys",
  },
  {
    id: "promo-3",
    code: "HONEYMOON500",
    description: "Romantic Getaways & Honeymoon Suite Privilege",
    type: "FIXED_AMOUNT",
    discountValue: 500,
    minBookingValue: 6000,
    usageCount: 42,
    usageLimit: 100,
    validFrom: "2026-05-01",
    validTo: "2026-09-30",
    isActive: true,
    applicableTo: "Amalfi & Kyoto Journeys",
  },
  {
    id: "promo-4",
    code: "WELCOME-FIRST",
    description: "First-Time Verified Traveler Courtesy",
    type: "PERCENTAGE",
    discountValue: 5,
    minBookingValue: 4000,
    maxDiscount: 500,
    usageCount: 154,
    usageLimit: 500,
    validFrom: "2026-01-01",
    validTo: "2026-12-31",
    isActive: true,
    applicableTo: "All Journeys",
  },
  {
    id: "promo-5",
    code: "WINTER-EXPIRED",
    description: "2025 Winter Alpine Escapes",
    type: "PERCENTAGE",
    discountValue: 15,
    minBookingValue: 10000,
    maxDiscount: 2000,
    usageCount: 40,
    usageLimit: 40,
    validFrom: "2025-11-01",
    validTo: "2026-02-28",
    isActive: false,
    applicableTo: "Dolomites & Swiss Alps",
  },
]

export default function PromotionsPage() {
  const [promos, setPromos] = useState<PromotionVoucher[]>(mockPromotions)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // New promo form state
  const [newCode, setNewCode] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newType, setNewType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE")
  const [newValue, setNewValue] = useState("10")
  const [newMin, setNewMin] = useState("5000")
  const [newLimit, setNewLimit] = useState("50")

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleToggleActive = (id: string) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    )
  }

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode) return

    const newPromo: PromotionVoucher = {
      id: `promo-${Date.now()}`,
      code: newCode.toUpperCase(),
      description: newDesc || "Exclusive Campaign Promotion",
      type: newType,
      discountValue: parseFloat(newValue) || 10,
      minBookingValue: parseFloat(newMin) || 0,
      usageCount: 0,
      usageLimit: parseInt(newLimit, 10) || 100,
      validFrom: new Date().toISOString().split("T")[0],
      validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString().split("T")[0],
      isActive: true,
      applicableTo: "All Journeys",
    }

    setPromos([newPromo, ...promos])
    setIsCreateOpen(false)
    setNewCode("")
    setNewDesc("")
  }

  const filtered = promos.filter((p) => {
    if (search) {
      const q = search.toLowerCase()
      const match =
        p.code.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.applicableTo.toLowerCase().includes(q)
      if (!match) return false
    }
    if (statusFilter === "ACTIVE" && !p.isActive) return false
    if (statusFilter === "INACTIVE" && p.isActive) return false
    return true
  })

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={Tag}
        title="Promotions"
        subtitle="Manage promotional discount codes and vouchers."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Campaigns"
              value={`${promos.filter((p) => p.isActive).length} Active`}
              subtext="Live codes"
              icon={Tag}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Redemptions"
              value={`${promos.reduce((acc, p) => acc + p.usageCount, 0)}`}
              subtext="Bookings redeemed"
              icon={Check}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="Discounted"
              value="$64,500"
              subtext="Total savings"
              icon={Tag}
              iconColor="text-purple-500"
            />
            <CompactStatCard
              label="Cart Boost"
              value="+28.4%"
              subtext="Avg cart uplift"
              icon={Tag}
              iconColor="text-amber-500"
            />
          </div>
        }
      />

      {/* Toolbar */}
      <FilterToolbar>
        <FilterGroup>
          {/* Search expands to take all remaining space on left */}
          <FilterSearch
            value={search}
            onChange={(val) => {
              setSearch(val)
              setCurrentPage(1)
            }}
            placeholder="Search vouchers, campaigns..."
            width="w-full flex-1 min-w-[200px]"
          />
        </FilterGroup>

        <FilterActions>
          <FilterSelect
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val)
              setCurrentPage(1)
            }}
            options={[
              { label: "Active Only", value: "ACTIVE" },
              { label: "Inactive / Expired", value: "INACTIVE" },
            ]}
            allLabel="All Campaigns"
            allValue="ALL"
            placeholder="Status: All"
            width="min-w-[125px] max-w-[155px]"
          />

          <FilterCreateButton
            onClick={() => setIsCreateOpen(true)}
            label="Create Voucher"
            icon={Plus}
          />

          {/* Universal Far-Right Refresh Button */}
          <FilterResetButton
            onClick={() => {
              setSearch("")
              setStatusFilter("ALL")
              setCurrentPage(1)
            }}
            title="Refresh & Reset"
          />
        </FilterActions>
      </FilterToolbar>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-border/60 bg-card/60 shadow-xs backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Voucher Code</th>
                <th className="px-5 py-3.5 font-semibold">Campaign & Scope</th>
                <th className="px-5 py-3.5 font-semibold">Discount Rate</th>
                <th className="px-5 py-3.5 font-semibold">Min. Spend</th>
                <th className="px-5 py-3.5 font-semibold">Redemptions</th>
                <th className="px-5 py-3.5 font-semibold">Validity Period</th>
                <th className="px-5 py-3.5 text-center font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tag className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-foreground">No promotions found</p>
                      <p className="text-xs text-muted-foreground">Try adjusting search filters or create a new promotional campaign.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered
                  .slice(0, currentPage * pageSize)
                  .map((p) => {
                  const percentUsed = Math.min(100, Math.round((p.usageCount / p.usageLimit) * 100))
                  return (
                    <tr key={p.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold tracking-wider rounded bg-primary/10 px-2 py-1 text-primary">
                            {p.code}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => handleCopy(p.code)}
                          >
                            {copiedCode === p.code ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground">{p.description}</span>
                          <span className="text-[11px] text-muted-foreground">{p.applicableTo}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-xs text-foreground">
                          {p.type === "PERCENTAGE" ? `${p.discountValue}% OFF` : `$${p.discountValue.toLocaleString()} OFF`}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        ${p.minBookingValue.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-semibold text-foreground">
                            {p.usageCount} / {p.usageLimit} ({percentUsed}%)
                          </span>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                percentUsed > 80 ? "bg-amber-500" : "bg-primary"
                              )}
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {p.validFrom} to {p.validTo}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={cn(
                            "inline-block rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase",
                            p.isActive
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-zinc-500/20 bg-zinc-500/10 text-zinc-500"
                          )}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Switch
                          checked={p.isActive}
                          onCheckedChange={() => handleToggleActive(p.id)}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Universal Pagination */}
        {filtered.length > 0 && (
          <Pagination
            mode="infinite"
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(filtered.length / pageSize))}
            totalItems={filtered.length}
            pageSize={pageSize}
            pageSizeOptions={[10, 20, 50, 100]}
            loadedCount={Math.min(filtered.length, currentPage * pageSize)}
            hasMore={currentPage * pageSize < filtered.length}
            onLoadMore={() => setCurrentPage((p) => p + 1)}
            onPageChange={setCurrentPage}
            onPageSizeChange={(sz) => {
              setPageSize(sz)
              setCurrentPage(1)
            }}
            fixed={false}
            isTable
          />
        )}
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create Promotional Voucher</DialogTitle>
            <DialogDescription className="text-xs">
              Configure discount rules and redemption ceilings for high-value bookings.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePromo} className="space-y-4 pt-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Voucher Code</label>
              <Input
                placeholder="e.g. SUMMER2026"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                className="mt-1 uppercase font-mono"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-foreground">Campaign Description</label>
              <Input
                placeholder="e.g. Private Luxury Villa Summer Special"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Discount Type</label>
                <Select value={newType} onValueChange={(v: any) => setNewType(v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Fixed USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-semibold text-foreground">Discount Value</label>
                <Input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-foreground">Min. Booking Value ($)</label>
                <Input
                  type="number"
                  value={newMin}
                  onChange={(e) => setNewMin(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground">Usage Cap</label>
                <Input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Voucher
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
