import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview";

export function ParagraphPreview({ block }: { block: any }) {
  const hasContent = Boolean(block.content?.value);
  if (!hasContent) return null;

  return (
    <div className="w-full text-left text-base md:text-[17px] xlg:text-[18px] xl:text-[20px] font-normal text-body leading-7 md:leading-[30px] xlg:leading-[32px] xl:leading-9 tracking-[1px] md:tracking-[1.5px] lgx:tracking-[1.7px] xl:tracking-[2px]">
      <DynamicStyledTextPreview data={block.content} isRichText={true} />
    </div>
  );
}

export default ParagraphPreview;
