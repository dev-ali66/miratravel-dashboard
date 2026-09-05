import { useCmsDraft } from "../../../shared/CmsDraftContext"
import { ContactContentPreview } from "../../ContactPreview"
import type { ContactPageData } from "../../contactTypes"

export type ContactPreviewKind =
  | "pageHero"
  | "stepList"
  | "contactForm"
  | "textImageFeature"
  | "infoColumns"
  | "ctaBanner"

export const ContactSectionPreview = ({
  kind: _kind,
}: {
  kind: ContactPreviewKind
}) => {
  useCmsDraft<ContactPageData>()
  return <ContactContentPreview />
}
