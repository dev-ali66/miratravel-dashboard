import { normalizeMultimedia, normalizeStyledField, normalizeButtonsArray } from "../../shared/normalizeHelpers"

export function normalizeTravelInsights(travelInsights: any) {
  const safeInsights = travelInsights && typeof travelInsights === "object" ? travelInsights : {}

  const normalizedTravelInsights = {
    ...safeInsights,
    label: normalizeStyledField(safeInsights.label, "TRAVEL INSIGHTS", "#af6348"),
    title: normalizeStyledField(safeInsights.title, "", "#182d09"),
    subtitle: normalizeStyledField(safeInsights.subtitle, "", "#565e69"),
    featuredArticle:
      safeInsights.featuredArticle ||
      (safeInsights.articles && safeInsights.articles[0]
        ? {
            category: normalizeStyledField(
              safeInsights.articles[0].category,
              "Guide",
              "#af6348"
            ),
            title: normalizeStyledField(
              safeInsights.articles[0].title,
              "",
              "#F3F4F6"
            ),
            description: normalizeStyledField(
              safeInsights.articles[0].description,
              "",
              "#9CA3AF"
            ),
            buttons: normalizeButtonsArray(
              safeInsights.articles[0].buttons || [{ label: "Read Article", url: safeInsights.articles[0].href || "#" }]
            ),
            thumbnailMultimedia: normalizeMultimedia(
              safeInsights.articles[0].thumbnailMultimedia ??
                safeInsights.articles[0].imageMultimedia,
              "image"
            ),
          }
        : null),
    backgroundMultimedia: normalizeMultimedia(
      safeInsights.backgroundMultimedia,
      "color"
    ),
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
            description: normalizeStyledField(art.description, "", "#9CA3AF"),
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
      : [],
  }

  delete (normalizedTravelInsights as any).featuredImage
  delete (normalizedTravelInsights as any).featuredImageAlt
  delete (normalizedTravelInsights as any).labelStyle
  delete (normalizedTravelInsights as any).titleStyle
  delete (normalizedTravelInsights as any).style

  return normalizedTravelInsights
}
