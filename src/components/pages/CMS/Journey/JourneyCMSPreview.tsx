import { useCmsDraft } from "../shared/CmsDraftContext"
import { normalizeJourneyCmsPayload } from "./config/normalizeJourneyCmsPayload"
import { JourneyCmsHeroPreview } from "./sections/hero/JourneyCmsHeroPreview"
import { JourneyCmsEditorialHighlightPreview } from "./sections/editorial-highlight/JourneyCmsEditorialHighlightPreview"
import { JourneyCmsSignatureJourneysPreview } from "./sections/signature-journeys/JourneyCmsSignatureJourneysPreview"
import { JourneyCmsAllJourneysPreview } from "./sections/all-journeys/JourneyCmsAllJourneysPreview"

export function JourneyCMSPreview() {
  const page = useCmsDraft<any>()
  const normalizedDraft = normalizeJourneyCmsPayload(page)

  return (
    <div className="w-full bg-background text-foreground antialiased min-h-screen">
      <JourneyCmsHeroPreview draft={normalizedDraft} />
      <JourneyCmsEditorialHighlightPreview draft={normalizedDraft} />
      <JourneyCmsSignatureJourneysPreview draft={normalizedDraft} />
      <JourneyCmsAllJourneysPreview draft={normalizedDraft} />
    </div>
  )
}

export default JourneyCMSPreview
