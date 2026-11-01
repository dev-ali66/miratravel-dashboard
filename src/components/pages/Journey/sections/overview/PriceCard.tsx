import { cn } from "@/lib/utils"

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function MoneyIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 2.5L9.5 5.5M16 2.5L14.5 5.5M8 2.5C10 3.8 14 3.8 16 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 5.5C5 8 3 12 3 16C3 19.5 6 22 12 22C18 22 21 19.5 21 16C21 12 19 8 14.5 5.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="7.5" y="12" width="9" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="15" r="1.2" fill="currentColor" />
    </svg>
  )
}

function CheckmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.56798 17.3352C9.56334 14.2677 16.9028 6.37172 22.9892 2.2694C23.2477 2.09516 23.5395 2.4374 23.3252 2.66348C17.5431 8.77004 11.3624 15.677 7.81278 21.6496C7.7139 21.816 7.47534 21.8217 7.3719 21.658C5.58582 18.8289 4.0539 14.7621 0.770218 13.5156C0.526378 13.4229 0.549658 13.078 0.803338 13.0171C3.94998 12.2587 5.42454 14.95 7.56798 17.3347V17.3352Z" fill="#8D6534" />
    </svg>
  )
}

function MiraStarIcon({ className, color = "#9C7B5A" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="757.62 552.4 484.76 895.2" className={className} aria-hidden="true" fill={color}>
      <polygon points="1029.99,1000 1000.04,1447.6 970.01,1000 1000.04,552.4" />
      <polygon points="1000,1029.99 757.62,1000.03 1000,970.01 1242.38,1000.03" />
      <polygon points="1028.15,999.97 1115.35,884.65 999.98,971.81 884.62,884.65 971.82,999.97 884.62,1115.38 999.98,1028.15 1115.35,1115.38" />
    </svg>
  )
}

export interface PriceCardProps {
  title?: string
  price?: string | number
  currency?: string
  days?: string | number
  benefits?: string[]
  onRequestBooking?: () => void
  className?: string
}

export function PriceCard({
  title = "Adventurous Albania",
  price,
  currency = "€",
  days = "7 days",
  benefits = [
    "Free cancellation up to 60 days",
    "Flexible payment plans available",
    "Personal travel specialist",
    "Direct local support",
    "Financial protection",
  ],
  onRequestBooking,
  className = "",
}: PriceCardProps) {
  const symbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : currency || "€"
  const rawPrice = price ? `${symbol}${typeof price === "number" ? price.toLocaleString() : price}` : "€2,300"
  const resolvedPrice = rawPrice.toLowerCase().startsWith("from") ? rawPrice : `From ${rawPrice}`
  const resolvedDays = typeof days === "number" ? `${days} days` : String(days).toLowerCase().includes("day") ? days : `${days} days`

  return (
    <section className="w-full py-10 md:py-14 xl:py-16">
      <div className={cn("w-full flex flex-col overflow-hidden", className)}>
        {/* Upper Details & Prices Banner */}
        <div className="w-full bg-transparent border border-accent/35 px-6 md:px-10 lgx:px-12 xl:px-16 py-8 md:py-10 xl:py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left: Titles & Stats */}
          <div className="flex flex-col justify-start items-start gap-5 sm:gap-6">
            <div className="flex flex-col justify-start items-start gap-2">
              <span className="text-muted-foreground text-sm md:text-base xl:text-lg font-normal tracking-[0.5px]">
                Details &amp; prices
              </span>
              <div className="flex items-center gap-2">
                <h3 className="text-accent text-2xl sm:text-3xl lgx:text-4xl font-heading font-normal">
                  {title}
                </h3>
                <MiraStarIcon className="w-6 h-6 md:w-7 md:h-7 shrink-0 text-accent" />
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3">
              <div className="flex items-center gap-2.5 shrink-0">
                <CalendarIcon className="size-5 md:size-6 text-foreground shrink-0" />
                <span className="text-foreground text-sm sm:text-base md:text-lg font-normal">
                  {resolvedDays}
                </span>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <MoneyIcon className="size-5 md:size-6 text-foreground shrink-0" />
                <span className="text-foreground text-sm sm:text-base md:text-lg font-normal">
                  {resolvedPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Right: CTA Button & Prompt */}
          <div className="w-full lg:w-96 flex flex-col justify-start items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onRequestBooking}
              className="w-full h-14 px-8 md:px-12 bg-accent text-white flex items-center justify-center font-semibold text-sm md:text-base uppercase tracking-[1.5px] transition-all hover:bg-accent/90 cursor-pointer active:scale-[0.99] shadow-sm"
            >
              Request This Journey
            </button>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground text-center">
              <span>Questions on this journey?</span>
              <button
                type="button"
                onClick={onRequestBooking}
                className="text-accent font-medium underline underline-offset-2 hover:text-accent/80 cursor-pointer"
              >
                Contact our travel experts
              </button>
            </div>
          </div>
        </div>

        {/* Lower Benefits Strip */}
        <div className="w-full border-l border-r border-b border-accent/35 px-6 md:px-10 lgx:px-12 xl:px-16 py-6 md:py-7 bg-[#F9F6ED]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-[1.5px] text-muted-foreground shrink-0">
            Included in every journey:
          </span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-foreground">
                <CheckmarkIcon className="size-3.5 text-accent shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PriceCard
