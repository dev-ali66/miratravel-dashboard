import { emptySubscribe } from "./emptySubscribe"

export function normalizeSubscribe(raw: any) {
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
    title: normalizeStyledText(src.title, emptySubscribe.title),
    subtitle: normalizeStyledText(src.subtitle, emptySubscribe.subtitle),
    leftSideMultimedia: normalizeMultimedia(
      src.leftSideMultimedia || src.backgroundMultimedia || src.image,
      emptySubscribe.leftSideMultimedia
    ),
    backgroundMultimedia: normalizeMultimedia(
      src.backgroundMultimedia,
      emptySubscribe.backgroundMultimedia
    ),
  }
}
