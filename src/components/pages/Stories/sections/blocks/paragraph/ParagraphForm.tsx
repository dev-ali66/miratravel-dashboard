import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls";

export interface ParagraphFormProps {
  block: any;
  onChange: (patch: any) => void;
  index?: number;
}

export function ParagraphForm({ block, onChange, index = 0 }: ParagraphFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <DynamicStyledField
        type="text"
        label="Section Sub-Heading (Optional)"
        fieldName={`blocks.${index}.title`}
        placeholder="e.g. Navigating the Alpine Pass"
        value={block.title}
        onChange={(val) => onChange({ title: val })}
      />

      <DynamicStyledField
        type="richtext"
        label="Paragraph Content (RichText)"
        fieldName={`blocks.${index}.content`}
        placeholder="Write your story text..."
        value={block.content}
        onChange={(val) => onChange({ content: val })}
      />
    </div>
  );
}

export default ParagraphForm;
