import { JourneyCmsHeroForm, JourneyCmsHeroPreview } from "../sections/hero"
import { JourneyCmsEditorialHighlightForm, JourneyCmsEditorialHighlightPreview } from "../sections/editorial-highlight"
import { JourneyCmsSignatureJourneysForm, JourneyCmsSignatureJourneysPreview } from "../sections/signature-journeys"
import { JourneyCmsAllJourneysForm, JourneyCmsAllJourneysPreview } from "../sections/all-journeys"
import { JourneyCmsSeoMetadataForm } from "../sections/seo"

export const JOURNEY_CMS_SECTIONS = [
  {
    key: "hero",
    label: "Journey CMS Hero Banner",
    formComponent: JourneyCmsHeroForm,
    previewComponent: JourneyCmsHeroPreview,
  },
  {
    key: "editorial_highlight",
    label: "Journey CMS Editorial Highlight Statement",
    formComponent: JourneyCmsEditorialHighlightForm,
    previewComponent: JourneyCmsEditorialHighlightPreview,
  },
  {
    key: "signature_journeys",
    label: "Journey CMS Signature Journeys",
    formComponent: JourneyCmsSignatureJourneysForm,
    previewComponent: JourneyCmsSignatureJourneysPreview,
  },
  {
    key: "all_journeys",
    label: "Journey CMS All Journeys Section",
    formComponent: JourneyCmsAllJourneysForm,
    previewComponent: JourneyCmsAllJourneysPreview,
  },
  {
    key: "seo",
    label: "Journey CMS SEO & Metadata",
    formComponent: JourneyCmsSeoMetadataForm,
    previewComponent: () => null,
  },
]
