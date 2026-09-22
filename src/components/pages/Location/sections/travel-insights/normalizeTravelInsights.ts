import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "../../shared/normalizeHelpers"
import { emptyTravelInsights } from "./emptyTravelInsights"

export function normalizeTravelInsights(travelInsights: any) {
  const safeInsights = travelInsights && typeof travelInsights === "object" ? travelInsights : {}

  const normalizedTravelInsights = {
    ...safeInsights,
    label: normalizeStyledField(safeInsights.label ?? emptyTravelInsights.label, "TRAVEL INSIGHTS", "#af6348"),
    title: normalizeStyledField(safeInsights.title ?? emptyTravelInsights.title, "", "#182d09"),
    description: normalizeStyledField(safeInsights.description ?? emptyTravelInsights.description, "", "#d4d4d4"),
    featuredMultimedia: normalizeMultimedia(safeInsights.featuredMultimedia || emptyTravelInsights.featuredMultimedia, "image"),
    backgroundMultimedia: normalizeMultimedia(safeInsights.backgroundMultimedia || emptyTravelInsights.backgroundMultimedia, "color"),
    articles: Array.isArray(safeInsights.articles)
      ? safeInsights.articles.map((art: any) => {
          const resolvedThumb =
            art.thumbnail ??
            art.thumbnailMultimedia?.image?.url ??
            art.imageMultimedia?.image?.url ??
            art.image ??
            ""

          const rawButtons = Array.isArray(art.buttons) && art.buttons.length > 0
            ? art.buttons
            : art.button
              ? [art.button]
              : [{ label: "Read Article", url: art.href || "#" }]

          const normArt: any = {
            category: normalizeStyledField(art.category, "Guide", "#af6348"),
            title: normalizeStyledField(art.title, "", "#F3F4F6"),
            buttons: normalizeButtonsArray(rawButtons),
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
                  : null),
              "image"
            ),
          }
          delete normArt.href
          delete normArt.number
          delete normArt.thumbnail
          delete normArt.id
          delete normArt.categoryStyle
          delete normArt.titleStyle
          delete normArt.descriptionStyle
          delete normArt.style
          return normArt
        })
      : (emptyTravelInsights.articles ?? []),
  }

  delete (normalizedTravelInsights as any).subtitle
  delete (normalizedTravelInsights as any).sub_heading
  delete (normalizedTravelInsights as any).featuredImage
  delete (normalizedTravelInsights as any).featuredImageAlt
  delete (normalizedTravelInsights as any).labelStyle
  delete (normalizedTravelInsights as any).titleStyle
  delete (normalizedTravelInsights as any).descriptionStyle
  delete (normalizedTravelInsights as any).style

  return normalizedTravelInsights
}

