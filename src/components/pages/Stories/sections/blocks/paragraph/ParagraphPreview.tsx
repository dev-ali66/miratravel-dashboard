import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview";

export function ParagraphPreview({ block }: { block: any }) {
  const hasTitle = Boolean(block.title?.value);
  const hasContent = Boolean(block.content?.value);
  if (!hasTitle && !hasContent) return null;

  return (
    <div className="flex flex-col gap-4">
      {hasTitle && (
        <DynamicStyledTextPreview
          as="h3"
          data={block.title}
          className="w-full text-left font-serif text-xl md:text-2xl lgx:text-3xl font-semibold text-stone-900 tracking-tight"
        />
      )}
      {hasContent && (
        <div className="w-full text-left text-base md:text-[17px] xlg:text-[18px] xl:text-[20px] font-normal text-[#4A4A4A] leading-7 md:leading-[30px] xlg:leading-[32px] xl:leading-9 tracking-[1px] md:tracking-[1.5px] lgx:tracking-[1.7px] xl:tracking-[2px]">
          <DynamicStyledTextPreview data={block.content} isRichText={true} />
        </div>
      )}
    </div>
  );
}

export default ParagraphPreview;
