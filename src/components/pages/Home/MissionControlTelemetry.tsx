import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Cpu,
  Wifi,
  ArrowUpRight,
} from "lucide-react"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"
import { cn } from "@/lib/utils"

// Circular SVG Progress Ring Component
function CircularGauge({
  percentage,
  label,
  subtext,
  strokeColor,
  gradientId,
  size = 110,
  strokeWidth = 9,
}: {
  percentage: number
  label: string
  subtext: string
  strokeColor: string
  gradientId: string
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={strokeColor} />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id={`gaugeGlow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-muted/40"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          {/* Animated Glowing Progress Arc */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            fill="transparent"
            filter={`url(#gaugeGlow-${gradientId})`}
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono tracking-tight text-foreground leading-none">
            {percentage}%
          </span>
          <span className="text-[9px] font-mono text-muted-foreground uppercase mt-0.5">
            Health
          </span>
        </div>
      </div>

      <span className="text-xs font-semibold text-foreground mt-2">{label}</span>
      <span className="text-[10px] text-muted-foreground font-mono">{subtext}</span>
    </div>
  )
}

export default function MissionControlTelemetry() {
  const navigate = useNavigate()
  const { data } = useGetDashboardStatistics()
  const modules = data?.modules

  // World destination hotspots
  const hotspots = [
    { name: "Kyoto & Tokyo, Japan", x: 740, y: 155, region: "ASIA", journeys: 14 },
    { name: "Amalfi & Rome, Italy", x: 440, y: 140, region: "EUROPE", journeys: 22 },
    { name: "Reykjavik, Iceland", x: 380, y: 90, region: "EUROPE", journeys: 8 },
    { name: "Zermatt, Switzerland", x: 430, y: 130, region: "EUROPE", journeys: 12 },
    { name: "Serengeti, Tanzania", x: 480, y: 240, region: "AFRICA", journeys: 9 },
    { name: "Cusco & Machu Picchu, Peru", x: 260, y: 250, region: "AMERICAS", journeys: 11 },
    { name: "Auckland & Queenstown, NZ", x: 800, y: 310, region: "OCEANIA", journeys: 7 },
  ]

  const regionBreakdown = [
    { name: "Europe", pct: 44, color: "bg-blue-500", text: "text-blue-500", count: "32 Destinations" },
    { name: "Asia-Pacific", pct: 28, color: "bg-purple-500", text: "text-purple-500", count: "21 Destinations" },
    { name: "Americas", pct: 16, color: "bg-emerald-500", text: "text-emerald-500", count: "14 Destinations" },
    { name: "Africa & Polar", pct: 12, color: "bg-amber-500", text: "text-amber-500", count: "9 Destinations" },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-7">
      {/* 1. Global Geography & Destination Radar (4 Cols) */}
      <div className="lg:col-span-4 rounded-xl border border-border/60 bg-gradient-to-b from-card/90 via-card/60 to-card/40 p-5 sm:p-6 shadow-xl backdrop-blur-2xl flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
                GLOBAL DESTINATION RADAR & GEO MAP
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live expedition routing nodes and regional traveler footprint
            </p>
          </div>
          <button
            onClick={() => navigate("/location")}
            className="flex items-center gap-1 text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 hover:underline shrink-0"
          >
            <span>Manage Locations</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Stylized Futuristic World Map SVG with glowing nodes */}
        <div className="relative w-full h-[220px] rounded-md border border-border/40 bg-[#070d17]/80 overflow-hidden flex items-center justify-center p-2">
          {/* Subtle Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                "linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <svg viewBox="0 0 900 400" className="w-full h-full select-none">
            <defs>
              <linearGradient id="mapGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Continents Outlines (Futuristic Geometric Silhouettes) */}
            {/* North America */}
            <path
              d="M 120 70 L 280 65 L 300 120 L 250 170 L 190 200 L 160 170 L 140 120 Z"
              fill="url(#mapGlow)"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="opacity-70"
            />
            {/* South America */}
            <path
              d="M 230 210 L 310 230 L 290 320 L 250 370 L 220 280 Z"
              fill="url(#mapGlow)"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="opacity-70"
            />
            {/* Europe */}
            <path
              d="M 390 80 L 490 75 L 480 150 L 420 160 L 380 120 Z"
              fill="url(#mapGlow)"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="opacity-70"
            />
            {/* Africa */}
            <path
              d="M 420 170 L 510 180 L 530 260 L 480 340 L 430 290 L 400 220 Z"
              fill="url(#mapGlow)"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="opacity-70"
            />
            {/* Asia */}
            <path
              d="M 500 70 L 750 80 L 780 170 L 720 230 L 610 210 L 530 160 Z"
              fill="url(#mapGlow)"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="opacity-70"
            />
            {/* Australia / Oceania */}
            <path
              d="M 710 270 L 810 280 L 790 350 L 700 330 Z"
              fill="url(#mapGlow)"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              className="opacity-70"
            />

            {/* Flight Path Arc Vectors */}
            <path
              d="M 440 140 Q 590 70 740 155"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-60"
            />
            <path
              d="M 260 250 Q 350 180 440 140"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="opacity-60"
            />

            {/* Glowing Destination Hotspot Nodes */}
            {hotspots.map((node, i) => (
              <g
                key={i}
                className="cursor-pointer group"
                onClick={() => navigate("/location")}
              >
                {/* Ping Ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="9"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  className="animate-ping opacity-75"
                />
                {/* Core Dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4.5"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Node Label Tooltip on Hover */}
                <text
                  x={node.x + 8}
                  y={node.y - 6}
                  fill="#e2e8f0"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                  className="opacity-80"
                >
                  {node.name.split(",")[0]} ({node.journeys})
                </text>
              </g>
            ))}
          </svg>

          {/* Map Overlay Badge */}
          <div className="absolute bottom-2 left-3 flex items-center gap-2 bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-sm border border-border/40 text-[10px] font-mono text-muted-foreground">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>GEO RADAR: 48 COUNTRIES ACTIVE</span>
          </div>
        </div>

        {/* Regional Distribution Proportions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-border/40">
          {regionBreakdown.map((r, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-semibold text-foreground">{r.name}</span>
                <span className={r.text}>{r.pct}%</span>
              </div>
              <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", r.color)} style={{ width: `${r.pct}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Platform Gauges & Funnel Telemetry (3 Cols) */}
      <div className="lg:col-span-3 rounded-xl border border-border/60 bg-gradient-to-b from-card/90 via-card/60 to-card/40 p-5 sm:p-6 shadow-xl backdrop-blur-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
                OPERATIONAL GAUGES & FUNNEL
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              System health and booking pipeline conversion performance
            </p>
          </div>
        </div>

        {/* 3 Circular Radial Gauges */}
        <div className="grid grid-cols-3 gap-3 py-3 px-2 rounded-md border border-border/40 bg-muted/20">
          <CircularGauge
            percentage={99}
            label="Sys Health"
            subtext="Zero Latency"
            strokeColor="#10b981"
            gradientId="gaugeSys"
          />
          <CircularGauge
            percentage={78}
            label="Conversion"
            subtext="Lead to Book"
            strokeColor="#8b5cf6"
            gradientId="gaugeConv"
          />
          <CircularGauge
            percentage={94}
            label="Inq Response"
            subtext="<2h TAT"
            strokeColor="#06b6d4"
            gradientId="gaugeInq"
          />
        </div>

        {/* Funnel Pipeline Conversion Stages */}
        <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-border/40">
          <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
            End-To-End Booking Funnel Velocity
          </span>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">1. Inquiries & Wizard</span>
              <span className="font-semibold text-foreground">100% (248)</span>
            </div>
            <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-full rounded-full" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground">2. Custom Itinerary Quotes</span>
              <span className="font-semibold text-foreground">84% (208)</span>
            </div>
            <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[84%] rounded-full" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground">3. Confirmed & Paid Bookings</span>
              <span className="font-semibold text-emerald-500">74% (184)</span>
            </div>
            <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[74%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Live Server Specs & Microservices Strip */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border/40 font-mono text-[11px]">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/40">
            <Cpu className="h-4 w-4 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-muted-foreground block">Memory Heap</span>
              <span className="font-bold text-foreground">
                {modules?.systemHealth?.memoryMb ?? 64} MB Allocated
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/40">
            <Wifi className="h-4 w-4 text-cyan-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] text-muted-foreground block">Socket Ping</span>
              <span className="font-bold text-emerald-500">18ms Latency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
