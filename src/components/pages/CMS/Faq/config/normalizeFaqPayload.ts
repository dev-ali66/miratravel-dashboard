import { emptyFaqPayload, emptyFaqHero, emptyFaqList, emptyFaqCta, emptySeoMetadata } from "./emptyFaqPayload"
import { recursivelyReplaceUndefinedWithNull, normalizeButtonsArray } from "@/components/pages/Location/shared/normalizeHelpers"

function normalizeStyledText(fieldRaw: any, fallbackValue: string) {
  if (typeof fieldRaw === "string") {
    return {
      value: fieldRaw,
      textColor: "",
      textOpacity: 1,
      backgroundColor: "",
      backgroundOpacity: 1,
    }
  }
  if (fieldRaw && typeof fieldRaw === "object") {
    return {
      value: fieldRaw.value ?? fallbackValue,
      textColor: fieldRaw.textColor ?? "",
      textOpacity: fieldRaw.textOpacity ?? 1,
      backgroundColor: fieldRaw.backgroundColor ?? "",
      backgroundOpacity: fieldRaw.backgroundOpacity ?? 1,
    }
  }
  return {
    value: fallbackValue,
    textColor: "",
    textOpacity: 1,
    backgroundColor: "",
    backgroundOpacity: 1,
  }
}

function normalizeMultimedia(multimediaRaw: any, fallbackAlt: string) {
  if (!multimediaRaw || typeof multimediaRaw !== "object") {
    return {
      show: "image",
      image: {
        url: "",
        alt: fallbackAlt,
      },
    }
  }
  const showMode = multimediaRaw.show || multimediaRaw.type || "image"
  const imgObj = multimediaRaw.image || multimediaRaw.imageData || {}
  const vidObj = multimediaRaw.video || multimediaRaw.videoData || {}

  return {
    ...multimediaRaw,
    show: showMode,
    image: {
      url: imgObj.url ?? multimediaRaw.url ?? "",
      alt: imgObj.alt ?? multimediaRaw.alt ?? fallbackAlt,
    },
    video: {
      url: vidObj.url ?? "",
      alt: vidObj.alt ?? fallbackAlt,
    },
  }
}

export function normalizeFaqHero(heroRaw: any) {
  const safe = heroRaw && typeof heroRaw === "object" ? heroRaw : {}
  return {
    eyebrow: normalizeStyledText(safe.eyebrow, emptyFaqHero.eyebrow.value),
    title: normalizeStyledText(safe.title, emptyFaqHero.title.value),
    description: normalizeStyledText(safe.description, emptyFaqHero.description.value),
    helpTitle: normalizeStyledText(safe.helpTitle, emptyFaqHero.helpTitle.value),
    helpSubtitle: normalizeStyledText(safe.helpSubtitle, emptyFaqHero.helpSubtitle.value),
    imageMultimedia: normalizeMultimedia(safe.imageMultimedia || safe.multimedia, "Travel guidance and frequently asked questions"),
  }
}

export function normalizeFaqList(listRaw: any) {
  const safe = listRaw && typeof listRaw === "object" ? listRaw : {}
  const rawItems = Array.isArray(safe.items)
    ? safe.items
    : Array.isArray(safe.topics)
    ? safe.topics
    : emptyFaqList.items

  const items = rawItems.map((t: any, i: number) => ({
    id: t.id || `topic-${i + 1}`,
    title: normalizeStyledText(t.title, `Topic ${i + 1}`),
    description: normalizeStyledText(t.description, ""),
    icon: t.icon || "planning",
    questions: Array.isArray(t.questions)
      ? t.questions.map((q: any, j: number) => ({
          id: q.id || `q-${i + 1}-${j + 1}`,
          question: normalizeStyledText(q.question, `Question ${j + 1}`),
          answer: normalizeStyledText(q.answer, ""),
        }))
      : [],
  }))

  const rawAdvice = safe.personalAdvice || safe.advice || {}
  const personalAdvice = {
    title: normalizeStyledText(rawAdvice.title, emptyFaqList.personalAdvice.title.value),
    description: normalizeStyledText(rawAdvice.description, emptyFaqList.personalAdvice.description.value),
    phoneTitle: rawAdvice.phoneTitle ?? emptyFaqList.personalAdvice.phoneTitle,
    phoneValue: rawAdvice.phoneValue ?? emptyFaqList.personalAdvice.phoneValue,
    phoneHref: rawAdvice.phoneHref ?? emptyFaqList.personalAdvice.phoneHref,
    emailTitle: rawAdvice.emailTitle ?? emptyFaqList.personalAdvice.emailTitle,
    emailValue: rawAdvice.emailValue ?? emptyFaqList.personalAdvice.emailValue,
    emailHref: rawAdvice.emailHref ?? emptyFaqList.personalAdvice.emailHref,
    planTitle: rawAdvice.planTitle ?? emptyFaqList.personalAdvice.planTitle,
    planDescription: rawAdvice.planDescription ?? emptyFaqList.personalAdvice.planDescription,
    planHref: rawAdvice.planHref ?? emptyFaqList.personalAdvice.planHref,
    planImageMultimedia: normalizeMultimedia(
      rawAdvice.planImageMultimedia || rawAdvice.planMultimedia,
      "Travel designer"
    ),
  }

  return {
    title: normalizeStyledText(safe.title, emptyFaqList.title.value),
    items,
    topics: items, // compatibility alias
    personalAdvice,
  }
}

export function normalizeFaqCta(ctaRaw: any) {
  const safe = ctaRaw && typeof ctaRaw === "object" ? ctaRaw : {}

  const buttons = normalizeButtonsArray(safe.buttons)
  if (buttons.length === 0 && (safe.ctaLabel || safe.ctaHref)) {
    buttons.push({
      label: safe.ctaLabel || "Contact Our Team",
      url: safe.ctaHref || "/contact-us",
      variant: "PRIMARY",
      style: "primary",
      rounded: "full",
      backgroundColor: "",
      backgroundOpacity: 100,
      textColor: "",
      textOpacity: 100,
      target: "_self",
      showIcon: true,
    })
  }

  const rightSideMultimedia = normalizeMultimedia(
    safe.rightSideMultimedia || safe.imageMultimedia || safe.multimedia,
    "image"
  )

  const backgroundMultimedia = normalizeMultimedia(
    safe.backgroundMultimedia,
    "color"
  )

  return {
    eyebrow: normalizeStyledText(safe.eyebrow, emptyFaqCta.eyebrow.value),
    title: normalizeStyledText(safe.title, emptyFaqCta.title.value),
    description: normalizeStyledText(safe.description, emptyFaqCta.description.value),
    backgroundMultimedia,
    rightSideMultimedia,
    imageMultimedia: rightSideMultimedia, // compatibility alias
    buttons,
  }
}

export function normalizeSeoMetadata(seoRaw: any) {
  const safe = seoRaw && typeof seoRaw === "object" ? seoRaw : {}
  return {
    title: safe.title || safe.metaTitle || emptySeoMetadata.title,
    description: safe.description || safe.metaDescription || emptySeoMetadata.description,
    keywords: safe.keywords || emptySeoMetadata.keywords,
    canonicalUrl: safe.canonicalUrl || emptySeoMetadata.canonicalUrl,
    ogTitle: safe.ogTitle || safe.title || emptySeoMetadata.ogTitle,
    ogDescription: safe.ogDescription || safe.description || emptySeoMetadata.ogDescription,
    ogImage: safe.ogImage || emptySeoMetadata.ogImage,
    robots: {
      index: safe.robots?.index ?? true,
      follow: safe.robots?.follow ?? true,
    },
  }
}

export function normalizeFaqPayload(raw: any) {
  const safePayload = raw && typeof raw === "object" ? raw : {}
  const safeData = safePayload.data && typeof safePayload.data === "object" ? safePayload.data : safePayload

  const legacySections = Array.isArray(safeData.sections) ? safeData.sections : []
  const findLegacySection = (key: string) =>
    legacySections.find((s: any) => s.key === key || s.type === key)

  const heroRaw = safeData.hero ?? safeData.faq_intro ?? findLegacySection("hero") ?? findLegacySection("faq_intro") ?? {}
  const faqListRaw = safeData.faq_list ?? safeData.faqList ?? findLegacySection("faq_list") ?? findLegacySection("topics") ?? {}
  const ctaRaw = safeData.cta ?? safeData.far_cta ?? findLegacySection("cta") ?? findLegacySection("far_cta") ?? {}
  const seoRaw = safeData.seo ?? findLegacySection("seo") ?? {}

  const finalHero = normalizeFaqHero(heroRaw)
  const finalFaqList = normalizeFaqList(faqListRaw)
  const finalCta = normalizeFaqCta(ctaRaw)
  const finalSeo = normalizeSeoMetadata(seoRaw)

  const metadata = safePayload.metadata || {}

  const normalized = {
    ...(safePayload.id ? { id: safePayload.id } : {}),
    name: safePayload.name || "FAQ",
    slug: "faq",
    metadata: {
      ...emptyFaqPayload.metadata,
      title: metadata.title || finalSeo.title || emptyFaqPayload.metadata.title,
      description: metadata.description || finalSeo.description || emptyFaqPayload.metadata.description,
      keywords: metadata.keywords || finalSeo.keywords || emptyFaqPayload.metadata.keywords,
      canonicalUrl: metadata.canonicalUrl || finalSeo.canonicalUrl || emptyFaqPayload.metadata.canonicalUrl,
      ogTitle: metadata.ogTitle || finalSeo.ogTitle || emptyFaqPayload.metadata.ogTitle,
      ogDescription: metadata.ogDescription || finalSeo.ogDescription || emptyFaqPayload.metadata.ogDescription,
      ogImage: metadata.ogImage || finalSeo.ogImage || emptyFaqPayload.metadata.ogImage,
      robots: {
        index: metadata.robots?.index ?? finalSeo.robots?.index ?? true,
        follow: metadata.robots?.follow ?? finalSeo.robots?.follow ?? true,
      },
    },
    data: {
      page: "faq",
      hero: finalHero,
      faq_list: finalFaqList,
      cta: finalCta,
      seo: finalSeo,
    },
  }

  return recursivelyReplaceUndefinedWithNull(normalized)
}
