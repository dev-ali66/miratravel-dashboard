import { emptyHero } from "../sections/hero/emptyHero"
import { emptyProcess } from "../sections/process/emptyProcess"
import { emptyInquiryForm } from "../sections/inquiry-form/emptyInquiryForm"
import { emptyPlanTravel } from "../sections/plan-travel/emptyPlanTravel"
import { emptyContactInfo } from "../sections/contact-info/emptyContactInfo"
import { emptyCta } from "../sections/cta/emptyCta"
import { emptySeoMetadata } from "../sections/seo/emptySeoMetadata"

export const emptyContactPayload = {
  name: "Contact Us",
  slug: "contact-us",
  metadata: {
    title: emptySeoMetadata.title,
    description: emptySeoMetadata.description,
    keywords: emptySeoMetadata.keywords,
    canonicalUrl: emptySeoMetadata.canonicalUrl,
    ogTitle: emptySeoMetadata.title,
    ogDescription: emptySeoMetadata.description,
    ogImage: "",
    robots: {
      index: emptySeoMetadata.robots.index,
      follow: emptySeoMetadata.robots.follow,
    },
  },
  data: {
    page: "contact-us",
    hero: emptyHero,
    process: emptyProcess,
    inquiry_form: emptyInquiryForm,
    plan_travel: emptyPlanTravel,
    contact_info: emptyContactInfo,
    cta: emptyCta,
    seo: emptySeoMetadata,
  },
}
