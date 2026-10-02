import { emptyNewsletterCmsHero } from "./emptyNewsletterCmsHero"

export function normalizeNewsletterCmsHero(raw: any) {
  const src = raw && typeof raw === "object" ? raw : {}

  const normalizeStyledText = (val: any, fallback: any) => {
    if (typeof val === "string") return { ...fallback, value: val }
    if (val && typeof val === "object") return { ...fallback, ...val }
    return fallback
  }

  return {
    title: normalizeStyledText(src.title, emptyNewsletterCmsHero.title),
    subtitle: normalizeStyledText(src.subtitle, emptyNewsletterCmsHero.subtitle),
    emailLabel: normalizeStyledText(src.emailLabel, emptyNewsletterCmsHero.emailLabel),
    buttonText: typeof src.buttonText === "string" ? src.buttonText : emptyNewsletterCmsHero.buttonText,
    inputPlaceholder:
      typeof src.inputPlaceholder === "string"
        ? src.inputPlaceholder
        : emptyNewsletterCmsHero.inputPlaceholder,
    image: {
      ...emptyNewsletterCmsHero.image,
      ...(src.image && typeof src.image === "object" ? src.image : {}),
      url:
        src.image?.url ||
        src.backgroundMultimedia?.image?.url ||
        emptyNewsletterCmsHero.image.url,
    },
    backgroundMultimedia: {
      ...emptyNewsletterCmsHero.backgroundMultimedia,
      ...(src.backgroundMultimedia && typeof src.backgroundMultimedia === "object"
        ? src.backgroundMultimedia
        : {}),
      image: {
        ...emptyNewsletterCmsHero.backgroundMultimedia.image,
        ...(src.backgroundMultimedia?.image || {}),
        url:
          src.backgroundMultimedia?.image?.url ||
          src.image?.url ||
          emptyNewsletterCmsHero.backgroundMultimedia.image.url,
      },
    },
    links: {
      exploreJourneys: {
        ...emptyNewsletterCmsHero.links.exploreJourneys,
        ...(src.links?.exploreJourneys || {}),
      },
      returnHome: {
        ...emptyNewsletterCmsHero.links.returnHome,
        ...(src.links?.returnHome || {}),
      },
    },
  }
}
