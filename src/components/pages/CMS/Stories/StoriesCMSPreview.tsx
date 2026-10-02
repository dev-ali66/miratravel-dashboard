import { useCmsDraft } from "../shared/CmsDraftContext"
import { normalizeStoriesCmsPayload } from "./config/normalizeStoriesCmsPayload"
import { StoriesCmsHeroPreview } from "./sections/hero/StoriesCmsHeroPreview"
import { StoriesCmsMiraStoriesPreview } from "./sections/mira-stories/StoriesCmsMiraStoriesPreview"

export function StoriesCMSPreview() {
  const page = useCmsDraft<any>()
  const normalizedDraft = normalizeStoriesCmsPayload(page)

  return (
    <div className="w-full bg-background text-foreground antialiased min-h-screen">
      <StoriesCmsHeroPreview draft={normalizedDraft} />
      <StoriesCmsMiraStoriesPreview draft={normalizedDraft} />
    </div>
  )
}

export default StoriesCMSPreview
