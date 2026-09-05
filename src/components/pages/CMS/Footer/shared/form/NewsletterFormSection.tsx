import type { FooterFormSectionProps } from "./sectionTypes"

export const NewsletterFormSection = ({ context }: FooterFormSectionProps) => {
  const { content, updateContent, TextField } = context

  const newsletter = content.newsletter ?? {}

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold text-foreground">Newsletter</p>

      <div className="flex flex-col gap-3">
        <TextField
          label="Text"
          value={newsletter.text ?? ""}
          onChange={(value) =>
            updateContent({
              newsletter: {
                ...(content.newsletter ?? {}),
                text: value,
              },
            })
          }
        />

        <TextField
          label="Link text"
          value={newsletter.linkText ?? ""}
          onChange={(value) =>
            updateContent({
              newsletter: {
                ...(content.newsletter ?? {}),
                linkText: value,
              },
            })
          }
        />

        <TextField
          label="URL"
          value={newsletter.url ?? ""}
          onChange={(value) =>
            updateContent({
              newsletter: {
                ...(content.newsletter ?? {}),
                url: value,
              },
            })
          }
        />
      </div>
    </div>
  )
}
