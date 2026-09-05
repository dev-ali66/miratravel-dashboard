import type { CtaPageData } from "../../ctaTypes"

export type CtaFormSectionProps = {
  data: CtaPageData["data"]
  updateData: (patch: Partial<CtaPageData["data"]>) => void
}
