import { NewsletterCmsHeroForm } from "../sections/hero/NewsletterCmsHeroForm"
import { NewsletterCmsSeoMetadataForm } from "../sections/seo/NewsletterCmsSeoMetadataForm"

export const newsletterCmsSectionOrder = ["hero", "seo"] as const
export type NewsletterCmsSectionKey = (typeof newsletterCmsSectionOrder)[number]

export const newsletterCmsSectionRegistry: Record<
  NewsletterCmsSectionKey,
  { label: string; form: any }
> = {
  hero: {
    label: "Newsletter Subscribe Section",
    form: NewsletterCmsHeroForm,
  },
  seo: {
    label: "SEO & Metadata",
    form: NewsletterCmsSeoMetadataForm,
  },
}
