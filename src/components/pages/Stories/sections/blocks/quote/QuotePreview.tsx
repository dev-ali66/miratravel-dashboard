import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview";

export function QuotePreview({ block }: { block: any }) {
  const hasContent = Boolean(block.content?.value);
  const hasAuthor = Boolean(block.author?.value);
  if (!hasContent && !hasAuthor) return null;

  return (
    <div className="w-full py-6 md:py-10 flex flex-col items-center justify-center text-center">
      {hasContent && (
        <div className="w-full max-w-[1139px] text-[#B3884D] font-serif text-[20px] md:text-[26px] lgx:text-[30px] xl:text-[34px] font-semibold italic leading-8 md:leading-[42px] xl:leading-[50px] tracking-[0.5px] md:tracking-[1px] xl:tracking-[1.5px]">
          <DynamicStyledTextPreview data={block.content} />
        </div>
      )}
      {hasAuthor && (
        <div className="mt-3 text-xs md:text-sm font-semibold uppercase tracking-[2px] text-stone-500">
          <DynamicStyledTextPreview data={block.author} />
        </div>
      )}
    </div>
  );
}

export default QuotePreview;
