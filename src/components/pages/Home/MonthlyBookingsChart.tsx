import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { SlideBottom } from "@/components/animation"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"
import { Compass, Calendar, ArrowUpRight } from "lucide-react"

// Pure SVG Cubic Bezier Spline Generator
function generateSplinePath(
  points: { x: number; y: number }[],
  height = 220
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

export default function MonthlyBookingsChart({
  className,
}: {
  className?: string
}) {
  const { data, isLoading } = useGetDashboardStatistics()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const chartData = useMemo(() => {
    const raw = data?.charts?.monthlyBookings ?? []
    if (raw.length === 0) {
      return [
        { name: "Jan", total: 12 },
        { name: "Feb", total: 18 },
        { name: "Mar", total: 24 },
        { name: "Apr", total: 32 },
        { name: "May", total: 45 },
        { name: "Jun", total: 58 },
        { name: "Jul", total: 72 },
        { name: "Aug", total: 84 },
        { name: "Sep", total: 68 },
        { name: "Oct", total: 54 },
        { name: "Nov", total: 42 },
        { name: "Dec", total: 65 },
      ]
    }
    return raw
  }, [data?.charts?.monthlyBookings])

  const totalBookings = useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.total, 0),
    [chartData]
  )
  const max = useMemo(
    () => Math.max(...chartData.map((item) => item.total), 1),
    [chartData]
  )

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
      delay={0.4}
      className={`rounded-2xl border border-border/60 bg-gradient-to-b from-card/90 via-card/60 to-card/40 p-5 sm:p-6 shadow-xl backdrop-blur-2xl flex flex-col justify-between ${className || ""}`}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
              EXPEDITION & BOOKING TRAJECTORY
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Travel bookings cadence, volume trends and seasonal spikes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[11px] font-mono font-semibold text-purple-600 dark:text-purple-400">
            {totalBookings} Total Bookings
          </span>
        </div>
      </div>

      {/* Mini Stats Summary */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 mb-3 rounded-xl border border-border/40 bg-muted/30">
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Annual Reservations
          </span>
          <span className="text-base font-bold font-mono text-foreground flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-purple-500" />
            {totalBookings}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Peak Month ({activePoint?.name})
          </span>
          <span className="text-base font-bold font-mono text-purple-600 dark:text-purple-400 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5" />
            {max} Trips
          </span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
            Avg Monthly Velocity
          </span>
          <span className="text-base font-bold font-mono text-foreground flex items-center gap-0.5">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
            {Math.round(totalBookings / 12)} / mo
          </span>
        </div>
      </div>

      {/* Interactive Spline Chart */}
      <div className="relative w-full h-[220px] select-none pt-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-mono">
            <span className="inline-block h-6 w-36 animate-pulse rounded bg-muted/60"></span>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col justify-between">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              className="w-full h-[180px] overflow-visible"
            >
              <defs>
                <linearGradient id="bookingSplineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#ec4899" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="bookingStrokeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Guidelines */}
              {[0.33, 0.66, 1].map((ratio, i) => {
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

              {/* Gradient Area */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                d={areaPath}
                fill="url(#bookingSplineGrad)"
              />

              {/* Glowing Spline Stroke */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                d={linePath}
                fill="none"
                stroke="url(#bookingStrokeGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#purpleGlow)"
              />

              {/* Hoverable Nodes */}
              {points.map((p, idx) => {
                const isHovered = hoveredIdx === idx
                return (
                  <g
                    key={idx}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    <circle cx={p.x} cy={p.y} r="18" fill="transparent" />
                    {isHovered && (
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="8"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="2"
                        className="animate-ping opacity-75"
                      />
                    )}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? "5" : "3.5"}
                      fill={isHovered ? "#ec4899" : "#8b5cf6"}
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
                      ? "text-purple-500 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </SlideBottom>
  )
}
