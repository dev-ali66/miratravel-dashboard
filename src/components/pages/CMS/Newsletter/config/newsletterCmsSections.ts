import { SubscribeForm } from "../sections/subscribe/SubscribeForm"
import { UnsubscribeForm } from "../sections/unsubscribe/UnsubscribeForm"
import { NewsletterCmsSeoMetadataForm } from "../sections/seo/NewsletterCmsSeoMetadataForm"

export const newsletterCmsSectionOrder = ["subscribe", "unsubscribe", "seo"] as const
export type NewsletterCmsSectionKey = (typeof newsletterCmsSectionOrder)[number]

export const newsletterCmsSectionRegistry: Record<
  string,
  { label: string; form: any }
> = {
  subscribe: {
    label: "Newsletter Subscribe Section",
    form: SubscribeForm,
  },
  unsubscribe: {
    label: "Newsletter Unsubscribe Section",
    form: UnsubscribeForm,
  },
  seo: {
    label: "SEO & Metadata",
    form: NewsletterCmsSeoMetadataForm,
  },
}
