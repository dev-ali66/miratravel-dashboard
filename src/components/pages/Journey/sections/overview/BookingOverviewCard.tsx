import { cn } from "@/lib/utils"

export interface BookingOverviewCardProps {
  price?: string | number
  currency?: string
  onRequestBooking?: () => void
  className?: string
}

export function BookingOverviewCard({
  price,
  currency,
  onRequestBooking,
  className,
}: BookingOverviewCardProps) {
  const formattedPrice = `${currency === "EUR" ? "€" : currency === "USD" ? "$" : currency || "€"}${
    typeof price === "number" ? price.toLocaleString() : price || "3,195"
  }`

  const benefits = [
    "Bespoke itinerary tailoring included",
    "Flexible booking & cancellation terms",
    "24/7 dedicated concierge during travel",
  ]

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4 sm:gap-5 xl:gap-6 rounded-[10px] border border-border bg-card text-card-foreground p-5 sm:p-6 xl:p-8 shadow-xs transition-all",
        className
      )}
    >
      <div className="flex w-full flex-col items-start gap-1 sm:gap-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl xl:text-[32px] font-semibold tracking-[1.5px] sm:tracking-[2px] text-foreground leading-tight">
            {formattedPrice}
          </span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground">
            / per person
          </span>
        </div>
        <p className="text-xs sm:text-sm font-normal text-muted-foreground">
          Based on double occupancy
        </p>
      </div>

      <div className="flex flex-col items-start gap-4 sm:gap-5 w-full">
        <div className="flex w-full border-t border-border pt-3 items-center justify-between text-xs sm:text-sm font-normal text-muted-foreground">
          <span>Taxes & Fees</span>
          <span className="font-semibold text-brand-primary">Included</span>
        </div>

        <button
          type="button"
          onClick={onRequestBooking}
          className="w-full rounded-[4px] bg-brand-primary text-white font-semibold py-3 sm:py-3.5 px-4 sm:px-6 text-center text-xs sm:text-sm md:text-base tracking-wider uppercase transition-all hover:bg-primary-hover cursor-pointer shadow-sm active:scale-[0.99]"
        >
          REQUEST BOOKING
        </button>

        <div className="flex flex-col justify-center items-center gap-1.5 w-full text-center pt-1">
          <p className="text-xs sm:text-sm font-normal text-muted-foreground">
            Have questions about this journey?
          </p>
          <button
            type="button"
            onClick={onRequestBooking}
            className="text-xs sm:text-sm font-semibold text-accent underline underline-offset-2 transition-colors hover:text-accent-hover cursor-pointer"
          >
            Speak to a Specialist
          </button>
        </div>

        {benefits.length > 0 && (
          <ul className="flex w-full flex-col items-start pt-3 gap-2 border-t border-border">
            {benefits.map((benefit, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs sm:text-sm font-normal text-muted-foreground"
              >
                <span className="text-accent font-bold shrink-0">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default BookingOverviewCard
