import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { emptyPlanTravel } from "./emptyPlanTravel"

export function PlanTravelPreview({ section }: { section?: any }) {
  const plan = section || emptyPlanTravel
  const multimedia = plan.leftSideMultimedia || emptyPlanTravel.leftSideMultimedia
  const backgroundMultimedia =
    plan.backgroundMultimedia || emptyPlanTravel.backgroundMultimedia

  return (
    <div
      data-section="plan-travel"
      className="relative w-full overflow-hidden bg-neutral-100 py-16 px-6 md:px-12"
    >
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        mode="background"
      />
      <div className="relative z-10 mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left: Featured Image */}
        <div className="lg:col-span-6 relative flex flex-col min-h-[380px] h-full w-full rounded-lg overflow-hidden shadow-md bg-neutral-300">
          <UniversalMultimediaPreview
            multimedia={multimedia}
            className="h-full w-full object-cover"
            containerClassName="h-full w-full flex-1 flex flex-col"
          />
        </div>

        {/* Right: Content Block */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
          {plan.label && (
            <span className="text-xs uppercase tracking-widest text-amber-700 font-medium">
              <DynamicStyledTextPreview as="span" data={plan.label} />
            </span>
          )}

          <h2 className="font-serif text-3xl font-semibold text-emerald-950">
            <DynamicStyledTextPreview as="span" data={plan.title} />
          </h2>

          <DynamicStyledTextPreview
            as="div"
            isRichText
            className="text-sm leading-relaxed text-neutral-700 space-y-3"
            data={plan.description || plan.titlegraphs}
          />
        </div>
      </div>
    </div>
  )
}

export default PlanTravelPreview
