import { emptyStoriesCmsHero } from "../sections/hero/emptyStoriesCmsHero"
import { emptyStoriesCmsMiraStories } from "../sections/mira-stories/emptyStoriesCmsMiraStories"
import { emptyStoriesCmsSeoMetadata } from "../sections/seo/emptyStoriesCmsSeoMetadata"

export const emptyStoriesCmsPayload = {
  name: "Stories CMS",
  slug: "stories",
  page: "stories",
  metadata: {
    ...emptyStoriesCmsSeoMetadata,
    seo: emptyStoriesCmsSeoMetadata,
  },
  data: {
    page: "stories",
    hero: emptyStoriesCmsHero,
    mira_stories: emptyStoriesCmsMiraStories,
  },
}
