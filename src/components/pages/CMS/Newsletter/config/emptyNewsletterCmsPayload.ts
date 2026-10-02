import { emptyNewsletterCmsHero } from "../sections/hero/emptyNewsletterCmsHero"
import { emptyNewsletterCmsSeoMetadata } from "../sections/seo/emptyNewsletterCmsSeoMetadata"

export const emptyNewsletterCmsPayload = {
  name: "Newsletter CMS",
  slug: "newsletter",
  page: "newsletter",
  metadata: {
    ...emptyNewsletterCmsSeoMetadata,
    seo: emptyNewsletterCmsSeoMetadata,
  },
  data: {
    page: "newsletter",
    hero: emptyNewsletterCmsHero,
  },
}
