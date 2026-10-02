import { useCmsDraft } from "../shared/CmsDraftContext"
import { normalizeNewsletterCmsPayload } from "./config/normalizeNewsletterCmsPayload"
import { NewsletterCmsHeroPreview } from "./sections/hero/NewsletterCmsHeroPreview"

export function NewsletterCMSPreview() {
  const page = useCmsDraft<any>()
  const normalizedDraft = normalizeNewsletterCmsPayload(page)

  return (
    <div className="w-full bg-background text-foreground antialiased min-h-screen">
      <NewsletterCmsHeroPreview draft={normalizedDraft} />
    </div>
  )
}

export default NewsletterCMSPreview
