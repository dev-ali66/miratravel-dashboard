import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

export function NotesPreview({ block }: { block: any }) {
  const items: any[] = Array.isArray(block.items) ? block.items : []

  return (
    <div className="w-full py-8 flex flex-col gap-8">
      {/* Main Section Heading */}
      {block.title?.value && (
        <div className="flex flex-col gap-1">
          <DynamicStyledTextPreview
            as="h3"
            data={block.title}
            className="font-serif text-3xl md:text-4xl font-normal text-[#B3884D] tracking-tight"
          />
          {block.subtitle?.value && (
            <div className="text-sm text-stone-500 dark:text-stone-400">
              <DynamicStyledTextPreview data={block.subtitle} />
            </div>
          )}
        </div>
      )}

      {/* 2-Column Note Cards Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 w-full items-start">
          {items.map((item: any, idx: number) => (
            <div key={idx} className="flex flex-col gap-2 min-w-0">
              {item.title && (
                <h4 className="font-serif text-lg md:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                  {item.title}
                </h4>
              )}
              {item.content && (
                <div className="text-xs md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal prose prose-stone max-w-none [&_strong]:text-stone-800 dark:[&_strong]:text-stone-200 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-1">
                  <DynamicStyledTextPreview
                    data={{ value: item.content }}
                    isRichText={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotesPreview
