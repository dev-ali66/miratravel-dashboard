import { Compass } from "lucide-react"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

export function GuidancePreview({ block }: { block: any }) {
  const isRight = block.mediaPosition === "right"
  const experiences: string[] = Array.isArray(block.experiences) ? block.experiences : []

  return (
    <div
      className={`w-full py-6 flex flex-col gap-8 items-start ${
        isRight ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Media Side */}
      <div className="w-full md:w-5/12 shrink-0">
        <div className="w-full overflow-hidden rounded-xl aspect-[4/3] border border-stone-200/70 shadow-2xs">
          <UniversalMultimediaPreview
            multimedia={block.multimedia}
            mode="inline"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content Side */}
      <div className="flex flex-col gap-5 flex-1 min-w-0">
        {/* Heading */}
        {block.title?.value && (
          <DynamicStyledTextPreview
            as="h3"
            data={block.title}
            className="font-serif text-2xl md:text-3xl font-normal text-stone-900 dark:text-stone-100 tracking-tight"
          />
        )}

        {/* Lead Narrative Description */}
        {block.content?.value && (
          <div className="text-xs md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            <DynamicStyledTextPreview data={block.content} isRichText={true} />
          </div>
        )}

        {/* Essential Experiences Section */}
        {experiences.length > 0 && (
          <div className="flex flex-col gap-2.5 pt-1">
            <div className="border-l-2 border-[#B3884D] pl-3 py-0.5">
              <DynamicStyledTextPreview
                data={block.experiencesTitle}
                className="text-[11px] font-bold tracking-wider text-[#B3884D] uppercase"
              />
            </div>
            <ul className="flex flex-col gap-2 pl-3">
              {experiences.map((exp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-stone-700 dark:text-stone-300 leading-normal">
                  <span className="text-[#B3884D] font-bold text-sm shrink-0 leading-none mt-0.5">•</span>
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Local Knowledge Box */}
        {(block.knowledgeTitle?.value || block.knowledgeContent?.value) && (
          <div className="rounded-xl bg-stone-100/90 dark:bg-stone-800/60 p-4 border border-stone-200/60 dark:border-stone-700/50 flex flex-col gap-2 mt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-stone-800 dark:text-stone-200 uppercase">
              <Compass className="h-3.5 w-3.5 text-[#B3884D] shrink-0" />
              <DynamicStyledTextPreview data={block.knowledgeTitle} />
            </div>
            {block.knowledgeContent?.value && (
              <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                <DynamicStyledTextPreview data={block.knowledgeContent} isRichText={true} />
              </div>
            )}
          </div>
        )}

        {/* Route / Transport Info Footnote */}
        {block.routeInfo?.value && (
          <div className="text-xs text-stone-600 dark:text-stone-400 font-medium pt-1">
            <DynamicStyledTextPreview data={block.routeInfo} />
          </div>
        )}
      </div>
    </div>
  )
}

export default GuidancePreview
