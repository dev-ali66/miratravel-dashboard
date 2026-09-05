import { faqSectionOrder, faqSectionRegistry } from "./config/faqSections"

export const FaqPreviewShell = () => (
  <>
    {faqSectionOrder.map((key) => {
      const PreviewSection = faqSectionRegistry[key].preview
      return PreviewSection ? <PreviewSection key={key} /> : null
    })}
  </>
)
