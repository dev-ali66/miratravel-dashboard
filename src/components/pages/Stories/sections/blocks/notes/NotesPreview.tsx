import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"

export function NotesPreview({ block }: { block: any }) {
  const items: any[] = Array.isArray(block?.items) ? block.items : []
  const headerData = block?.description || block?.title
  const hasHeaderText = Boolean(
    headerData?.value &&
      String(headerData.value).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length > 0
  )
  const hasContent = Boolean(hasHeaderText || items.length > 0)

  if (!hasContent) return null

  return (
    <div className="w-full py-6 md:py-8 flex flex-col gap-6">
      {/* Main Section Header (RichText) */}
      {hasHeaderText && (
        <div className="w-full prose prose-stone max-w-none text-foreground font-serif text-2xl md:text-3xl font-medium tracking-tight [&_p]:my-1 [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl">
          <DynamicStyledTextPreview
            data={headerData}
            isRichText={true}
          />
        </div>
      )}

      {/* 2-Column Note Cards Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 w-full items-stretch">
          {items.map((item: any, idx: number) => {
            const rawDesc = item.description || (item.content ? { value: item.content } : null)
            const cleanText =
              typeof rawDesc?.value === "string"
                ? rawDesc.value
                    .replace(/<[^>]*>/g, "")
                    .replace(/&nbsp;/g, " ")
                    .trim()
                : ""

            return (
              <div
                key={idx}
                className="flex flex-col items-start justify-start w-full h-full min-h-[140px] md:min-h-[160px] rounded-lg border border-border/60 bg-card p-4 md:p-5 shadow-2xs transition-all"
              >
                {cleanText ? (
                  <div className="text-xs md:text-sm text-muted-foreground leading-relaxed font-normal prose prose-stone max-w-none [&_strong]:text-foreground [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-1 w-full">
                    <DynamicStyledTextPreview
                      data={rawDesc}
                      isRichText={true}
                    />
                  </div>
                ) : (
                  <div className="text-xs md:text-sm text-muted-foreground/40 italic font-normal leading-relaxed select-none">
                    Add practical advice or recommendation details...
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NotesPreview
