import { DynamicStyledField } from "../../../shared/FormControls"
import type { CtaFormSectionProps } from "./sectionTypes"

export const CtaContentForm = ({ data, updateData }: CtaFormSectionProps) => (
  <div className="flex flex-col gap-3">
    <DynamicStyledField
      type="text"
      label="Eyebrow"
      value={data.eyebrow}
      onChange={(value) => updateData({ eyebrow: value })}
      enableStyle
      style={(data as any).eyebrowStyle}
      onStyleChange={(style) => updateData({ eyebrowStyle: style } as any)}
    />
    <DynamicStyledField
      type="text"
      label="Title line 1"
      value={data.titleLine1}
      onChange={(value) => updateData({ titleLine1: value })}
      enableStyle
      style={(data as any).titleLine1Style}
      onStyleChange={(style) => updateData({ titleLine1Style: style } as any)}
    />
    <DynamicStyledField
      type="text"
      label="Highlighted title"
      value={data.titleHighlight}
      onChange={(value) => updateData({ titleHighlight: value })}
      enableStyle
      style={(data as any).titleHighlightStyle}
      onStyleChange={(style) =>
        updateData({ titleHighlightStyle: style } as any)
      }
    />
    <DynamicStyledField
      type="textarea"
      label="Description"
      value={data.description}
      onChange={(value) => updateData({ description: value })}
      enableStyle
      style={(data as any).descriptionStyle}
      onStyleChange={(style) => updateData({ descriptionStyle: style } as any)}
    />
  </div>
)
