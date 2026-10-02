import { StoriesCmsHeroForm } from "../sections/hero/StoriesCmsHeroForm"
import { StoriesCmsMiraStoriesForm } from "../sections/mira-stories/StoriesCmsMiraStoriesForm"
import { StoriesCmsSeoMetadataForm } from "../sections/seo/StoriesCmsSeoMetadataForm"

export const storiesCmsSectionOrder = ["hero", "mira_stories", "seo"] as const
export type StoriesCmsSectionKey = (typeof storiesCmsSectionOrder)[number]

export const storiesCmsSectionRegistry: Record<
  StoriesCmsSectionKey,
  { label: string; form: any }
> = {
  hero: {
    label: "Hero Section",
    form: StoriesCmsHeroForm,
  },
  mira_stories: {
    label: "Mira Stories",
    form: StoriesCmsMiraStoriesForm,
  },
  seo: {
    label: "SEO & Metadata",
    form: StoriesCmsSeoMetadataForm,
  },
}
