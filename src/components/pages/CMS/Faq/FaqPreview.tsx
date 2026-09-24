import { useCmsDraft } from "../shared/CmsDraftContext"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { getDefaultCmsPageData } from "../shared/defaultCmsData"
import { FooterPreview } from "../Footer/FooterPreview"
import type { FooterPageData } from "../Footer/footerTypes"

import { HeroPreview } from "./sections/hero/HeroPreview"
import { FaqListPreview } from "./sections/faq-list/FaqListPreview"
import { FaqCtaPreview } from "./sections/cta/FaqCtaPreview"

import { normalizeFaqPayload } from "./config/normalizeFaqPayload"

export function FaqPreview() {
  const draftPage = useCmsDraft<any>()
  const normalizedPage = normalizeFaqPayload(draftPage)
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
      {/* 1. FAQ Hero */}
      <div data-section="hero" className="w-full">
        <HeroPreview section={data.hero} />
      </div>

      {/* 2. FAQ List / Categories & Accordion */}
      <div data-section="faq_list" className="w-full">
        <FaqListPreview section={data.faq_list} />
      </div>

      {/* 3. Bottom Note CTA */}
      <div data-section="cta" className="w-full">
        <FaqCtaPreview section={data.cta} />
      </div>

      {/* 4. Footer Preview */}
      <FooterPreview footerData={footerData} />
    </div>
  )
}

export default FaqPreview
