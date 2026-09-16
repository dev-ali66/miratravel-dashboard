/* =====================================================
   LOCATION — PAYLOAD NORMALIZER
   Ensures that every section, multimedia key, and empty
   field is preserved with `null` or explicit defaults
   rather than being omitted by JSON.stringify / undefined.
   Guarantees backend and frontend developers receive a
   consistent, predictable schema.
===================================================== */

import type { LocationData } from "../locationTypes"

/**
 * Normalizes a multimedia object so that no subfield is omitted.
 * If media is undefined or null, returns `null` so the field is
 * explicitly serialized as `"key": null` instead of being dropped.
 */
export function normalizeMultimedia(media: any): any {
  if (media === undefined || media === null) {
    return null
  }

  if (typeof media !== "object") {
    return null
  }

  const show = media.show ?? media.type ?? "image"
  const type = media.type ?? media.show ?? "image"

  const imageObj = media.image ?? media.imageData ?? {}
  const videoObj = media.video ?? media.videoData ?? {}
  const colorObj =
    typeof media.color === "object"
      ? media.color
      : { color: media.color || "#171717", opacity: 100 }

  const resolvedUrl =
    media.url ||
    (show === "video" ? videoObj.url : imageObj.url) ||
    videoObj.url ||
    imageObj.url ||
    null

  const resolvedAlt =
    media.alt ||
    (show === "video" ? videoObj.alt : imageObj.alt) ||
    videoObj.alt ||
    imageObj.alt ||
    null

  return {
    show,
    type,
    url: resolvedUrl,
    alt: resolvedAlt,
    color: colorObj,
    opacity: media.opacity ?? imageObj.opacity ?? videoObj.opacity ?? 100,
    overlayColor:
      media.overlayColor ?? imageObj.overlayColor ?? videoObj.overlayColor ?? null,
    overlayOpacity:
      media.overlayOpacity ??
      imageObj.overlayOpacity ??
      videoObj.overlayOpacity ??
      null,
    image: {
      url: imageObj.url || (type === "image" ? resolvedUrl : null) || null,
      alt: imageObj.alt || resolvedAlt || null,
      opacity: imageObj.opacity ?? 100,
      overlayColor: imageObj.overlayColor || null,
      overlayOpacity: imageObj.overlayOpacity ?? null,
      width: imageObj.width || "100%",
      height: imageObj.height || "auto",
      aspectRatio: imageObj.aspectRatio || "auto",
      fit: imageObj.fit || "cover",
    },
    video: {
      url: videoObj.url || (type === "video" ? resolvedUrl : null) || null,
      alt: videoObj.alt || resolvedAlt || null,
      opacity: videoObj.opacity ?? 100,
      overlayColor: videoObj.overlayColor || null,
      overlayOpacity: videoObj.overlayOpacity ?? null,
      autoplay: videoObj.autoplay ?? true,
      loop: videoObj.loop ?? true,
      muted: videoObj.muted ?? true,
      width: videoObj.width || "100%",
      height: videoObj.height || "auto",
      aspectRatio: videoObj.aspectRatio || "auto",
      fit: videoObj.fit || "cover",
    },
    imageData: {
      url: imageObj.url || (type === "image" ? resolvedUrl : null) || null,
      alt: imageObj.alt || resolvedAlt || null,
      opacity: imageObj.opacity ?? null,
      overlayColor: imageObj.overlayColor || null,
      overlayOpacity: imageObj.overlayOpacity ?? null,
    },
    videoData: {
      url: videoObj.url || (type === "video" ? resolvedUrl : null) || null,
      alt: videoObj.alt || resolvedAlt || null,
      opacity: videoObj.opacity ?? null,
      overlayColor: videoObj.overlayColor || null,
      overlayOpacity: videoObj.overlayOpacity ?? null,
      autoplay: videoObj.autoplay ?? true,
      loop: videoObj.loop ?? true,
      muted: videoObj.muted ?? true,
    },
  }
}

/**
 * Normalizes any styled text/value field into the standard structured object format:
 * { value: "...", textColor: "#...", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 }
 * Prevents plain string conversion and keeps schema unified across frontend and CMS.
 */
export function normalizeStyledField(
  raw: any,
  defaultVal: string = "",
  defaultTextColor: string | null = null,
  defaultBgColor: string | null = null
) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return {
      value: raw.value !== undefined && raw.value !== null ? raw.value : defaultVal,
      textColor: raw.textColor !== undefined ? raw.textColor : defaultTextColor,
      textOpacity: raw.textOpacity !== undefined ? Number(raw.textOpacity) : 1,
      backgroundColor: raw.backgroundColor !== undefined ? raw.backgroundColor : defaultBgColor,
      backgroundOpacity: raw.backgroundOpacity !== undefined ? Number(raw.backgroundOpacity) : 1,
    }
  }

  return {
    value: raw !== undefined && raw !== null ? raw : defaultVal,
    textColor: defaultTextColor,
    textOpacity: 1,
    backgroundColor: defaultBgColor,
    backgroundOpacity: 1,
  }
}

/**
 * Recursively converts any remaining `undefined` values into `null`
 * so that JSON.stringify never strips empty fields.
 */
export function recursivelyReplaceUndefinedWithNull<T>(input: T): T {
  if (input === undefined) {
    return null as unknown as T
  }

  if (input === null || typeof input !== "object") {
    return input
  }

  if (Array.isArray(input)) {
    return input.map((item) =>
      recursivelyReplaceUndefinedWithNull(item)
    ) as unknown as T
  }

  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(input)) {
    result[key] =
      value === undefined ? null : recursivelyReplaceUndefinedWithNull(value)
  }

  return result as T
}

/**
 * Deeply normalizes a LocationData draft before saving or editing.
 * Guarantees every single field of the schema exists in the output.
 */
export function normalizeLocationPayload(
  draft: Partial<LocationData>
): LocationData {
  const safeDraft: any = draft ?? {}
  const safeData = (safeDraft.data ?? {}) as Record<string, any>

  const hero = safeDraft.hero ?? safeData.hero ?? {}
  const why = safeDraft.why ?? safeData.why ?? {}
  const card = safeDraft.card ?? safeData.card ?? {}
  const info = safeDraft.info ?? safeData.info ?? {}
  const sharedInfo = safeDraft.sharedInfo ?? safeData.sharedInfo ?? {}
  const regionGlance =
    safeDraft.glance ??
    safeDraft.regionGlance ??
    safeData.regionGlance ??
    safeData.glance ??
    {}
  const regionCharacter =
    safeDraft.character ??
    safeDraft.regionCharacter ??
    safeData.regionCharacter ??
    safeData.character ??
    {}
  const essence = safeDraft.essence ?? safeData.essence ?? {}
  const highlights = safeDraft.highlights ?? safeData.highlights ?? {}
  const statistics =
    safeDraft.highlightsStatistics ??
    safeDraft.statistics ??
    safeData.statistics ??
    safeData.highlightsStatistics ??
    {}
  const travelInfo = safeDraft.travelInfo ?? safeData.travelInfo ?? {}
  const experiences =
    safeDraft.experience ??
    safeDraft.experiences ??
    safeData.experiences ??
    safeData.experience ??
    {}
  const signatureExperiences =
    safeDraft.signatureExperiences ??
    safeDraft.signature_experiences ??
    safeData.signature_experiences ??
    safeData.signatureExperiences ??
    {}
  const practicalInformation =
    safeDraft.practicalInformation ??
    safeDraft.practical_information ??
    safeData.practical_information ??
    safeData.practicalInformation ??
    {}
  const faqSection =
    safeDraft.faq ??
    safeDraft.faqSection ??
    safeDraft.faq_section ??
    safeData.faq_section ??
    safeData.faq ??
    {}
  const ctaSection =
    safeDraft.cta ??
    safeDraft.destinationCta ??
    safeData.destinationCta ??
    safeData.cta ??
    {}
  const travelInsights =
    safeDraft.travelInsight ??
    safeDraft.travelInsights ??
    safeDraft.travel_insights ??
    safeData.travel_insights ??
    safeData.travelInsight ??
    {}
  const accommodationStays =
    safeDraft.accommodation ??
    safeDraft.accommodationStays ??
    safeDraft.accommodation_stays ??
    safeData.accommodation_stays ??
    safeData.accommodation ??
    {}
  const culture = safeDraft.culture ?? safeData.culture ?? {}
  const climate = safeDraft.climate ?? safeData.climate ?? {}
  const safety = safeDraft.safety ?? safeData.safety ?? {}
  const regionExperiences =
    safeDraft.regionExperiences ??
    safeData.regionExperiences ??
    safeDraft.experience ??
    safeData.experience ??
    {}
  const geography = safeDraft.geography ?? safeData.geography ?? {}
  const localGuide =
    safeDraft.localGuide ?? safeDraft.local_guide ?? safeData.local_guide ?? {}
  const videoGalary = safeDraft.videoGalary ?? safeData.videoGalary ?? {}

  const normalizedHero = {
    ...hero,
    title: normalizeStyledField(hero.title, "", "#FFFFFF"),
    description: normalizeStyledField(hero.description, "", "#FFFFFF"),
    breadcrumb: normalizeStyledField(hero.breadcrumb, "", null),
    subtitle: normalizeStyledField(hero.subtitle, "", null),
    isCenter: Boolean(hero.isCenter),
    background_image: hero.background_image ?? "",
    video: hero.video ?? "",
    showVideo: Boolean(hero.showVideo),
    button: hero.button ?? { name: "Explore Journey", url: "" },
    buttons: Array.isArray(hero.buttons) ? hero.buttons : [],
    titleStyle: hero.titleStyle ?? null,
    breadcrumbStyle: hero.breadcrumbStyle ?? null,
    descriptionStyle: hero.descriptionStyle ?? null,
    backgroundMultimedia: normalizeMultimedia(
      hero.backgroundMultimedia ?? hero.multimedia
    ),
  }

  const rawStat = essence.stat ?? {}
  const rawStatValue = rawStat.statValue ?? rawStat.value ?? essence.statValue
  const rawStatLabel = rawStat.statLabel ?? rawStat.label ?? essence.statLabel
  const rawStatBadgeBg =
    rawStat.statBadgeBg ??
    rawStat.badgeBg ??
    rawStat.backgroundColor ??
    essence.statBadgeBg ??
    "#B86B3A"

  const normalizedEssence = {
    ...essence,
    label: normalizeStyledField(essence.label, "", "#af6348"),
    title: normalizeStyledField(essence.title, "", "#182d09"),
    paragraphs: normalizeStyledField(essence.paragraphs, "", "#565e69"),
    quote: normalizeStyledField(essence.quote, "", "#1A1209"),
    stat: {
      statValue: normalizeStyledField(rawStatValue, "", "#ffffff"),
      statLabel: normalizeStyledField(rawStatLabel, "", "#ffffff", 0.75),
      statBadgeBg: typeof rawStatBadgeBg === "string" ? rawStatBadgeBg : "#B86B3A",
    },
    imageMultimedia: normalizeMultimedia(
      essence.imageMultimedia || essence.multimedia
    ),
    backgroundMultimedia: normalizeMultimedia(essence.backgroundMultimedia),
  }

  const rawItemIds: string[] = Array.isArray(highlights.items)
    ? highlights.items
      .map((it: any) => (typeof it === "string" ? it : it?.id || it?.locationId))
      .filter(Boolean)
    : Array.isArray(highlights.locationIds)
      ? highlights.locationIds
      : []

  const normalizedHighlights = {
    ...highlights,
    id: highlights.id ?? "highlights",
    label: normalizeStyledField(highlights.label, "SEASONAL HIGHLIGHTS", "#af6348"),
    title: normalizeStyledField(highlights.title, "", "#182d09"),
    description: normalizeStyledField(highlights.description, "", "#565e69"),
    items: rawItemIds,
    backgroundMultimedia: normalizeMultimedia(highlights.backgroundMultimedia),
    style: highlights.style ?? null,
  }

  const normalizedWhy = {
    ...why,
    title: normalizeStyledField(why.title, "", "#182d09"),
    subtitle: normalizeStyledField(why.subtitle, "", "#565e69"),
    subtitleStyle: why.subtitleStyle ?? null,
    tags: Array.isArray(why.tags) ? why.tags : [],
    image: why.image ?? "",
    imageMultimedia: normalizeMultimedia(why.imageMultimedia),
    backgroundMultimedia: normalizeMultimedia(why.backgroundMultimedia),
    description_paragraphs: Array.isArray(why.description_paragraphs)
      ? why.description_paragraphs
      : [],
  }

  const normalizedCard = {
    ...card,
    title: normalizeStyledField(card.title, "", "#182d09"),
    subtitle: normalizeStyledField(card.subtitle, "", "#565e69"),
    background_image: card.background_image ?? "",
    titleStyle: card.titleStyle ?? null,
    subtitleStyle: card.subtitleStyle ?? null,
    backgroundMultimedia: normalizeMultimedia(card.backgroundMultimedia),
    button: card.button ?? { label: "EXPLORE", url: "" },
  }

  const normalizedInfo = {
    ...info,
    headline: normalizeStyledField(info.headline, "", "#182d09"),
    description: normalizeStyledField(info.description, "", "#565e69"),
    headlineStyle: info.headlineStyle ?? null,
    descriptionStyle: info.descriptionStyle ?? null,
    backgroundMultimedia: normalizeMultimedia(info.backgroundMultimedia),
  }

  const normalizedSharedInfo = {
    ...sharedInfo,
    text: normalizeStyledField(sharedInfo.text, "", "#565e69"),
    style: sharedInfo.style ?? null,
    textStyle: sharedInfo.textStyle ?? null,
    backgroundMultimedia: normalizeMultimedia(sharedInfo.backgroundMultimedia),
  }

  const normalizedGlance = {
    ...regionGlance,
    label: normalizeStyledField(regionGlance.label, "", "#af6348"),
    title: normalizeStyledField(regionGlance.title, "", "#182d09"),
    description: normalizeStyledField(regionGlance.description, "", "#565e69"),
    style: regionGlance.style ?? null,
    labelStyle: regionGlance.labelStyle ?? null,
    descriptionStyle: regionGlance.descriptionStyle ?? null,
    backgroundMultimedia: normalizeMultimedia(
      regionGlance.backgroundMultimedia
    ),
  }

  const normalizedCharacter = {
    ...regionCharacter,
    label: normalizeStyledField(regionCharacter.label, "", "#af6348"),
    title: normalizeStyledField(regionCharacter.title, "", "#182d09"),
    style: regionCharacter.style ?? null,
    items: Array.isArray(regionCharacter.items)
      ? regionCharacter.items.map((it: any) => ({
        id: it.id ?? "",
        icon: it.icon ?? "",
        iconImage: it.iconImage ?? "",
        title: normalizeStyledField(it.title, "", "#182d09"),
        description: normalizeStyledField(it.description, "", "#565e69"),
        href: it.href ?? "",
        linkText: it.linkText ?? "",
        multimedia: normalizeMultimedia(it.multimedia ?? it.iconMultimedia),
        titleStyle: it.titleStyle ?? null,
        descriptionStyle: it.descriptionStyle ?? null,
      }))
      : [],
    backgroundMultimedia: normalizeMultimedia(
      regionCharacter.backgroundMultimedia
    ),
  }

  const normalizedStatistics = {
    ...statistics,
    area: {
      unit: statistics.area?.unit ?? "km²",
      value: statistics.area?.value ?? 0,
    },
    elevation: {
      unit: statistics.elevation?.unit ?? "m",
      value: statistics.elevation?.value ?? 0,
    },
    population: {
      year: statistics.population?.year ?? 2026,
      value: statistics.population?.value ?? 0,
    },
    facts: Array.isArray(statistics.facts)
      ? statistics.facts.map((f: any) => ({
        label: normalizeStyledField(f.label, "", "#af6348"),
        value: normalizeStyledField(f.value, "", "#182d09"),
        description: normalizeStyledField(f.description, "", "#565e69"),
        media: normalizeMultimedia(f.media),
        labelStyle: f.labelStyle ?? null,
        valueStyle: f.valueStyle ?? null,
        descriptionStyle: f.descriptionStyle ?? null,
      }))
      : [],
    style: statistics.style ?? null,
    backgroundMultimedia: normalizeMultimedia(
      statistics.backgroundMultimedia
    ),
  }

  const beforeTravel = travelInfo.beforeTravel ?? {}
  const normalizedTravelInfo = {
    ...travelInfo,
    visa: {
      description: travelInfo.visa?.description ?? "",
    },
    currency: {
      description: travelInfo.currency?.description ?? "",
      majorCurrency: travelInfo.currency?.majorCurrency ?? "",
    },
    bestTimeToVisit: {
      summer: travelInfo.bestTimeToVisit?.summer ?? "",
      winter: travelInfo.bestTimeToVisit?.winter ?? "",
      general: travelInfo.bestTimeToVisit?.general ?? "",
    },
    popularTransportation: Array.isArray(travelInfo.popularTransportation)
      ? travelInfo.popularTransportation
      : [],
    beforeTravel: {
      label: normalizeStyledField(beforeTravel.label, "", "#af6348"),
      title: normalizeStyledField(beforeTravel.title, "", "#182d09"),
      image: beforeTravel.image ?? "",
      imageAlt: beforeTravel.imageAlt ?? "",
      items: Array.isArray(beforeTravel.items)
        ? beforeTravel.items.map((it: any) => ({
          id: it.id ?? "",
          title: normalizeStyledField(it.title, "", "#182d09"),
          content: normalizeStyledField(it.content, "", "#565e69"),
          titleStyle: it.titleStyle ?? null,
        }))
        : [],
      style: beforeTravel.style ?? null,
      imageMultimedia: normalizeMultimedia(beforeTravel.imageMultimedia),
      backgroundMultimedia: normalizeMultimedia(
        beforeTravel.backgroundMultimedia
      ),
    },
  }

  const featuredExperience = experiences.featured_experience ?? {}
  const normalizedExperiences = {
    ...experiences,
    title: normalizeStyledField(experiences.title, "", "#182d09"),
    location: experiences.location ?? "",
    description: normalizeStyledField(experiences.description, "", "#565e69"),
    seasonInfo: experiences.seasonInfo ?? "",
    seasonLocation: experiences.seasonLocation ?? "",
    load_more_button: experiences.load_more_button ?? "Load More",
    loadMoreButtonStyle: experiences.loadMoreButtonStyle ?? null,
    titleStyle: experiences.titleStyle ?? null,
    locationStyle: experiences.locationStyle ?? null,
    descriptionStyle: experiences.descriptionStyle ?? null,
    featured_experience: {
      image: featuredExperience.image ?? "",
      title: normalizeStyledField(featuredExperience.title, "", "#182d09"),
      category: featuredExperience.category ?? "",
      duration: featuredExperience.duration ?? "",
      subtitle: normalizeStyledField(featuredExperience.subtitle, "", "#565e69"),
      action_text: featuredExperience.action_text ?? "More info",
      button: featuredExperience.button ?? null,
      buttons: Array.isArray(featuredExperience.buttons)
        ? featuredExperience.buttons
        : [],
      imageMultimedia: normalizeMultimedia(
        featuredExperience.imageMultimedia
      ),
    },
    cards: Array.isArray(experiences.cards)
      ? experiences.cards.map((c: any) => ({
        id: c.id ?? Date.now(),
        image: c.image ?? "",
        price: c.price ?? "",
        title: normalizeStyledField(c.title, "", "#182d09"),
        category: c.category ?? "",
        subtitle: normalizeStyledField(c.subtitle, "", "#565e69"),
        action_text: c.action_text ?? "More info",
        description: normalizeStyledField(c.description, "", "#565e69"),
        button: c.button ?? null,
        buttons: Array.isArray(c.buttons) ? c.buttons : [],
        imageMultimedia: normalizeMultimedia(c.imageMultimedia),
      }))
      : [],
    footer: {
      note: experiences.footer?.note ?? "",
      region: experiences.footer?.region ?? "",
    },
  }

  const normalizedRegionExperiences = {
    ...regionExperiences,
    id: regionExperiences.id ?? "region-experiences",
    label: normalizeStyledField(regionExperiences.label, "", "#af6348"),
    title: normalizeStyledField(regionExperiences.title, "", "#182d09"),
    backgroundMultimedia: normalizeMultimedia(
      regionExperiences.backgroundMultimedia
    ),
    items: Array.isArray(regionExperiences.items)
      ? regionExperiences.items.map((it: any) => {
        const rawButtons = Array.isArray(it.buttons) && it.buttons.length > 0
          ? it.buttons
          : it.button
            ? [it.button]
            : []

        const normalizedButtons = rawButtons.map((btn: any) => ({
          label: btn.label ?? it.buttonText ?? "Explore Region",
          url: btn.url ?? it.buttonUrl ?? "",
          style: btn.style ?? (btn.variant ? String(btn.variant).toLowerCase() : "primary"),
          variant: (btn.variant ?? btn.style ?? "PRIMARY").toUpperCase(),
          textColor: btn.textColor ?? "#ffffff",
          backgroundColor: btn.backgroundColor ?? "#af6348",
        }))

        if (normalizedButtons.length === 0) {
          normalizedButtons.push({
            label: it.buttonText ?? "Explore Region",
            url: it.buttonUrl ?? "",
            style: "primary",
            variant: "PRIMARY",
            textColor: "#ffffff",
            backgroundColor: "#af6348",
          })
        }

        return {
          id: it.id ?? "",
          title: normalizeStyledField(it.title, "", "#182d09"),
          subtitle: normalizeStyledField(it.subtitle, "", "#9c705d"),
          description: normalizeStyledField(it.description, "", "#565e69"),
          imageMultimedia: normalizeMultimedia(it.imageMultimedia),
          tag: normalizeStyledField(it.tag, "REGION", "#9c705d"),
          buttons: normalizedButtons,
        }
      })
      : [],
    style: regionExperiences.style ?? null,
  }

  const normalizedSignatureExperiences = {
    ...signatureExperiences,
    label: normalizeStyledField(
      signatureExperiences.label,
      "Signature Experiences",
      "#af6348"
    ),
    labelStyle: signatureExperiences.labelStyle ?? null,
    title: normalizeStyledField(
      signatureExperiences.title,
      "Five ways to fall in love with " + (safeDraft.name || "the destination"),
      "#182d09"
    ),
    titleStyle: signatureExperiences.titleStyle ?? null,
    description: normalizeStyledField(
      signatureExperiences.description,
      "",
      "#565e69"
    ),
    descriptionStyle: signatureExperiences.descriptionStyle ?? null,
    backgroundMultimedia: normalizeMultimedia(
      signatureExperiences.backgroundMultimedia
    ),
    style: signatureExperiences.style ?? null,
    experiences: Array.isArray(signatureExperiences.experiences)
      ? signatureExperiences.experiences.map((exp: any, idx: number) => ({
        id: exp.id ?? `exp-${String(idx + 1).padStart(2, "0")}`,
        number: exp.number ?? String(idx + 1).padStart(2, "0"),
        numberStyle: exp.numberStyle ?? null,
        title: normalizeStyledField(exp.title, "", "#182d09"),
        titleStyle: exp.titleStyle ?? null,
        description: normalizeStyledField(exp.description, "", "#565e69"),
        descriptionStyle: exp.descriptionStyle ?? null,
        href: exp.href ?? "#",
        linkText: exp.linkText ?? "Explore this experience",
        button: exp.button ?? null,
        buttons: Array.isArray(exp.buttons) ? exp.buttons : [],
      }))
      : [],
  }

  const normalizedPracticalInformation = {
    ...practicalInformation,
    title: normalizeStyledField(practicalInformation.title, "", "#182d09"),
    sub_heading: normalizeStyledField(practicalInformation.sub_heading, "", "#565e69"),
    side_image: practicalInformation.side_image ?? "",
    accordion_items: Array.isArray(practicalInformation.accordion_items)
      ? practicalInformation.accordion_items.map((ai: any) => ({
        id: ai.id ?? String(Date.now()),
        title: normalizeStyledField(ai.title, "", "#182d09"),
        content: normalizeStyledField(ai.content, "", "#565e69"),
        is_expanded: Boolean(ai.is_expanded),
        titleStyle: ai.titleStyle ?? null,
      }))
      : [],
    sideImageMultimedia: normalizeMultimedia(
      practicalInformation.sideImageMultimedia
    ),
    backgroundMultimedia: normalizeMultimedia(
      practicalInformation.backgroundMultimedia
    ),
  }

  const normalizedFaq = {
    ...faqSection,
    title: normalizeStyledField(
      faqSection.title,
      "Frequently Asked Questions",
      "#182d09"
    ),
    image: faqSection.image ?? faqSection.imageMultimedia?.image?.url ?? "",
    imageAlt:
      faqSection.imageAlt ??
      faqSection.imageMultimedia?.image?.alt ??
      "Frequently Asked Questions",
    imageMultimedia: normalizeMultimedia(
      faqSection.imageMultimedia ??
      (faqSection.image
        ? {
          show: "image",
          image: {
            url: faqSection.image,
            alt: faqSection.imageAlt || "Frequently Asked Questions",
          },
        }
        : null)
    ),
    backgroundMultimedia: normalizeMultimedia(
      faqSection.backgroundMultimedia
    ),
    questions: Array.isArray(faqSection.questions)
      ? faqSection.questions.map((q: any, idx: number) => ({
        id: q.id ?? `faq-${String(idx + 1).padStart(2, "0")}`,
        question: normalizeStyledField(q.question, "", "#182d09"),
        answer: normalizeStyledField(q.answer, "", "#565e69"),
        questionStyle: q.questionStyle ?? null,
        answerStyle: q.answerStyle ?? null,
      }))
      : [],
  }

  const normalizedCta = {
    ...ctaSection,
    title: normalizeStyledField(
      ctaSection.title,
      "Didn't find your perfect journey?",
      "#182d09"
    ),
    description: normalizeStyledField(
      ctaSection.description,
      "Our collection is carefully designed but every travel is different.\nIf you'd like something more personal, we'd love to create it together.",
      "#565e69"
    ),
    line1:
      ctaSection.line1 ??
      "Our collection is carefully designed but every travel is different.",
    line2:
      ctaSection.line2 ??
      "If you'd like something more personal, we'd love to create it together.",
    buttonText:
      ctaSection.buttonText ??
      ctaSection.button?.label ??
      "Plan a tailor-made journey",
    buttonUrl: ctaSection.buttonUrl ?? ctaSection.button?.url ?? "/contact",
    button: ctaSection.button ?? {
      label: ctaSection.buttonText || "Plan a tailor-made journey",
      url: ctaSection.buttonUrl || "/contact",
      style: "primary",
      backgroundColor: "#af6348",
      textColor: "#ffffff",
    },
    image:
      ctaSection.image ??
      ctaSection.imageMultimedia?.image?.url ??
      "/images/cta.png",
    imageMultimedia: normalizeMultimedia(
      ctaSection.imageMultimedia ??
      (ctaSection.image
        ? {
          show: "image",
          image: {
            url: ctaSection.image,
            alt: "CTA Motif",
            opacity: 100,
            overlayColor: "#000000",
            overlayOpacity: 0,
            width: "100%",
            height: "100%",
            aspectRatio: "auto",
            fit: "contain",
          },
        }
        : null)
    ),
    backgroundMultimedia: normalizeMultimedia(
      ctaSection.backgroundMultimedia
    ),
  }

  const normalizedTravelInsights = {
    ...travelInsights,
    label: normalizeStyledField(
      travelInsights.label,
      "TRAVEL INSIGHTS",
      "#d29393"
    ),
    labelStyle: travelInsights.labelStyle ?? null,
    title: normalizeStyledField(
      travelInsights.title,
      "Everything you need to know before you go",
      "#e5e5e5"
    ),
    titleStyle: travelInsights.titleStyle ?? null,
    featuredImage:
      travelInsights.featuredImage ??
      travelInsights.featuredMultimedia?.image?.url ??
      travelInsights.main_image ??
      "",
    featuredImageAlt:
      travelInsights.featuredImageAlt ??
      travelInsights.featuredMultimedia?.image?.alt ??
      "Featured Local Guide Article",
    featuredMultimedia: normalizeMultimedia(
      travelInsights.featuredMultimedia ??
      travelInsights.mainImageMultimedia ??
      (travelInsights.featuredImage
        ? {
          show: "image",
          image: {
            url: travelInsights.featuredImage,
            alt: travelInsights.featuredImageAlt || "Featured Article",
          },
        }
        : null)
    ),
    backgroundMultimedia: normalizeMultimedia(
      travelInsights.backgroundMultimedia
    ),
    articles: Array.isArray(travelInsights.articles)
      ? travelInsights.articles.map((art: any, idx: number) => {
        const autoNum = String(idx + 1).padStart(2, "0")
        const resolvedThumb =
          art.thumbnail ??
          art.thumbnailMultimedia?.image?.url ??
          art.imageMultimedia?.image?.url ??
          art.image ??
          ""
        return {
          id: art.id ?? `article-${autoNum}-${Date.now()}`,
          number: art.number ?? autoNum,
          category: normalizeStyledField(art.category, "Guide", "#af6348"),
          categoryStyle: art.categoryStyle ?? null,
          title: normalizeStyledField(art.title, "", "#F3F4F6"),
          titleStyle: art.titleStyle ?? null,
          description: normalizeStyledField(art.description, "", "#9CA3AF"),
          descriptionStyle: art.descriptionStyle ?? null,
          href: art.href ?? "",
          thumbnail: resolvedThumb,
          thumbnailMultimedia: normalizeMultimedia(
            art.thumbnailMultimedia ??
            art.imageMultimedia ??
            (resolvedThumb
              ? {
                show: "image",
                image: {
                  url: resolvedThumb,
                  alt:
                    typeof art.title === "string"
                      ? art.title
                      : art.title?.value || "Article thumbnail",
                },
              }
              : null)
          ),
          style: art.style ?? null,
        }
      })
      : [],
    style: travelInsights.style ?? null,
  }

  const normalizedAccommodationStays = {
    ...accommodationStays,
    badge: normalizeStyledField(accommodationStays.badge, "", "#af6348"),
    badgeStyle: accommodationStays.badgeStyle ?? null,
    title: normalizeStyledField(accommodationStays.title, "", "#182d09"),
    titleStyle: accommodationStays.titleStyle ?? null,
    description: normalizeStyledField(accommodationStays.description, "", "#565e69"),
    descriptionStyle: accommodationStays.descriptionStyle ?? null,
    stays: Array.isArray(accommodationStays.stays)
      ? accommodationStays.stays.map((st: any) => ({
        id: st.id ?? Date.now(),
        day: st.day ?? null,
        city: st.city ?? "",
        step: st.step ?? "",
        image: st.image ?? "",
        nights: st.nights ?? null,
        buttons: Array.isArray(st.buttons) ? st.buttons : [],
        duration: st.duration ?? "",
        location: st.location ?? "",
        stayType: st.stayType ?? "",
        subtitle: normalizeStyledField(st.subtitle, "", "#565e69"),
        confirmedBy: st.confirmedBy ?? "",
        description: normalizeStyledField(st.description, "", "#565e69"),
        imageMultimedia: normalizeMultimedia(st.imageMultimedia),
        confirmationBadge: st.confirmationBadge ?? "",
      }))
      : [],
    backgroundMultimedia: normalizeMultimedia(
      accommodationStays.backgroundMultimedia
    ),
  }

  const normalizedCulture = {
    ...culture,
    cuisine: Array.isArray(culture.cuisine) ? culture.cuisine : [],
    description: culture.description ?? "",
    majorLanguages: Array.isArray(culture.majorLanguages)
      ? culture.majorLanguages
      : [],
    majorReligions: Array.isArray(culture.majorReligions)
      ? culture.majorReligions
      : [],
    famousFestivals: Array.isArray(culture.famousFestivals)
      ? culture.famousFestivals
      : [],
    style: culture.style ?? null,
  }

  const normalizedClimate = {
    ...climate,
    types: Array.isArray(climate.types) ? climate.types : [],
    description: climate.description ?? "",
  }

  const normalizedSafety = {
    ...safety,
    description: safety.description ?? "",
    emergencyNumber: safety.emergencyNumber ?? "",
  }

  const normalizedGeography = {
    ...geography,
    highestPoint: {
      name: geography.highestPoint?.name ?? "",
      unit: geography.highestPoint?.unit ?? "m",
      elevation: geography.highestPoint?.elevation ?? 0,
    },
    majorLandscapes: Array.isArray(geography.majorLandscapes)
      ? geography.majorLandscapes
      : [],
  }

  const normalizedLocalGuide = {
    ...localGuide,
    title: localGuide.title ?? "",
    sub_heading: localGuide.sub_heading ?? "",
    main_image: localGuide.main_image ?? "",
    articles: Array.isArray(localGuide.articles) ? localGuide.articles : [],
  }

  const normalizedVideoGalary = {
    ...videoGalary,
    alt: videoGalary.alt ?? "",
    url: videoGalary.url ?? "",
    thumbnail: videoGalary.thumbnail ?? "",
    multimedia: normalizeMultimedia(videoGalary.multimedia),
  }

  const rawGeoObj = rawGeoData.geo ?? rawGeoData.location ?? rawGeoData.map ?? {}
  const geoLat = Number(rawGeoObj.latitude ?? rawGeoData.latitude ?? 41.1533)
  const geoLng = Number(rawGeoObj.longitude ?? rawGeoData.longitude ?? 20.1683)
  const geoZoom = Number(rawGeoObj.mapZoom ?? rawGeoData.mapZoom ?? 4)
  const geoPitch = Number(rawGeoObj.pitch ?? rawGeoData.pitch ?? 0)
  const geoBearing = Number(rawGeoObj.bearing ?? rawGeoData.bearing ?? 0)
  const geoTz = rawGeoObj.timezone ?? rawGeoData.timezone ?? "UTC+1 (CET)"
  const geoArea = {
    value: Number(rawGeoObj.area?.value ?? rawGeoData.area?.value ?? 28748),
    unit: rawGeoObj.area?.unit ?? rawGeoData.area?.unit ?? "km²",
  }

  const normalizedGeoData = {
    title: normalizeStyledField(
      rawGeoData.title,
      "Interactive Map",
      "#0a0a0a"
    ),
    description: normalizeStyledField(
      rawGeoData.description,
      "Spin the globe, then zoom into the destination to explore our properties.",
      "#565e69"
    ),
    backgroundMultimedia: normalizeMultimedia(
      rawGeoData.backgroundMultimedia
    ),
    geo: {
      latitude: geoLat,
      longitude: geoLng,
      mapZoom: geoZoom,
      pitch: geoPitch,
      bearing: geoBearing,
      timezone: geoTz,
      area: geoArea,
    },
    showChildren:
      rawGeoData.showChildren !== undefined
        ? Boolean(rawGeoData.showChildren)
        : rawGeoData.children?.showChildren !== false,
  }

  const normalized: LocationData = {
    id: safeDraft.id ?? undefined,
    name: safeDraft.name ?? "",
    slug: safeDraft.slug ?? "",
    type: safeDraft.type ?? "PLACE",
    parentId: safeDraft.parentId || null,

    // Dedicated root section JSON fields for Prisma columns
    hero: normalizedHero,
    essence: normalizedEssence,
    highlights: normalizedHighlights,
    card: normalizedCard,
    why: normalizedWhy,
    sharedInfo: normalizedSharedInfo,
    glance: normalizedGlance,
    character: normalizedCharacter,
    highlightsStatistics: normalizedStatistics,
    experience: normalizedExperiences,
    regionExperiences: normalizedRegionExperiences,
    signatureExperiences: normalizedSignatureExperiences,
    travelInfo: normalizedTravelInfo,
    travelInsight: normalizedTravelInsights,
    accommodation: normalizedAccommodationStays,
    faq: normalizedFaq,
    cta: normalizedCta,

    geoData: normalizedGeoData,

    metadata: {
      seo: {
        title: safeDraft.metadata?.seo?.title ?? "",
        description: safeDraft.metadata?.seo?.description ?? "",
        keywords: Array.isArray(safeDraft.metadata?.seo?.keywords)
          ? safeDraft.metadata.seo.keywords
          : [],
        canonicalUrl: safeDraft.metadata?.seo?.canonicalUrl ?? "",
        robots: {
          index: safeDraft.metadata?.seo?.robots?.index ?? true,
          follow: safeDraft.metadata?.seo?.robots?.follow ?? true,
        },
      },
    },

    data: {
      name: safeData.name ?? safeDraft.name ?? "",
      title: safeData.title ?? "",
      subtitle: safeData.subtitle ?? "",
      description: safeData.description ?? "",
      shortDescription: safeData.shortDescription ?? "",
      hero: normalizedHero,
      essence: normalizedEssence,
      highlights: normalizedHighlights,
      why: normalizedWhy,
      card: normalizedCard,
      info: normalizedInfo,
      sharedInfo: normalizedSharedInfo,
      regionGlance: normalizedGlance,
      regionCharacter: normalizedCharacter,
      statistics: normalizedStatistics,
      travelInfo: normalizedTravelInfo,
      experiences: normalizedExperiences,
      regionExperiences: normalizedRegionExperiences,
      signature_experiences: normalizedSignatureExperiences,
      signatureExperiences: normalizedSignatureExperiences,
      practical_information: normalizedPracticalInformation,
      faq_section: normalizedFaq,
      travel_insights: normalizedTravelInsights,
      accommodation_stays: normalizedAccommodationStays,
      culture: normalizedCulture,
      climate: normalizedClimate,
      safety: normalizedSafety,
      geography: normalizedGeography,
      geoData: normalizedGeoData,
      imageGalary: Array.isArray(safeData.imageGalary)
        ? safeData.imageGalary
        : [],
      local_guide: normalizedLocalGuide,
      videoGalary: normalizedVideoGalary,
    },
  }

  // Safety net: any remaining undefined anywhere becomes null
  return recursivelyReplaceUndefinedWithNull(normalized)
}
