import { UniversalFaqPreview } from "@/components/pages/CMS/shared/UniversalFaqPreview"
import type { ExperiencePreviewSectionProps } from "../../config/experienceSections"

export function FaqPreview(props: ExperiencePreviewSectionProps) {
  return <UniversalFaqPreview {...props} sectionKey="faq" />
}

export default FaqPreview
