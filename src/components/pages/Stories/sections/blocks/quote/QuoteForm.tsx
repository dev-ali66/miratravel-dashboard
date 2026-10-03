import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls";

export interface QuoteFormProps {
  block: any;
  onChange: (patch: any) => void;
  index?: number;
}

export function QuoteForm({ block, onChange, index = 0 }: QuoteFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <DynamicStyledField
        type="text"
        label="Quote Text"
        fieldName={`blocks.${index}.content`}
        placeholder='e.g. "The mountains are not a place to conquer, but a sanctuary..."'
        value={block.content}
        onChange={(val) => onChange({ content: val })}
      />

      <DynamicStyledField
        type="text"
        label="Author / Attribution"
        fieldName={`blocks.${index}.author`}
        placeholder="e.g. — Local Guide in Theth"
        value={block.author}
        onChange={(val) => onChange({ author: val })}
      />
    </div>
  );
}

export default QuoteForm;
