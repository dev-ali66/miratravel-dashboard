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

  const type = media.type ?? "image"
  const resolvedUrl = media.url || null
  const resolvedAlt = media.alt || null

  const imageObj = media.imageData ?? {}
  const videoObj = media.videoData ?? {}

  return {
    type,
    url: resolvedUrl,
    alt: resolvedAlt,
    color: media.color || null,
    opacity: media.opacity ?? null,
    overlayColor: media.overlayColor || null,
    overlayOpacity: media.overlayOpacity ?? null,
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
  const safeDraft = draft ?? {}
  const safeData = (safeDraft.data ?? {}) as Record<string, any>

  const hero = safeData.hero ?? {}
  const why = safeData.why ?? {}
  const card = safeData.card ?? {}
  const info = safeData.info ?? {}
  const sharedInfo = safeData.sharedInfo ?? {}
  const regionGlance = safeData.regionGlance ?? {}
  const regionCharacter = safeData.regionCharacter ?? {}
  const essence = safeData.essence ?? {}
  const statistics = safeData.statistics ?? {}
  const travelInfo = safeData.travelInfo ?? {}
  const beforeTravel = travelInfo.beforeTravel ?? {}
  const experiences = safeData.experiences ?? {}
  const featuredExperience = experiences.featured_experience ?? {}
  const signatureExperiences =
    safeData.signature_experiences ?? safeData.signatureExperiences ?? {}
  const practicalInformation = safeData.practical_information ?? {}
  const faqSection = safeData.faq_section ?? {}
  const travelInsights = safeData.travel_insights ?? {}
  const accommodationStays = safeData.accommodation_stays ?? {}
  const culture = safeData.culture ?? {}
  const climate = safeData.climate ?? {}
  const safety = safeData.safety ?? {}
  const geography = safeData.geography ?? {}
  const localGuide = safeData.local_guide ?? {}
  const videoGalary = safeData.videoGalary ?? {}

  const normalized: LocationData = {
    id: safeDraft.id ?? undefined,
    name: safeDraft.name ?? "",
    slug: safeDraft.slug ?? "",
    type: safeDraft.type ?? "PLACE",
    parentId: safeDraft.parentId ?? null,
    parent: safeDraft.parent ?? null,
    children: Array.isArray(safeDraft.children) ? safeDraft.children : [],

    geoData: {
      area: {
        unit: safeDraft.geoData?.area?.unit ?? "km²",
        value: safeDraft.geoData?.area?.value ?? 0,
      },
      mapZoom: safeDraft.geoData?.mapZoom ?? 6,
      latitude: safeDraft.geoData?.latitude ?? 0,
      longitude: safeDraft.geoData?.longitude ?? 0,
      timezone: safeDraft.geoData?.timezone ?? "",
    },

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

      hero: {
        title: hero.title ?? "",
        description: hero.description ?? "",
        breadcrumb: hero.breadcrumb ?? "",
        background_image: hero.background_image ?? "",
        video: hero.video ?? "",
        showVideo: Boolean(hero.showVideo),
        button: hero.button ?? { name: "Explore Journey", url: "" },
        buttons: Array.isArray(hero.buttons) ? hero.buttons : [],
        titleStyle: hero.titleStyle ?? null,
        breadcrumbStyle: hero.breadcrumbStyle ?? null,
        descriptionStyle: hero.descriptionStyle ?? null,
        backgroundMultimedia: normalizeMultimedia(hero.backgroundMultimedia),
      },

      why: {
        title: why.title ?? "",
        subtitle: why.subtitle ?? "",
        description_paragraphs: Array.isArray(why.description_paragraphs)
          ? why.description_paragraphs
          : [],
        image: why.image ?? "",
        tags: Array.isArray(why.tags) ? why.tags : [],
        subtitleStyle: why.subtitleStyle ?? null,
        imageMultimedia: normalizeMultimedia(why.imageMultimedia),
        backgroundMultimedia: normalizeMultimedia(why.backgroundMultimedia),
      },

      card: {
        title: card.title ?? "",
        subtitle: card.subtitle ?? "",
        background_image: card.background_image ?? "",
        button: card.button ?? { label: "EXPLORE", url: "" },
        titleStyle: card.titleStyle ?? null,
        subtitleStyle: card.subtitleStyle ?? null,
        backgroundMultimedia: normalizeMultimedia(card.backgroundMultimedia),
      },

      info: {
        headline: info.headline ?? "",
        description: info.description ?? "",
        headlineStyle: info.headlineStyle ?? null,
        descriptionStyle: info.descriptionStyle ?? null,
        backgroundMultimedia: normalizeMultimedia(info.backgroundMultimedia),
      },

      sharedInfo: {
        text: sharedInfo.text ?? "",
        style: sharedInfo.style ?? null,
        textStyle: sharedInfo.textStyle ?? null,
        backgroundMultimedia: normalizeMultimedia(
          sharedInfo.backgroundMultimedia
        ),
      },

      regionGlance: {
        label: regionGlance.label ?? "",
        title: regionGlance.title ?? "",
        description: regionGlance.description ?? "",
        style: regionGlance.style ?? null,
        labelStyle: regionGlance.labelStyle ?? null,
        descriptionStyle: regionGlance.descriptionStyle ?? null,
        backgroundMultimedia: normalizeMultimedia(
          regionGlance.backgroundMultimedia
        ),
      },

      regionCharacter: {
        label: regionCharacter.label ?? "",
        title: regionCharacter.title ?? "",
        items: Array.isArray(regionCharacter.items)
          ? regionCharacter.items.map((item: any) => ({
              id: item.id ?? "",
              icon: item.icon ?? "",
              iconImage: item.iconImage ?? null,
              title: item.title ?? "",
              description: item.description ?? "",
              href: item.href ?? "",
              linkText: item.linkText ?? "",
              titleStyle: item.titleStyle ?? null,
              descriptionStyle: item.descriptionStyle ?? null,
              multimedia: normalizeMultimedia(item.multimedia),
              iconMultimedia: normalizeMultimedia(item.iconMultimedia),
            }))
          : [],
        style: regionCharacter.style ?? null,
        backgroundMultimedia: normalizeMultimedia(
          regionCharacter.backgroundMultimedia
        ),
      },

      essence: {
        label: essence.label ?? "",
        title: essence.title ?? "",
        paragraphs: Array.isArray(essence.paragraphs) ? essence.paragraphs : [],
        paragraphStyles: Array.isArray(essence.paragraphStyles)
          ? essence.paragraphStyles
          : [],
        quote: essence.quote ?? "",
        imageSrc: essence.imageSrc ?? "",
        imageAlt: essence.imageAlt ?? "",
        statValue: essence.statValue ?? "",
        statLabel: essence.statLabel ?? "",
        facts: Array.isArray(essence.facts) ? essence.facts : [],
        style: essence.style ?? null,
        labelStyle: essence.labelStyle ?? null,
        quoteStyle: essence.quoteStyle ?? null,
        titleStyle: essence.titleStyle ?? null,
        imageMultimedia: normalizeMultimedia(essence.imageMultimedia),
        backgroundMultimedia: normalizeMultimedia(essence.backgroundMultimedia),
      },

      statistics: {
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
              label: f.label ?? "",
              value: f.value ?? "",
              description: f.description ?? "",
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
      },

      travelInfo: {
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
          label: beforeTravel.label ?? "",
          title: beforeTravel.title ?? "",
          image: beforeTravel.image ?? "",
          imageAlt: beforeTravel.imageAlt ?? "",
          items: Array.isArray(beforeTravel.items)
            ? beforeTravel.items.map((it: any) => ({
                id: it.id ?? "",
                title: it.title ?? "",
                content: it.content ?? "",
                titleStyle: it.titleStyle ?? null,
              }))
            : [],
          style: beforeTravel.style ?? null,
          imageMultimedia: normalizeMultimedia(beforeTravel.imageMultimedia),
          backgroundMultimedia: normalizeMultimedia(
            beforeTravel.backgroundMultimedia
          ),
        },
      },

      experiences: {
        title: experiences.title ?? "",
        location: experiences.location ?? "",
        description: experiences.description ?? "",
        seasonInfo: experiences.seasonInfo ?? "",
        seasonLocation: experiences.seasonLocation ?? "",
        load_more_button: experiences.load_more_button ?? "Load More",
        loadMoreButtonStyle: experiences.loadMoreButtonStyle ?? null,
        titleStyle: experiences.titleStyle ?? null,
        locationStyle: experiences.locationStyle ?? null,
        descriptionStyle: experiences.descriptionStyle ?? null,
        featured_experience: {
          image: featuredExperience.image ?? "",
          title: featuredExperience.title ?? "",
          category: featuredExperience.category ?? "",
          duration: featuredExperience.duration ?? "",
          subtitle: featuredExperience.subtitle ?? "",
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
              title: c.title ?? "",
              category: c.category ?? "",
              subtitle: c.subtitle ?? "",
              action_text: c.action_text ?? "More info",
              description: c.description ?? "",
              button: c.button ?? null,
              buttons: Array.isArray(c.buttons) ? c.buttons : [],
              imageMultimedia: normalizeMultimedia(c.imageMultimedia),
            }))
          : [],
        footer: {
          note: experiences.footer?.note ?? "",
          region: experiences.footer?.region ?? "",
        },
      },

      signature_experiences: {
        label: signatureExperiences.label ?? "Signature Experiences",
        labelStyle: signatureExperiences.labelStyle ?? null,
        title: signatureExperiences.title ?? "",
        titleStyle: signatureExperiences.titleStyle ?? null,
        description: signatureExperiences.description ?? "",
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
              title: exp.title ?? "",
              titleStyle: exp.titleStyle ?? null,
              description: exp.description ?? "",
              descriptionStyle: exp.descriptionStyle ?? null,
              href: exp.href ?? "#",
              linkText: exp.linkText ?? "Explore this experience",
              button: exp.button ?? null,
              buttons: Array.isArray(exp.buttons) ? exp.buttons : [],
            }))
          : [],
      },

      practical_information: {
        title: practicalInformation.title ?? "",
        sub_heading: practicalInformation.sub_heading ?? "",
        side_image: practicalInformation.side_image ?? "",
        accordion_items: Array.isArray(practicalInformation.accordion_items)
          ? practicalInformation.accordion_items.map((ai: any) => ({
              id: ai.id ?? String(Date.now()),
              title: ai.title ?? "",
              content: ai.content ?? "",
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
      },

      faq_section: {
        title: faqSection.title ?? "",
        image: faqSection.image ?? "",
        questions: Array.isArray(faqSection.questions)
          ? faqSection.questions.map((q: any) => ({
              id: q.id ?? Date.now(),
              question: q.question ?? "",
              answer: q.answer ?? "",
              questionStyle: q.questionStyle ?? null,
              answerStyle: q.answerStyle ?? null,
            }))
          : [],
        imageMultimedia: normalizeMultimedia(faqSection.imageMultimedia),
        backgroundMultimedia: normalizeMultimedia(
          faqSection.backgroundMultimedia
        ),
      },

      travel_insights: {
        title: travelInsights.title ?? "",
        sub_heading: travelInsights.sub_heading ?? "",
        main_image: travelInsights.main_image ?? "",
        articles: Array.isArray(travelInsights.articles)
          ? travelInsights.articles.map((art: any) => ({
              id: art.id ?? String(Date.now()),
              number: art.number ?? "",
              category: art.category ?? "",
              title: art.title ?? "",
              description: art.description ?? "",
              href: art.href ?? "",
              button: art.button ?? null,
              buttons: Array.isArray(art.buttons) ? art.buttons : [],
              thumbnail: art.thumbnail ?? "",
              thumbnailMultimedia: normalizeMultimedia(art.thumbnailMultimedia),
              descriptionStyle: art.descriptionStyle ?? null,
            }))
          : [],
        mainImageMultimedia: normalizeMultimedia(
          travelInsights.mainImageMultimedia
        ),
      },

      accommodation_stays: {
        badge: accommodationStays.badge ?? "",
        badgeStyle: accommodationStays.badgeStyle ?? null,
        title: accommodationStays.title ?? "",
        titleStyle: accommodationStays.titleStyle ?? null,
        description: accommodationStays.description ?? "",
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
              subtitle: st.subtitle ?? "",
              confirmedBy: st.confirmedBy ?? "",
              description: st.description ?? "",
              imageMultimedia: normalizeMultimedia(st.imageMultimedia),
              confirmationBadge: st.confirmationBadge ?? "",
            }))
          : [],
        backgroundMultimedia: normalizeMultimedia(
          accommodationStays.backgroundMultimedia
        ),
      },

      culture: {
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
      },

      climate: {
        types: Array.isArray(climate.types) ? climate.types : [],
        description: climate.description ?? "",
      },

      safety: {
        description: safety.description ?? "",
        emergencyNumber: safety.emergencyNumber ?? "",
      },

      geography: {
        highestPoint: {
          name: geography.highestPoint?.name ?? "",
          unit: geography.highestPoint?.unit ?? "m",
          elevation: geography.highestPoint?.elevation ?? 0,
        },
        majorLandscapes: Array.isArray(geography.majorLandscapes)
          ? geography.majorLandscapes
          : [],
      },

      imageGalary: Array.isArray(safeData.imageGalary)
        ? safeData.imageGalary
        : [],

      local_guide: {
        title: localGuide.title ?? "",
        sub_heading: localGuide.sub_heading ?? "",
        main_image: localGuide.main_image ?? "",
        articles: Array.isArray(localGuide.articles) ? localGuide.articles : [],
      },

      videoGalary: {
        alt: videoGalary.alt ?? "",
        url: videoGalary.url ?? "",
        thumbnail: videoGalary.thumbnail ?? "",
        multimedia: normalizeMultimedia(videoGalary.multimedia),
      },
    },
  }

  // Safety net: any remaining undefined anywhere becomes null
  return recursivelyReplaceUndefinedWithNull(normalized)
}
