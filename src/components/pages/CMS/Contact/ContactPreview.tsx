import { useCmsDraft } from "../shared/CmsDraftContext"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { getDefaultCmsPageData } from "../shared/defaultCmsData"
import { FooterPreview } from "../Footer/FooterPreview"
import type { FooterPageData } from "../Footer/footerTypes"

import { HeroPreview } from "./sections/hero/HeroPreview"
import { ProcessPreview } from "./sections/process/ProcessPreview"
import { InquiryPreviewSection } from "./sections/inquiry-form/InquiryPreviewSection"
import { PlanTravelPreview } from "./sections/plan-travel/PlanTravelPreview"
import { ContactInfoPreview } from "./sections/contact-info/ContactInfoPreview"
import { CtaPreview } from "./sections/cta/CtaPreview"

import { normalizeContactPayload } from "./config/normalizeContactPayload"

export function ContactPreview() {
  const draftPage = useCmsDraft<any>()
  const normalizedPage = normalizeContactPayload(draftPage)
  const data = normalizedPage?.data || {}

  const { data: footerCmsData } = useGetCmsBySlug("footer")
  const fetchedFooter = footerCmsData?.data
  const footerData = (
    fetchedFooter && (fetchedFooter.data?.theme || fetchedFooter.data?.content)
      ? fetchedFooter
      : getDefaultCmsPageData("footer", "Footer")
  ) as unknown as FooterPageData

  return (
    <div className="w-full overflow-hidden bg-background">
      <div data-section="hero" className="w-full">
        <HeroPreview section={data.hero} />
      </div>

      <div data-section="process" className="w-full">
        <ProcessPreview section={data.process} />
      </div>

      <div data-section="inquiry-form" className="w-full">
        <InquiryPreviewSection section={data.inquiry_form} />
      </div>

      <div data-section="plan-travel" className="w-full">
        <PlanTravelPreview section={data.plan_travel} />
      </div>

      <div data-section="contact-info" className="w-full">
        <ContactInfoPreview section={data.contact_info} />
      </div>

      <div data-section="cta" className="w-full">
        <CtaPreview section={data.cta} />
      </div>

      {/* Footer Preview */}
      <FooterPreview footerData={footerData} />
    </div>
  )
}

export default ContactPreview
