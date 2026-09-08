import { useState } from "react"
import {
  Star,
  Search,
  FilterX,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Award,
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

export interface ReviewItem {
  id: string
  travelerName: string
  travelerEmail: string
  journeyTitle: string
  rating: number
  title: string
  comment: string
  isVerified: boolean
  isFeatured: boolean
  status: "PUBLISHED" | "PENDING_MODERATION" | "REJECTED"
  createdAt: string
  helpfulVotes: number
}

const mockReviews: ReviewItem[] = [
  {
    id: "rev-1",
    travelerName: "Lady Eleanor Vance",
    travelerEmail: "e.vance@belgravia.co.uk",
    journeyTitle: "Kyoto Autumn Sanctuary & Zen Monasteries",
    rating: 5,
    title: "An unforgettably transcendent retreat",
    comment:
      "The private access to Daitoku-ji temple before dawn was the highlight of our decade. The concierge seamlessly handled our dietary preferences and our Ryokan master was exquisite. Truly a five-star masterpiece.",
    isVerified: true,
    isFeatured: true,
    status: "PUBLISHED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    helpfulVotes: 24,
  },
  {
    id: "rev-2",
    travelerName: "Jean-Pierre Dubois",
    travelerEmail: "jp.dubois@luxuryliving.fr",
    journeyTitle: "Dolomites Sky Chalets & Alpine Helicopter Expedition",
    rating: 5,
    title: "Helicopter transfers were breathtaking",
    comment:
      "Every detail was curated to perfection. Landing on the Marmolada glacier for a private champagne tasting is something my family will cherish forever. Will definitely book again.",
    isVerified: true,
    isFeatured: true,
    status: "PUBLISHED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    helpfulVotes: 18,
  },
  {
    id: "rev-3",
    travelerName: "David Sterling",
    travelerEmail: "david.sterling@investcorp.com",
    journeyTitle: "Serengeti Migration & Singita Wilderness",
    rating: 4,
    title: "Safari guide was world-class, flight delayed slightly",
    comment:
      "The camp accommodations and wildlife sightings were extraordinary. We witnessed the river crossing on day two. Only minor hiccup was the light aircraft weather delay, but the ground team handled it gracefully.",
    isVerified: true,
    isFeatured: false,
    status: "PUBLISHED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    helpfulVotes: 7,
  },
  {
    id: "rev-4",
    travelerName: "Chloe Davenport",
    travelerEmail: "chloe.d@manhattandesign.com",
    journeyTitle: "Amalfi Coast Private Yacht & Cliffside Villas",
    rating: 5,
    title: "Pure Italian magic!",
    comment:
      "Our captain Marco took us to secluded sea caves far away from the tourist boats. The private dinner on the cliff in Positano exceeded all our wildest expectations.",
    isVerified: true,
    isFeatured: false,
    status: "PENDING_MODERATION",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    helpfulVotes: 0,
  },
  {
    id: "rev-5",
    travelerName: "Anonymous Guest",
    travelerEmail: "spammer99@promo-deals.xyz",
    journeyTitle: "Bespoke Journey",
    rating: 1,
    title: "Click here for discount luxury watches",
    comment: "Check out our fake website url for cheap replica watches.",
    isVerified: false,
    isFeatured: false,
    status: "REJECTED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    helpfulVotes: 0,
  },
]

const statusStyles: Record<string, string> = {
  PUBLISHED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  PENDING_MODERATION: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  REJECTED: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(mockReviews)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [ratingFilter, setRatingFilter] = useState("ALL")

  const handleStatusChange = (id: string, newStatus: ReviewItem["status"]) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
  }

  const handleToggleFeatured = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
    )
  }

  const filtered = reviews.filter((r) => {
    if (search) {
      const q = search.toLowerCase()
      const match =
        r.travelerName.toLowerCase().includes(q) ||
        r.travelerEmail.toLowerCase().includes(q) ||
        r.journeyTitle.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      if (!match) return false
    }
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false
    if (ratingFilter !== "ALL" && r.rating !== parseInt(ratingFilter, 10)) return false
    return true
  })

  return (
    <div className="w-full space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Star className="h-7 w-7 fill-amber-400 text-amber-500" />
            Traveler Reviews & Testimonials
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage guest feedback, ratings, journey testimonials, and homepage showcase approvals.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Average Rating</span>
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground">4.92</span>
              <span className="text-xs text-muted-foreground">/ 5.0 (98% 5-star)</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Total Reviews</span>
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">{reviews.length} Verified</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Pending Moderation</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {reviews.filter((r) => r.status === "PENDING_MODERATION").length} Needs Review
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Featured On Site</span>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
              {reviews.filter((r) => r.isFeatured).length} Showcased
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews by guest, journey, or keyword..."
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
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="PENDING_MODERATION">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[140px] bg-background/50">
              <SelectValue placeholder="Stars: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          {(search || statusFilter !== "ALL" || ratingFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearch("")
                setStatusFilter("ALL")
                setRatingFilter("ALL")
              }}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Reviews List Cards */}
      <div className="space-y-4">
        {filtered.map((rev) => (
          <Card key={rev.id} className="border-border/60 bg-card/60 backdrop-blur-xl transition-all hover:border-border">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-sm text-foreground">{rev.title}</span>
                    <span
                      className={cn(
                        "inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase",
                        statusStyles[rev.status]
                      )}
                    >
                      {rev.status.replace("_", " ")}
                    </span>
                    {rev.isFeatured && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                        <Award className="h-3 w-3" /> Featured
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{rev.comment}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-foreground">{rev.travelerName}</span>
                      {rev.isVerified && (
                        <span className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="mr-0.5 h-3 w-3" /> Verified Traveler
                        </span>
                      )}
                    </div>
                    <span>•</span>
                    <span>Journey: <strong className="text-foreground font-medium">{rev.journeyTitle}</strong></span>
                    <span>•</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {rev.helpfulVotes} found helpful</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  {rev.status === "PENDING_MODERATION" && (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                        onClick={() => handleStatusChange(rev.id, "PUBLISHED")}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-rose-500 hover:bg-rose-500/10"
                        onClick={() => handleStatusChange(rev.id, "REJECTED")}
                      >
                        <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  )}

                  {rev.status === "PUBLISHED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className={cn(
                        "h-8 text-xs gap-1",
                        rev.isFeatured ? "border-purple-500/40 text-purple-600 bg-purple-500/5" : ""
                      )}
                      onClick={() => handleToggleFeatured(rev.id)}
                    >
                      <Sparkles className="h-3 w-3" />
                      {rev.isFeatured ? "Unfeature" : "Feature on Homepage"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
