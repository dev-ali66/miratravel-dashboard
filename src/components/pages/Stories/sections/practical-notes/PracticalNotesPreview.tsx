import type { StoryData } from "../../config/storyTypes"
import { emptyPracticalNotes } from "./emptyPracticalNotes"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

export function PracticalNotesPreview({ story }: { story: StoryData }) {
  const notes = story?.practicalNotes || emptyPracticalNotes
  const title = notes.title || emptyPracticalNotes.title
  const subtitle = notes.subtitle || emptyPracticalNotes.subtitle
  const items = Array.isArray(notes.items) ? notes.items : []

  const hasContent = Boolean(title?.value || subtitle?.value || items.length > 0)

  if (!hasContent) return null

  return (
    <section className="w-full xl:pb-[84px] lgx:pb-[74px] md:pb-[60px] pb-10 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1360px]">
        <div className="mx-auto w-full max-w-[700px] border-l-[3px] border-[#B3884D] bg-[#F7F7F7] p-6 md:p-9 lgx:p-10 lg:p-11 shadow-sm">
          {subtitle?.value && (
            <div className="text-[11px] md:text-[12px] xl:text-[13px] font-bold uppercase tracking-[1px] text-[#B3884D] mb-1">
              <DynamicStyledTextPreview data={subtitle} />
            </div>
          )}

          {title?.value && (
            <DynamicStyledTextPreview
              as="h3"
              data={title}
              className="font-serif text-[18px] md:text-xl lgx:text-[22px] xl:text-[24px] font-medium text-stone-900 tracking-[0.6px] md:tracking-[0.8px]"
            />
          )}

          {items.length > 0 && (
            <div className="mt-5 md:mt-6 lgx:mt-7 xl:mt-8 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="flex flex-col items-start gap-1 md:gap-1.5">
                  <span className="text-[11px] md:text-[12px] xl:text-[13px] font-bold uppercase tracking-[0.8px] md:tracking-[1.2px] text-[#B3884D]">
                    {typeof item.category === "string" ? item.category : item.category?.value || "LOGISTICS"}
                  </span>

                  {item.title?.value && (
                    <DynamicStyledTextPreview
                      as="span"
                      data={item.title}
                      className="text-sm md:text-[15px] font-semibold text-stone-900"
                    />
                  )}

                  {item.description?.value && (
                    <div className="text-sm md:text-[15px] xl:text-base font-normal text-stone-600 leading-[20px] md:leading-[22px] xl:leading-[26px] tracking-[0.2px]">
                      <DynamicStyledTextPreview data={item.description} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PracticalNotesPreview
