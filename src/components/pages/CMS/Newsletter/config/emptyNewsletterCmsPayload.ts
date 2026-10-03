import { emptySubscribe } from "../sections/subscribe/emptySubscribe"
import { emptyNewsletterCmsUnsubscribe } from "../sections/unsubscribe/emptyUnsubscribe"
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
    subscribe: emptySubscribe,
    unsubscribe: emptyNewsletterCmsUnsubscribe,
  },
}
