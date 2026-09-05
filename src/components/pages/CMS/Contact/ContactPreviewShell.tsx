import {
  contactPreviewSectionOrder,
  contactPreviewSectionRegistry,
} from "./config/contactPreviewSections"

export const ContactPreviewShell = () => (
  <>
    {contactPreviewSectionOrder.map((key) => {
      const PreviewSection = contactPreviewSectionRegistry[key].preview
      return <PreviewSection key={key} />
    })}
  </>
)
