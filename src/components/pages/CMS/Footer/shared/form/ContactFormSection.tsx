import { DynamicStyledField } from "../../../shared/FormControls"
import type { FooterFormSectionProps } from "./sectionTypes"

export const ContactFormSection = ({ context }: FooterFormSectionProps) => {
  const { content, updateContent } = context
  const contact = content.contact ?? {}

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DynamicStyledField
          label="Contact Title"
          type="text"
          fieldName="footer.contact.title"
          value={contact.title ?? ""}
          onChange={(val) =>
            updateContent({
              contact: { ...contact, title: typeof val === "object" ? val.value : val },
            })
          }
        />

        <DynamicStyledField
          label="Email Address"
          type="text"
          fieldName="footer.contact.email"
          value={contact.email ?? ""}
          onChange={(val) =>
            updateContent({
              contact: { ...contact, email: typeof val === "object" ? val.value : val },
            })
          }
        />

        <DynamicStyledField
          label="Phone Number"
          type="text"
          fieldName="footer.contact.phone"
          value={contact.phone ?? ""}
          onChange={(val) =>
            updateContent({
              contact: { ...contact, phone: typeof val === "object" ? val.value : val },
            })
          }
        />

        <DynamicStyledField
          label="Physical Address"
          type="textarea"
          rows={2}
          fieldName="footer.contact.address"
          value={contact.address ?? ""}
          onChange={(val) =>
            updateContent({
              contact: { ...contact, address: typeof val === "object" ? val.value : val },
            })
          }
        />
      </div>
    </div>
  )
}

