import { useCmsDraft } from "../shared/CmsDraftContext"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { getDefaultCmsPageData } from "../shared/defaultCmsData"
import { FooterPreview } from "../Footer/FooterPreview"
import type { FooterPageData } from "../Footer/footerTypes"

import { HeroPreview } from "./sections/hero/HeroPreview"
import { PhilosophyPreview } from "./sections/philosophy/PhilosophyPreview"
import { ApproachPreview } from "./sections/approach/ApproachPreview"
import { RegionalKnowledgePreview } from "./sections/regional-knowledge/RegionalKnowledgePreview"
import { PeoplePreview } from "./sections/people/PeoplePreview"
import { StandardPreview } from "./sections/standard/StandardPreview"
import { StayPreview } from "./sections/stay/StayPreview"
import { CtaPreview } from "./sections/cta/CtaPreview"

import { normalizeAboutPayload } from "./config/normalizeAboutPayload"

export function AboutPreview() {
  const draftPage = useCmsDraft<any>()
  const normalizedPage = normalizeAboutPayload(draftPage)
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

      <div data-section="philosophy" className="w-full">
        <PhilosophyPreview section={data.philosophy} />
      </div>

      <div data-section="approach" className="w-full">
        <ApproachPreview section={data.approach} />
      </div>

      <div data-section="regional_knowledge" className="w-full">
        <RegionalKnowledgePreview section={data.regional_knowledge} />
      </div>

      <div data-section="people" className="w-full">
        <PeoplePreview section={data.people} />
      </div>

      <div data-section="standard" className="w-full">
        <StandardPreview section={data.standard} />
      </div>

      <div data-section="stay" className="w-full">
        <StayPreview section={data.stay} />
      </div>

      <div data-section="cta" className="w-full">
        <CtaPreview section={data.cta} />
      </div>

      {/* Footer Preview */}
      <FooterPreview footerData={footerData} />
    </div>
  )
}

export default AboutPreview
