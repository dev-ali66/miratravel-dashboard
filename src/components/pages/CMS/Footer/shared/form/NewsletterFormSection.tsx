import { DynamicStyledField } from "../../../shared/FormControls"
import type { FooterFormSectionProps } from "./sectionTypes"

export const NewsletterFormSection = ({ context }: FooterFormSectionProps) => {
  const { content, updateContent } = context
  const newsletter = content.newsletter ?? {}

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DynamicStyledField
          label="Call to Action Text"
          type="text"
          fieldName="footer.newsletter.text"
          value={newsletter.text ?? ""}
          onChange={(val) =>
            updateContent({
              newsletter: { ...newsletter, text: typeof val === "object" ? val.value : val },
            })
          }
        />

        <DynamicStyledField
          label="Link Text"
          type="text"
          fieldName="footer.newsletter.linkText"
          value={newsletter.linkText ?? ""}
          onChange={(val) =>
            updateContent({
              newsletter: { ...newsletter, linkText: typeof val === "object" ? val.value : val },
            })
          }
        />

        <DynamicStyledField
          label="Target URL"
          type="text"
          fieldName="footer.newsletter.url"
          value={newsletter.url ?? ""}
          onChange={(val) =>
            updateContent({
              newsletter: { ...newsletter, url: typeof val === "object" ? val.value : val },
            })
          }
        />
      </div>
    </div>
  )
}

