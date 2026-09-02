import { SlideBottom, SlideLeft } from "@/components/animation"
import { Star } from "lucide-react"
import { useGetDashboardStatistics } from "@/hooks/analysis/useGetDashboardStatistics"

export default function InstructorRatings({ className }: { className?: string }) {
  const { data } = useGetDashboardStatistics()
  const instructorRatings = data?.instructorRatings
  const topInstructors = instructorRatings?.topInstructors ?? []

  return (
    <SlideBottom
      delay={0.6}
      className={`rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col ${className || ""}`}
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Instructor Ratings</h3>
          <p className="text-sm text-muted-foreground mt-1">Platform average & top instructors</p>
        </div>
      </div>

      <div className="flex items-center gap-6 rounded-xl bg-muted/40 p-4 mb-6">
        <div className="flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{instructorRatings?.averageRating?.toFixed(1) ?? "0.0"}</span>
          <span className="text-xs font-medium text-muted-foreground mt-1">Out of 5.0</span>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex text-amber-500">
            {Array.from({ length: 5 }, (_, index) => {
              const ratingValue = instructorRatings?.averageRating ?? 0
              const isFilled = ratingValue >= index + 1
              const isHalfFilled = !isFilled && ratingValue >= index + 0.5

              return (
                <Star
                  key={index}
                  className={`size-5 ${isFilled || isHalfFilled ? "fill-current" : "text-muted-foreground/30"}`}
                />
              )
            })}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Based on {instructorRatings?.totalReviews?.toLocaleString() ?? 0} total reviews
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {topInstructors.map((instructor, index) => (
          <SlideLeft
            key={instructor.id}
            delay={0.7 + index * 0.1}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                {instructor.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{instructor.name}</span>
                <span className="text-xs text-muted-foreground">{instructor.reviews} Reviews</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-md">
                <Star className="size-3.5 fill-current" />
                <span className="text-xs font-bold">{instructor.rating.toFixed(1)}</span>
              </div>
            </div>
          </SlideLeft>
        ))}
      </div>
    </SlideBottom>
  )
}
