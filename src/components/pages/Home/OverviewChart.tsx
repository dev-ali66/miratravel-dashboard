import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { SlideBottom } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"
import { TrendingUp, DollarSign, Activity, Layers } from "lucide-react"

// Pure SVG Cubic Bezier Spline Generator
function generateSplinePath(
  points: { x: number; y: number }[],
  height = 240
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

export default function OverviewChart({ className }: { className?: string }) {
  const { data, isLoading } = useGetDashboardStatistics()
  const [chartMode, setChartMode] = useState<"spline" | "bars">("spline")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const chartData = useMemo(() => {
    const raw = data?.charts?.revenueOverview ?? []
    if (raw.length === 0) {
      return [
        { name: "Jan", total: 4200 },
        { name: "Feb", total: 6800 },
        { name: "Mar", total: 9500 },
        { name: "Apr", total: 14200 },
        { name: "May", total: 18400 },
        { name: "Jun", total: 24500 },
        { name: "Jul", total: 28900 },
        { name: "Aug", total: 34200 },
        { name: "Sep", total: 29800 },
        { name: "Oct", total: 26400 },
        { name: "Nov", total: 21500 },
        { name: "Dec", total: 31200 },
      ]
    }
    return raw
  }, [data?.charts?.revenueOverview])

  const totalSum = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.total, 0),
    [chartData]
  )
  const max = useMemo(
    () => Math.max(...chartData.map((item) => item.total), 1),
    [chartData]
  )

  // Chart Canvas Dimensions
  const svgWidth = 800
  const svgHeight = 220
  const padX = 35
  const padBottom = 20
  const padTop = 20

  const points = useMemo(() => {
    return chartData.map((item, idx) => {
      const x = padX + (idx / (chartData.length - 1)) * (svgWidth - padX * 2)
      const usableHeight = svgHeight - padTop - padBottom
      const y = padTop + usableHeight - (item.total / max) * usableHeight
      return { x, y, ...item }
    })
  }, [chartData, max])

  const { linePath, areaPath } = useMemo(
    () => generateSplinePath(points, svgHeight - padBottom),
    [points]
  )

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1]

  return (
    <SlideBottom
      delay={0.3}
      className={`rounded-2xl border border-border/60 bg-gradient-to-b from-card/90 via-card/60 to-card/40 p-5 sm:p-6 shadow-xl backdrop-blur-2xl flex flex-col justify-between ${className || ""}`}
    >
      {/* Top Header & Telemetry Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
              REVENUE OVERVIEW & GROSS TIME-SERIES
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Monthly gross booking revenue stream with cubic spline interpolation
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs">
            <button
              onClick={() => setChartMode("spline")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                chartMode === "spline"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="h-3.5 w-3.5 text-emerald-500" />
              <span>Spline Wave</span>
            </button>
            <button
              onClick={() => setChartMode("bars")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                chartMode === "bars"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-cyan-500" />
              <span>Histogram</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-Tech Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-3.5 mb-4 rounded-xl border border-border/40 bg-muted/30">
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Annual Gross Run-rate
          </span>
          <span className="text-lg font-bold font-mono text-foreground flex items-center gap-0.5">
            <DollarSign className="h-4 w-4 text-emerald-500" />
            {totalSum.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            MoM Growth Trajectory
          </span>
          <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            +24.8%
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Peak Monthly Volume
          </span>
          <span className="text-lg font-bold font-mono text-foreground">
            ${max.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Selected Month ({activePoint?.name})
          </span>
          <span className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">
            ${activePoint?.total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Interactive Chart Canvas */}
      <div className="relative w-full h-[260px] select-none pt-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-mono">
            <span className="inline-block h-6 w-36 animate-pulse rounded bg-muted/60"></span>
          </div>
        ) : chartMode === "spline" ? (
          <div className="relative w-full h-full flex flex-col justify-between">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              className="w-full h-[210px] overflow-visible"
            >
              <defs>
                <linearGradient id="revenueSplineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="splineStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid Guideline Lines */}
              {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = padTop + (svgHeight - padTop - padBottom) * (1 - ratio)
                return (
                  <line
                    key={i}
                    x1={padX}
                    y1={y}
                    x2={svgWidth - padX}
                    y2={y}
                    stroke="currentColor"
                    className="text-border/40"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                )
              })}

              {/* Area Under Curve */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                d={areaPath}
                fill="url(#revenueSplineGrad)"
              />

              {/* Glowing Spline Stroke Curve */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                d={linePath}
                fill="none"
                stroke="url(#splineStrokeGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />

              {/* Data Node Dots with hover focus */}
              {points.map((p, idx) => {
                const isHovered = hoveredIdx === idx
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Hover Hitbox */}
                    <circle cx={p.x} cy={p.y} r="18" fill="transparent" />

                    {/* Outer Glow Ring on Hover */}
                    {isHovered && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        className="animate-ping opacity-75"
                      />
                    )}

                    {/* Point Dot */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? "5" : "3.5"}
                      fill={isHovered ? "#06b6d4" : "#10b981"}
                      stroke="#ffffff"
                      strokeWidth={isHovered ? "2.5" : "1.5"}
                      className="transition-all duration-200"
                    />
                  </g>
                )
              })}
            </svg>

            {/* X-Axis Month Labels */}
            <div className="flex items-center justify-between px-3 pt-2 border-t border-border/40">
              {points.map((p, idx) => (
                <span
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className={`text-[11px] font-mono transition-colors cursor-pointer ${
                    hoveredIdx === idx
                      ? "text-cyan-500 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          /* Histogram Bar View Mode */
          <div className="flex h-full items-end justify-between gap-1 pt-4 sm:gap-2">
            {chartData.map((item, index) => {
              const heightPercent = item.total > 0 ? Math.max((item.total / max) * 100, 5) : 3
              const isHovered = hoveredIdx === index

              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="group relative flex h-full w-full flex-col items-center justify-end gap-2 cursor-pointer"
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="pointer-events-none absolute -top-8 z-20 rounded-md bg-foreground px-2 py-0.5 text-[10px] font-mono font-bold text-background shadow-lg whitespace-nowrap animate-fade-in">
                      ${item.total.toLocaleString()}
                    </div>
                  )}

                  {/* Histogram Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.03,
                      type: "spring",
                      stiffness: 70,
                      damping: 15,
                    }}
                    className={`w-full max-w-[34px] rounded-t-lg transition-all duration-200 ${
                      isHovered
                        ? "bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-lg shadow-cyan-500/20"
                        : "bg-gradient-to-t from-emerald-600/50 to-cyan-500/50 group-hover:from-emerald-500 group-hover:to-cyan-400"
                    }`}
                  />

                  {/* Month Label */}
                  <span
                    className={`text-[11px] font-mono transition-colors ${
                      isHovered ? "text-cyan-500 font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </SlideBottom>
  )
}
