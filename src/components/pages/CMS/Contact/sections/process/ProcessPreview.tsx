import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { emptyProcess } from "./emptyProcess"

export function ProcessPreview({ section }: { section?: any }) {
  const process = section || emptyProcess
  const items = Array.isArray(process.items)
    ? process.items
    : Array.isArray(process.steps)
      ? process.steps
      : emptyProcess.items

  const backgroundMultimedia =
    process.backgroundMultimedia ||
    (process as any).multimedia ||
    emptyProcess.backgroundMultimedia

  return (
    <div
      data-section="process"
      className="relative w-full overflow-hidden py-16 px-6 md:px-12 bg-[#F5F5F5]"
    >
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        mode="background"
      />
      <div className="relative z-10 mx-auto max-w-6xl space-y-12">
        <h2 className="text-center font-serif text-2xl font-medium tracking-widest text-emerald-950 uppercase md:text-3xl">
          <DynamicStyledTextPreview as="span" data={process.title} />
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item: any, idx: number) => {
            const stepBadge = String(idx + 1).padStart(2, "0")
            return (
              <div key={idx} className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                  {stepBadge}
                </span>
                <h3 className="font-serif text-xl font-semibold text-neutral-900 tracking-wide">
                  <DynamicStyledTextPreview as="span" data={item.title} />
                </h3>
                <div className="h-[2px] w-8 bg-emerald-800" />
                <DynamicStyledTextPreview
                  as="p"
                  className="text-sm leading-relaxed text-neutral-600"
                  data={item.description}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProcessPreview

