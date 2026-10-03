import { emptyNewsletterCmsUnsubscribe } from "./emptyUnsubscribe"

export function normalizeNewsletterCmsUnsubscribe(raw: any) {
  const src = raw && typeof raw === "object" ? raw : {}

  const normalizeStyledText = (val: any, fallback: any) => {
    if (typeof val === "string") return { ...fallback, value: val }
    if (val && typeof val === "object") return { ...fallback, ...val }
    return fallback
  }

  const normalizeMultimedia = (val: any, fallback: any) => {
    const obj = val && typeof val === "object" ? val : {}
    return {
      ...fallback,
      ...obj,
      color: {
        ...fallback.color,
        ...(obj.color || {}),
      },
      image: {
        ...fallback.image,
        ...(obj.image || {}),
        url: obj.image?.url ?? fallback.image?.url ?? "",
      },
      video: {
        ...fallback.video,
        ...(obj.video || {}),
        url: obj.video?.url ?? fallback.video?.url ?? "",
      },
    }
  }

  return {
    title: normalizeStyledText(src.title, emptyNewsletterCmsUnsubscribe.title),
    unsubscribedTitle: normalizeStyledText(
      src.unsubscribedTitle || src.successTitle,
      emptyNewsletterCmsUnsubscribe.unsubscribedTitle
    ),
    subtitle: normalizeStyledText(src.subtitle, emptyNewsletterCmsUnsubscribe.subtitle),
    unsubscribedSubtitle: normalizeStyledText(
      src.unsubscribedSubtitle || src.successSubtitle,
      emptyNewsletterCmsUnsubscribe.unsubscribedSubtitle
    ),
    reasonsTitle: normalizeStyledText(
      src.reasonsTitle || src.reasonsLabel,
      emptyNewsletterCmsUnsubscribe.reasonsTitle
    ),
    reasonsList: Array.isArray(src.reasonsList)
      ? src.reasonsList
      : emptyNewsletterCmsUnsubscribe.reasonsList,
    leftSideMultimedia: normalizeMultimedia(
      src.leftSideMultimedia || src.image,
      emptyNewsletterCmsUnsubscribe.leftSideMultimedia
    ),
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia,
      emptyNewsletterCmsUnsubscribe.backgroundMultimedia
    ),
  }
}
