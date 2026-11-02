import { UniversalFaqPreview } from "@/components/pages/CMS/shared/UniversalFaqPreview"
import type { LocationPreviewSectionProps } from "../../config/locationSections"

export function FaqPreview(props: LocationPreviewSectionProps) {
  return <UniversalFaqPreview {...props} sectionKey="faq" />
}

export default FaqPreview
