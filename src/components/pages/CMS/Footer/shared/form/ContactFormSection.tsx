import type { FooterFormSectionProps } from "./sectionTypes"

export const ContactFormSection = ({ context }: FooterFormSectionProps) => {
  const { content, updateContent, TextField, TextAreaField } = context

  const contact = content.contact ?? {}

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold text-foreground">Contact</p>

      <div className="flex flex-col gap-3">
        <TextField
          label="Title"
          value={contact.title ?? ""}
          onChange={(value) =>
            updateContent({
              contact: {
                ...(content.contact ?? {}),
                title: value,
              },
            })
          }
        />

        <TextField
          label="Email"
          value={contact.email ?? ""}
          onChange={(value) =>
            updateContent({
              contact: {
                ...(content.contact ?? {}),
                email: value,
              },
            })
          }
        />

        <TextField
          label="Phone"
          value={contact.phone ?? ""}
          onChange={(value) =>
            updateContent({
              contact: {
                ...(content.contact ?? {}),
                phone: value,
              },
            })
          }
        />

        <TextAreaField
          label="Address"
          value={contact.address ?? ""}
          onChange={(value) =>
            updateContent({
              contact: {
                ...(content.contact ?? {}),
                address: value,
              },
            })
          }
        />
      </div>
    </div>
  )
}
