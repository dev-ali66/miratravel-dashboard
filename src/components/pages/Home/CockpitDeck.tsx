import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  DollarSign,
  Compass,
  Globe,
  Cpu,
  Wifi,
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Sparkles,
  BookOpen,
  Mail,
  FolderOpen,
  CheckCircle2,
} from "lucide-react"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"
import { cn } from "@/lib/utils"

// Pure SVG Cubic Bezier Spline Generator using Global Theme Variables
function generateSpline(
  points: { x: number; y: number }[],
  height = 95
): { linePath: string; areaPath: string } {
  if (points.length < 2) return { linePath: "", areaPath: "" }

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2 >= points.length ? points.length - 1 : i + 2]

    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }

  const linePath = d
  const lastX = points[points.length - 1].x
  const firstX = points[0].x
  const areaPath = `${d} L ${lastX.toFixed(1)} ${height} L ${firstX.toFixed(1)} ${height} Z`

  return { linePath, areaPath }
}

export default function CockpitDeck() {
  const navigate = useNavigate()
  const { data } = useGetDashboardStatistics()
  const [chartMode, setChartMode] = useState<"revenue" | "bookings">("revenue")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const modules = data?.modules
  const overview = data?.overview
  const recentBookings = data?.recentActivity ?? []

  // 100% Real chart points from backend
  const revenuePoints = data?.charts?.revenueOverview ?? []
  const bookingPoints = data?.charts?.monthlyBookings ?? []
  const activeDataset = chartMode === "revenue" ? revenuePoints : bookingPoints

  const activeMax = useMemo(() => {
    return Math.max(...activeDataset.map((d) => d.total), 1)
  }, [activeDataset])

  const activeTotal = useMemo(() => {
    return activeDataset.reduce((sum, d) => sum + d.total, 0)
  }, [activeDataset])

  // Compact SVG Geometry
  const svgWidth = 460
  const svgHeight = 110
  const padX = 14
  const padTop = 10
  const padBottom = 16

  const splinePoints = useMemo(() => {
    if (activeDataset.length === 0) return []
    return activeDataset.map((item, idx) => {
      const x = padX + (idx / Math.max(activeDataset.length - 1, 1)) * (svgWidth - padX * 2)
      const usableHeight = svgHeight - padTop - padBottom
      const y = padTop + usableHeight - (item.total / activeMax) * usableHeight
      return { x, y, ...item }
    })
  }, [activeDataset, activeMax])

  const { linePath, areaPath } = useMemo(() => {
    return generateSpline(splinePoints, svgHeight - padBottom)
  }, [splinePoints])

  const hoveredItem = hoveredIdx !== null ? splinePoints[hoveredIdx] : null

  // Real location stats from DB
  const totalLocations = modules?.locations?.total ?? overview?.totalLocations ?? 0
  const continents = modules?.locations?.continents ?? 0
  const countries = modules?.locations?.countries ?? 0
  const regions = modules?.locations?.regions ?? 0
  const places = modules?.locations?.places ?? 0
  const landmarks = modules?.locations?.landmarks ?? Math.max(0, totalLocations - (continents + countries + regions + places))

  // Real booking statuses from DB
  const confirmed = data?.bookingStatus?.confirmed ?? 0
  const underReview = data?.bookingStatus?.underReview ?? 0
  const depositDue = data?.bookingStatus?.depositDue ?? 0
  const cancelled = data?.bookingStatus?.cancelled ?? 0
  const totalStatus = Math.max(confirmed + underReview + depositDue + cancelled, 1)

  // Real System & Telemetry metrics
  const dbLatency = modules?.systemHealth?.dbLatencyMs ?? 0
  const memoryHeap = modules?.systemHealth?.memoryMb ?? 0
  const totalAudit = modules?.auditLogs?.totalEvents ?? 0
  const vps = modules?.systemHealth?.vps
  const pm2 = modules?.systemHealth?.pm2
  const vpsCpu = vps?.cpuPercent ?? 4
  const totalRamGb = vps?.totalMemoryGb ?? 0
  const usedRamGb = vps?.usedMemoryGb ?? 0
  const ramPercent = vps?.memoryPercent ?? 0
  const cpuCores = vps?.cpuCores ?? 0
  const isPm2 = pm2?.isPm2 ?? false
  const backendInstances = pm2?.backendInstances ?? 1
  const frontendInstances = pm2?.frontendInstances ?? 1
  const onlineProcesses = pm2?.onlineProcesses ?? 2
  const uptimeSeconds = modules?.systemHealth?.uptimeSeconds ?? 0

  const formattedUptime = useMemo(() => {
    if (!uptimeSeconds) return "Live"
    const h = Math.floor(uptimeSeconds / 3600)
    const m = Math.floor((uptimeSeconds % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }, [uptimeSeconds])

  // Real Remaining Operational Metrics
  const totalRequests = modules?.journeyRequests?.total ?? 0
  const totalInquiries = modules?.inquiries?.total ?? 0
  const totalExperiences = modules?.experiences?.total ?? 0
  const totalStories = modules?.stories?.total ?? overview?.totalStories ?? 0
  const totalSubscribers = modules?.newsletter?.total ?? 0
  const totalMedia = modules?.media?.total ?? 0

  // Real dynamic peak calculation from live dataset
  const peakMonthItem = useMemo(() => {
    if (!activeDataset || activeDataset.length === 0) return null
    return activeDataset.reduce((max, curr) => (curr.total > max.total ? curr : max), activeDataset[0])
  }, [activeDataset])

  // Real dynamic avg ticket & confirmation rate
  const avgTicket = overview?.avgTicket ?? (confirmed > 0 ? Math.round((overview?.totalRevenue ?? 0) / confirmed) : 0)
  const confirmationRate = overview?.confirmationRate ?? ((overview?.totalBookings ?? 0) > 0 ? Math.round((confirmed / (overview?.totalBookings ?? 1)) * 100) : 0)

  // Global Theme Variables: chart-4 (Sage/Emerald) for Revenue, chart-5 (Navy/Azure) for Bookings
  const activeChartVar = chartMode === "revenue" ? "var(--chart-4)" : "var(--chart-5)"

  return (
    <div className="flex flex-col gap-2 w-full min-h-0">
      {/* ========================================================================= */}
      {/* ROW 1 (3 CARDS): Trajectory Wave, Infrastructure Telemetry, Geo Hierarchy */}
      {/* ========================================================================= */}
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-3 w-full">
        {/* CARD 1: Dynamic Revenue & Booking Trajectory Spline Wave */}
        <div className="flex flex-col justify-between rounded-md border border-border/70 bg-card/90 backdrop-blur-md p-3 sm:p-3.5 shadow-xs h-[238px] overflow-hidden">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/40">
            <div className="flex items-center gap-2 min-w-0">
              <span className={cn("flex h-2 w-2 rounded-full animate-pulse shrink-0", chartMode === "revenue" ? "bg-chart-4" : "bg-chart-5")} />
              <h3 className="text-xs font-bold font-mono tracking-tight text-foreground truncate">
                {chartMode === "revenue" ? "REVENUE WAVE" : "BOOKING VELOCITY"}
              </h3>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs shrink-0">
              <button
                onClick={() => setChartMode("revenue")}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono transition-all",
                  chartMode === "revenue"
                    ? "bg-chart-4 text-white font-bold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <DollarSign className="h-3 w-3" />
                <span>Rev ($)</span>
              </button>
              <button
                onClick={() => setChartMode("bookings")}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-sm text-[10px] font-mono transition-all",
                  chartMode === "bookings"
                    ? "bg-chart-5 text-white font-bold shadow-2xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Calendar className="h-3 w-3" />
                <span>Book (#)</span>
              </button>
            </div>
          </div>

          {/* Dynamic Metric Sub-Strip */}
          <div className="flex items-center justify-between gap-2 px-1 py-0.5 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block">
                {chartMode === "revenue" ? "Gross Invoiced" : "Confirmed Count"}
              </span>
              <div className="flex items-baseline gap-2">
                <span className={cn("text-base font-extrabold font-mono", chartMode === "revenue" ? "text-chart-4" : "text-chart-5")}>
                  {chartMode === "revenue" ? `$${activeTotal.toLocaleString()}` : `${activeTotal} Bookings`}
                </span>
                <span className={cn("text-[10px] font-mono font-semibold flex items-center", chartMode === "revenue" ? "text-chart-4" : "text-chart-5")}>
                  <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                  Live
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block">
                {hoveredItem ? `Hover: ${hoveredItem.name}` : "Peak Trajectory"}
              </span>
              <span className={cn("text-xs font-bold font-mono", chartMode === "revenue" ? "text-chart-4" : "text-chart-5")}>
                {hoveredItem
                  ? chartMode === "revenue"
                    ? `$${hoveredItem.total.toLocaleString()}`
                    : `${hoveredItem.total} Bookings`
                  : peakMonthItem && peakMonthItem.total > 0
                    ? chartMode === "revenue"
                      ? `${peakMonthItem.name} ($${peakMonthItem.total >= 1000 ? (peakMonthItem.total / 1000).toFixed(1) + "k" : peakMonthItem.total.toLocaleString()})`
                      : `${peakMonthItem.name} (${peakMonthItem.total})`
                    : chartMode === "revenue"
                      ? "$0"
                      : "0 Bookings"}
              </span>
            </div>
          </div>

          {/* Spline Wave Area */}
          <div className="relative w-full h-[95px] flex items-center justify-center">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="deckWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeChartVar} stopOpacity="0.38" />
                  <stop offset="100%" stopColor={activeChartVar} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {areaPath && <path d={areaPath} fill="url(#deckWaveGrad)" />}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke={activeChartVar}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {splinePoints.map((p, idx) => {
                const isHover = hoveredIdx === idx
                return (
                  <g key={idx}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHover ? "4" : "2.5"}
                      fill="var(--card)"
                      stroke={activeChartVar}
                      strokeWidth={isHover ? "2.5" : "1.5"}
                    />
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Month Axis */}
          <div className="flex items-center justify-between px-1 pt-1 border-t border-border/40 font-mono text-[9px] text-muted-foreground">
            {splinePoints.map((p, idx) => (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={cn(
                  "cursor-pointer transition-colors",
                  hoveredIdx === idx
                    ? chartMode === "revenue"
                      ? "text-chart-4 font-bold scale-110"
                      : "text-chart-5 font-bold scale-110"
                    : "hover:text-foreground"
                )}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* CARD 2: Infrastructure & Real-Time Telemetry */}
        {/* CARD 2: VPS & PM2 Infrastructure Telemetry */}
        <div className="flex flex-col justify-between rounded-md border border-border/70 bg-card/90 backdrop-blur-md p-3 sm:p-3.5 shadow-xs h-[238px] overflow-hidden">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/40">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-2 w-2 rounded-full bg-chart-4 animate-pulse shrink-0" />
              <h3 className="text-xs font-bold font-mono tracking-tight text-foreground truncate">
                INFRASTRUCTURE TELEMETRY
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={cn(
                "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase",
                isPm2
                  ? "bg-chart-5/15 text-chart-5 border-chart-5/30"
                  : "bg-chart-4/15 text-chart-4 border-chart-4/30"
              )}>
                {isPm2 ? `PM2: ${onlineProcesses} Online` : `Fleet: ${onlineProcesses} Active`}
              </span>
              <button
                onClick={() => navigate("/system-health")}
                className="flex items-center gap-1 text-[10px] font-mono font-semibold text-chart-5 hover:underline"
              >
                <span>Live Health</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Dual Diagnostics Strip (VPS CPU % & VPS RAM %) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Box 1: VPS CPU Usage */}
            <div className="p-2 rounded-lg border border-chart-4/20 bg-chart-4/5 flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-1">
                <span className="text-[10px] text-muted-foreground font-mono block">VPS CPU Load</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-extrabold font-mono text-chart-4">{vpsCpu}%</span>
                  <span className="text-[9px] text-muted-foreground font-mono">{cpuCores} Cores</span>
                </div>
                {/* Micro Load Bar */}
                <div className="h-1 w-full bg-chart-4/20 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-chart-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(vpsCpu, 4))}%` }}
                  />
                </div>
              </div>
              <div className="h-6 w-6 rounded-sm bg-chart-4/15 border border-chart-4/30 flex items-center justify-center shrink-0">
                <Cpu className="h-3.5 w-3.5 text-chart-4" />
              </div>
            </div>

            {/* Box 2: VPS RAM / Memory */}
            <div className="p-2 rounded-lg border border-chart-5/20 bg-chart-5/5 flex items-center justify-between">
              <div className="min-w-0 flex-1 pr-1">
                <span className="text-[10px] text-muted-foreground font-mono block">VPS Memory (RAM)</span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-sm font-extrabold font-mono text-chart-5">
                    {usedRamGb > 0 ? `${usedRamGb}G` : `${memoryHeap}M`}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-mono">
                    {totalRamGb > 0 ? `of ${totalRamGb}GB (${ramPercent}%)` : `Buffer`}
                  </span>
                </div>
                {/* Micro Memory Bar */}
                <div className="h-1 w-full bg-chart-5/20 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-chart-5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(ramPercent, 10))}%` }}
                  />
                </div>
              </div>
              <div className="h-6 w-6 rounded-sm bg-chart-5/15 border border-chart-5/30 flex items-center justify-center shrink-0">
                <Wifi className="h-3.5 w-3.5 text-chart-5" />
              </div>
            </div>
          </div>

          {/* PM2 Process Fleet & Service Matrix */}
          <div className="p-2 rounded-lg border border-border/50 bg-muted/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-4" /> Backend Process
              </span>
              <span className="text-foreground font-bold flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-chart-4/15 text-chart-4 font-mono font-bold">
                  {backendInstances} {backendInstances === 1 ? "Instance" : "Instances"}
                </span>
                <span>Port 5010</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-5" /> Frontend Process
              </span>
              <span className="text-foreground font-bold flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-chart-5/15 text-chart-5 font-mono font-bold">
                  {frontendInstances} {frontendInstances === 1 ? "Instance" : "Instances"}
                </span>
                <span>Port 5173 / Next</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-3" />  PostgreSQL
              </span>
              <span className="text-chart-4 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> {dbLatency}ms Ping
              </span>
            </div>
          </div>

          {/* Telemetry Footer */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 text-[10px] font-mono">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-chart-2" />
              <span>Uptime: <strong className="text-foreground font-bold">{formattedUptime}</strong></span>
              <span className="text-border">|</span>
              <span>Events: <strong className="text-foreground font-bold">{totalAudit}</strong></span>
            </div>
            <span
              onClick={() => navigate("/audit-logs")}
              className="text-chart-5 hover:underline font-semibold cursor-pointer"
            >
              Audit Log ↗
            </span>
          </div>
        </div>

        {/* CARD 3: Global Geographic Intelligence */}
        <div className="flex flex-col justify-between rounded-md border border-border/70 bg-card/90 backdrop-blur-md p-3 sm:p-3.5 shadow-xs h-[238px] overflow-hidden">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/40">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="h-3.5 w-3.5 text-chart-3" />
              <h3 className="text-xs font-bold font-mono tracking-tight text-foreground truncate">
                GEOGRAPHIC INTELLIGENCE
              </h3>
            </div>
            <span className="text-[10px] font-mono text-chart-3 font-bold px-1.5 py-0.5 rounded bg-chart-3/15 border border-chart-3/30">
              {totalLocations} Destinations
            </span>
          </div>

          {/* Segmented Proportional Color Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span>5-Tier Global Distribution</span>
              <span className="text-foreground font-semibold">{countries} Countries • {places} Places</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted/60 p-0.5 border border-border/40 gap-0.5">
              <div
                className="h-full rounded-full bg-chart-5"
                style={{ width: `${(continents / totalLocations) * 100}%` }}
                title={`Continents: ${continents}`}
              />
              <div
                className="h-full rounded-full bg-chart-4"
                style={{ width: `${(countries / totalLocations) * 100}%` }}
                title={`Countries: ${countries}`}
              />
              <div
                className="h-full rounded-full bg-chart-3"
                style={{ width: `${(regions / totalLocations) * 100}%` }}
                title={`Regions: ${regions}`}
              />
              <div
                className="h-full rounded-full bg-chart-2"
                style={{ width: `${(places / totalLocations) * 100}%` }}
                title={`Places: ${places}`}
              />
              <div
                className="h-full rounded-full bg-chart-1"
                style={{ width: `${(landmarks / totalLocations) * 100}%` }}
                title={`Landmarks: ${landmarks}`}
              />
            </div>
          </div>

          {/* 4-Box Hierarchy Matrix */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-1.5 rounded-lg border border-chart-4/20 bg-chart-4/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-4" /> Countries
              </span>
              <span className="text-xs font-bold font-mono text-chart-4">{countries}</span>
            </div>
            <div className="p-1.5 rounded-lg border border-chart-3/20 bg-chart-3/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-3" /> Regions
              </span>
              <span className="text-xs font-bold font-mono text-chart-3">{regions}</span>
            </div>
            <div className="p-1.5 rounded-lg border border-chart-2/20 bg-chart-2/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-2" /> Places
              </span>
              <span className="text-xs font-bold font-mono text-chart-2">{places}</span>
            </div>
            <div className="p-1.5 rounded-lg border border-chart-5/20 bg-chart-5/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-5" /> Landmarks
              </span>
              <span className="text-xs font-bold font-mono text-chart-5">{landmarks}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
            <span>Continent: {continents} (Europe)</span>
            <span
              onClick={() => navigate("/location")}
              className="text-chart-3 hover:underline font-semibold cursor-pointer"
            >
              Destination Map ↗
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2 (2 WIDE CARDS - 50% / 50%): Bookings Pipeline & Ecosystem Hub        */}
      {/* ========================================================================= */}
      <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 w-full">
        {/* CARD 4 (50% WIDE): Booking Pipeline & Live Expeditions Ledger */}
        <div className="flex flex-col justify-between rounded-md border border-border/70 bg-card/90 backdrop-blur-md p-3 sm:p-3.5 shadow-xs h-[238px] overflow-hidden">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/40">
            <div className="flex items-center gap-2 min-w-0">
              <Compass className="h-3.5 w-3.5 text-chart-4" />
              <h3 className="text-xs font-bold font-mono tracking-tight text-foreground truncate">
                BOOKING PIPELINE & EXPEDITIONS LEDGER
              </h3>
            </div>
            <button
              onClick={() => navigate("/bookings")}
              className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-chart-4 hover:underline shrink-0"
            >
              <span>Manage All ({overview?.totalBookings ?? 0})</span>
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          {/* Body: Split into Pipeline Status & Verified Ledger */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start">
            {/* Left 5 Cols: Pipeline Breakdown */}
            <div className="sm:col-span-5 flex flex-col justify-between p-2 rounded-lg border border-border/50 bg-muted/20 h-[148px]">
              <div>
                <span className="text-[10px] text-muted-foreground font-mono font-semibold block">
                  Status Breakdown
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg font-extrabold font-mono text-chart-4 leading-tight">{confirmed}</span>
                  <span className="text-[10px] font-mono text-chart-4 font-bold">Confirmed Live</span>
                </div>

                {/* Status bar */}
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted/60 p-0.5 border border-border/40 gap-0.5 mt-1.5">
                  <div
                    className="h-full rounded-full bg-chart-4"
                    style={{ width: `${(confirmed / totalStatus) * 100}%` }}
                  />
                  {underReview > 0 && (
                    <div
                      className="h-full rounded-full bg-chart-3"
                      style={{ width: `${(underReview / totalStatus) * 100}%` }}
                    />
                  )}
                  {depositDue > 0 && (
                    <div
                      className="h-full rounded-full bg-chart-5"
                      style={{ width: `${(depositDue / totalStatus) * 100}%` }}
                    />
                  )}
                  {cancelled > 0 && (
                    <div
                      className="h-full rounded-full bg-destructive"
                      style={{ width: `${(cancelled / totalStatus) * 100}%` }}
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-1 text-[9px] font-mono text-muted-foreground border-t border-border/30">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-chart-4" /> Confirmed
                  </span>
                  <span className="text-chart-4 font-bold">{confirmed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-chart-3" /> In Review
                  </span>
                  <span className="text-foreground font-bold">{underReview}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> Cancelled
                  </span>
                  <span className="text-foreground font-bold">{cancelled}</span>
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Live Bookings Ledger Feed */}
            <div className="sm:col-span-7 flex flex-col justify-between h-[148px]">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono font-semibold">
                <span>Recent Expeditions Stream</span>
                <span className="text-[9px] text-chart-4 font-mono">{recentBookings.length} Total</span>
              </div>
              <div className="flex flex-col gap-1.5 h-[126px] overflow-y-auto pr-1">
                {recentBookings.slice(0, 6).map((b) => (
                  <div
                    key={b.id}
                    onClick={() => navigate("/bookings")}
                    className="flex items-center justify-between px-2 py-1 rounded-sm border border-border/50 bg-muted/25 hover:bg-muted/50 transition-colors cursor-pointer h-[38px] shrink-0"
                  >
                    <div className="min-w-0 pr-1 flex flex-col justify-center">
                      <span className="font-bold text-foreground text-[11px] leading-tight truncate">
                        {b.travelerName}
                      </span>
                      <span className="text-[9px] text-muted-foreground leading-tight truncate">
                        {b.journeyTitle}
                      </span>
                    </div>
                    <div className="text-right shrink-0 flex flex-col justify-center items-end">
                      <span className="font-bold text-chart-4 text-[11px] font-mono leading-tight">
                        ${b.amount.toLocaleString()}
                      </span>
                      <span className="text-[8px] px-1 py-0.2 rounded bg-chart-4/15 text-chart-4 border border-chart-4/30 uppercase font-mono font-bold leading-none mt-0.5">
                        {b.bookingStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
            <span>Avg Ticket: <strong className="text-foreground font-bold font-mono">${avgTicket.toLocaleString()}</strong> • {confirmationRate}% Confirmation Rate</span>
            <span
              onClick={() => navigate("/bookings")}
              className="text-chart-4 hover:underline font-semibold cursor-pointer"
            >
              Explore Ledger ↗
            </span>
          </div>
        </div>

        {/* CARD 5 (50% WIDE): Leads, Content & Community Ecosystem */}
        <div className="flex flex-col justify-between rounded-md border border-border/70 bg-card/90 backdrop-blur-md p-3 sm:p-3.5 shadow-xs h-[238px] overflow-hidden">
          {/* Top Control Bar */}
          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/40">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="h-3.5 w-3.5 text-chart-2" />
              <h3 className="text-xs font-bold font-mono tracking-tight text-foreground truncate">
                LEADS, CONTENT & COMMUNITY ECOSYSTEM
              </h3>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              6 Core Operational Sectors
            </span>
          </div>

          {/* Body: 6 Interactive Sector Cards with Distinct Global Theme Colors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {/* 1. Journey Wizard Requests -> Chart-5 (Navy/Azure Blue) */}
            <div
              onClick={() => navigate("/requests")}
              className="group p-2 rounded-lg border border-chart-5/20 bg-chart-5/5 hover:border-chart-5/50 hover:bg-card transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="h-6 w-6 rounded-sm bg-chart-5/15 border border-chart-5/30 flex items-center justify-center text-chart-5 group-hover:bg-chart-5 group-hover:text-white transition-colors">
                  <Compass className="h-3.5 w-3.5" />
                </div>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/60 group-hover:text-chart-5 transition-colors" />
              </div>
              <span className="text-sm font-extrabold font-mono text-chart-5 block">
                {totalRequests}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                Wizard Requests
              </span>
            </div>

            {/* 2. Contact Inquiries -> Chart-2 (Terracotta/Copper) */}
            <div
              onClick={() => navigate("/inquiries")}
              className="group p-2 rounded-lg border border-chart-2/20 bg-chart-2/5 hover:border-chart-2/50 hover:bg-card transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="h-6 w-6 rounded-sm bg-chart-2/15 border border-chart-2/30 flex items-center justify-center text-chart-2 group-hover:bg-chart-2 group-hover:text-white transition-colors">
                  <MessageSquare className="h-3.5 w-3.5" />
                </div>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/60 group-hover:text-chart-2 transition-colors" />
              </div>
              <span className="text-sm font-extrabold font-mono text-chart-2 block">
                {totalInquiries}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                Lead Inquiries
              </span>
            </div>

            {/* 3. Experiences -> Chart-3 (Sun Gold/Ochre) */}
            <div
              onClick={() => navigate("/experiences")}
              className="group p-2 rounded-lg border border-chart-3/20 bg-chart-3/5 hover:border-chart-3/50 hover:bg-card transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="h-6 w-6 rounded-sm bg-chart-3/15 border border-chart-3/30 flex items-center justify-center text-chart-3 group-hover:bg-chart-3 group-hover:text-white transition-colors">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/60 group-hover:text-chart-3 transition-colors" />
              </div>
              <span className="text-sm font-extrabold font-mono text-chart-3 block">
                {totalExperiences}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                Experiences
              </span>
            </div>

            {/* 4. Travel Stories -> Chart-4 (Sage/Emerald) */}
            <div
              onClick={() => navigate("/stories")}
              className="group p-2 rounded-lg border border-chart-4/20 bg-chart-4/5 hover:border-chart-4/50 hover:bg-card transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="h-6 w-6 rounded-sm bg-chart-4/15 border border-chart-4/30 flex items-center justify-center text-chart-4 group-hover:bg-chart-4 group-hover:text-white transition-colors">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/60 group-hover:text-chart-4 transition-colors" />
              </div>
              <span className="text-sm font-extrabold font-mono text-chart-4 block">
                {totalStories}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                Travel Stories
              </span>
            </div>

            {/* 5. Newsletter Subscribers -> Chart-5 (Navy/Azure Blue) */}
            <div
              onClick={() => navigate("/newsletter")}
              className="group p-2 rounded-lg border border-chart-5/20 bg-chart-5/5 hover:border-chart-5/50 hover:bg-card transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="h-6 w-6 rounded-sm bg-chart-5/15 border border-chart-5/30 flex items-center justify-center text-chart-5 group-hover:bg-chart-5 group-hover:text-white transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/60 group-hover:text-chart-5 transition-colors" />
              </div>
              <span className="text-sm font-extrabold font-mono text-chart-5 block">
                {totalSubscribers}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                Subscribers
              </span>
            </div>

            {/* 6. Media Assets -> Chart-2 (Terracotta/Copper) */}
            <div
              onClick={() => navigate("/media-library")}
              className="group p-2 rounded-lg border border-chart-2/20 bg-chart-2/5 hover:border-chart-2/50 hover:bg-card transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="h-6 w-6 rounded-sm bg-chart-2/15 border border-chart-2/30 flex items-center justify-center text-chart-2 group-hover:bg-chart-2 group-hover:text-white transition-colors">
                  <FolderOpen className="h-3.5 w-3.5" />
                </div>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/60 group-hover:text-chart-2 transition-colors" />
              </div>
              <span className="text-sm font-extrabold font-mono text-chart-2 block">
                {totalMedia}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                Media Assets
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3 w-3 text-chart-4" /> All 6 Operational Sectors Live
            </span>
            <span className="text-muted-foreground">PostgreSQL Direct</span>
          </div>
        </div>
      </div>
    </div>
  )
}
