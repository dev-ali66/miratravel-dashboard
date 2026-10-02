import type { Story, ArticleBlock } from "../storyTypes"
import {
  getSafeStringValue,
  normalizeStyledField,
  normalizeMultimedia,
  normalizeButtonsArray,
} from "./normalizeHelpers"

/**
 * Story Payload Normalizer (Location & CMS Parity Architecture)
 * Normalizes all primitive text fields, detail object, blocks, buttons, and multimedia
 * to guarantee 100% schema integrity matching Location & CMS Hero standards.
 */
export function normalizeStoryPayload(rawStory: any): Story {
  const safe = rawStory || {}
  const detail = safe.detail || {}

  const titleStr = getSafeStringValue(safe.title || detail.title?.value || detail.title, "")
  const slugStr = getSafeStringValue(safe.slug) || titleStr.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const mainCategory = getSafeStringValue(safe.category, "Culture & Heritage")
  const categoriesArr =
    Array.isArray(safe.categories) && safe.categories.length > 0
      ? safe.categories.map((c: any) => getSafeStringValue(c))
      : [mainCategory]

  const descriptionStr = getSafeStringValue(safe.description || detail.subtitle?.value || detail.subtitle || detail.description?.value || detail.description, "")
  const readTimeStr = getSafeStringValue(safe.readTime, "5 min read")
  const templateTypeStr = getSafeStringValue(safe.templateType, "long-story")

  const bgMedia = normalizeMultimedia(
    safe.backgroundMultimedia || detail.backgroundMultimedia || detail.heroMultimedia || { url: safe.image },
    "image"
  )
  const heroImageUrl = bgMedia?.image?.url || bgMedia?.url || safe.image || "https://images.unsplash.com/photo-1548625361-18da857bbf08?auto=format&fit=crop&w=1400&q=80"

  const rawBlocks = Array.isArray(detail.blocks) ? detail.blocks : []
  const normalizedBlocks: ArticleBlock[] = rawBlocks.map((b: any, idx: number) => {
    const blockId = b.id || `b_${idx + 1}`
    const blockType = b.type || "paragraph"

    const normBlock: ArticleBlock = {
      id: blockId,
      type: blockType,
      title: getSafeStringValue(b.title),
      text: getSafeStringValue(b.text),
      textStyle: b.textStyle || undefined,
      url: b.url || b.multimedia?.url || "",
      secondUrl: b.secondUrl || b.secondMultimedia?.url || undefined,
      layout: b.layout || (blockType === "spotlight" ? "image-left" : undefined),
      caption: getSafeStringValue(b.caption),
      captionStyle: b.captionStyle || undefined,
      multimedia: b.multimedia ? normalizeMultimedia(b.multimedia) : undefined,
      secondMultimedia: b.secondMultimedia ? normalizeMultimedia(b.secondMultimedia) : undefined,
      items: Array.isArray(b.items)
        ? b.items.map((it: any) => ({
            title: getSafeStringValue(it.title),
            content: getSafeStringValue(it.content),
          }))
        : undefined,
      highlights: Array.isArray(b.highlights)
        ? b.highlights.map((h: any) => getSafeStringValue(h))
        : undefined,
    }

    return normBlock
  })

  // Full CMS / Location Parity Hero Object inside detail
  const breadcrumbObj = normalizeStyledField(safe.breadcrumb || detail.breadcrumb, "", "#d29393", null)
  const titleObj = normalizeStyledField(safe.title || detail.title || detail.titleStyle, titleStr, "#FFFFFF", null)
  const subtitleObj = normalizeStyledField(safe.subtitle || detail.subtitle || detail.descriptionStyle, descriptionStr, "#E5E7EB", null)
  const descriptionObj = normalizeStyledField(safe.description || detail.description, "", "#F3F4F6", null)
  const buttonsArr = normalizeButtonsArray(safe.buttons || detail.buttons)

  return {
    id: safe.id || "",
    title: titleStr,
    slug: slugStr,
    category: mainCategory,
    categories: categoriesArr,
    description: descriptionStr,
    readTime: readTimeStr,
    image: heroImageUrl,
    templateType: templateTypeStr,
    detail: {
      breadcrumb: breadcrumbObj,
      title: titleObj,
      subtitle: subtitleObj,
      description: descriptionObj,
      isCenter: Boolean(safe.isCenter ?? detail.isCenter ?? false),
      buttons: buttonsArr,
      backgroundMultimedia: bgMedia,
      heroMultimedia: bgMedia, // legacy alias for compatibility
      titleStyle: detail.titleStyle || { textColor: titleObj.textColor || "#FFFFFF" },
      descriptionStyle: detail.descriptionStyle || { textColor: subtitleObj.textColor || "#FBF9F5" },
      readTimeStyle: detail.readTimeStyle || { textColor: "#FDE68A" },
      author: getSafeStringValue(detail.author, "MIRA Editorial"),
      authorStyle: detail.authorStyle || { textColor: "#FFFFFF" },
      authorTitle: getSafeStringValue(detail.authorTitle, "Curator & Travel Writer"),
      authorTitleStyle: detail.authorTitleStyle || { textColor: "rgba(255, 255, 255, 0.75)" },
      tagPlace: getSafeStringValue(detail.tagPlace),
      tagTheme: getSafeStringValue(detail.tagTheme, "Culture"),
      tagLens: getSafeStringValue(detail.tagLens, "Tradition"),
      destinationPlace: getSafeStringValue(detail.destinationPlace),
      journeyIds: Array.isArray(detail.journeyIds) ? detail.journeyIds : [],
      manualRelatedStoryIds: Array.isArray(detail.manualRelatedStoryIds) ? detail.manualRelatedStoryIds : [],
      blocks: normalizedBlocks,
    },
    createdAt: safe.createdAt,
    updatedAt: safe.updatedAt,
  }
}
