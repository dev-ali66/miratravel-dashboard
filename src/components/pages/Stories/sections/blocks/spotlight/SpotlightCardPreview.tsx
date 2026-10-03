import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"

export function SpotlightCardPreview({ block }: { block: any }) {
  const isMultiple = Array.isArray(block.items) && block.items.length > 0
  const items = isMultiple ? block.items : [block.multimedia]
  const isRight = block.mediaPosition === "right"

  return (
    <div
      className={`w-full py-4 flex flex-col gap-8 items-center ${
        isRight ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <div className="w-full md:w-1/2 flex flex-col gap-3 shrink-0">
        {isMultiple ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {items.map((item: any, itemIdx: number) => (
              <div key={itemIdx} className="overflow-hidden rounded-xl aspect-[4/3] w-full border border-stone-200">
                <UniversalMultimediaPreview
                  multimedia={item}
                  mode="inline"
                  className="w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full overflow-hidden rounded-xl aspect-[4/3] border border-stone-200">
            <UniversalMultimediaPreview
              multimedia={block.multimedia}
              mode="inline"
              className="w-full h-full"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 flex-1">
        {block.title?.value && (
          <DynamicStyledTextPreview
            as="h4"
            data={block.title}
            className="font-serif text-xl md:text-2xl font-bold text-[#B3884D]"
          />
        )}
        {block.content?.value && (
          <div className="text-base md:text-[17px] font-normal text-stone-700 leading-relaxed">
            <DynamicStyledTextPreview data={block.content} isRichText={true} />
          </div>
        )}
      </div>
    </div>
  )
}
