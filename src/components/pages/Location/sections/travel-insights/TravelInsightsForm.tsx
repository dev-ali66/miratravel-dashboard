import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { ButtonsField } from "@/components/pages/CMS/shared/ButtonsField"
import { FormSection } from "../../shared/fields"
import type { LocationFormSectionProps } from "../../config/locationSections"
import type { TravelInsightArticle } from "../../locationTypes"
import { emptyLocation } from "../../shared/emptyLocation"

export function TravelInsightsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const travelInsight =
    draft?.travelInsight ||
    (draft as any)?.data?.travelInsight ||
    (draft as any)?.travel_insights ||
    (draft as any)?.data?.travel_insights || {
      label: {
        value: "TRAVEL INSIGHTS",
        textColor: "#d29393",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      title: {
        value: "Everything you need to know before you go",
        textColor: "#e5e5e5",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      featuredMultimedia: null,
      backgroundMultimedia: null,
      articles: [],
    }

  const articles: TravelInsightArticle[] = Array.isArray(travelInsight.articles)
    ? travelInsight.articles
    : []

  const isOpen = Boolean(openSections["travel-insights"])
  const [expandedArticleIndex, setExpandedArticleIndex] = useState<number | null>(0)

  const updateTravelInsightField = (fieldKey: string, value: any) => {
    updateField(`travelInsight.${fieldKey}`, value)
  }

  const updateArticles = (newArticles: TravelInsightArticle[]) => {
    updateTravelInsightField("articles", newArticles)
  }

  const handleAddArticle = () => {
    const newArticle: TravelInsightArticle = {
      category: {
        value: "Guide",
        textColor: "#af6348",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      title: {
        value: "",
        textColor: "#F3F4F6",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      buttons: [
        {
          label: "Read Article",
          url: "#",
          variant: "primary",
        },
      ],
      thumbnailMultimedia: {
        show: "image",
        image: {
          url: "",
          alt: "Article thumbnail",
          opacity: 100,
          overlayColor: "#000000",
          overlayOpacity: 0,
          width: "100%",
          height: "100%",
          aspectRatio: "auto",
          fit: "cover",
        },
      },
    }

    const updated = [...articles, newArticle]
    updateArticles(updated)
    setExpandedArticleIndex(updated.length - 1)
  }

  const handleRemoveArticle = (indexToRemove: number) => {
    const updated = articles.filter((_, idx) => idx !== indexToRemove)
    updateArticles(updated)
    if (expandedArticleIndex === indexToRemove) {
      setExpandedArticleIndex(null)
    } else if (
      expandedArticleIndex !== null &&
      expandedArticleIndex > indexToRemove
    ) {
      setExpandedArticleIndex(expandedArticleIndex - 1)
    }
  }

  const handleMoveArticle = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= articles.length) return

    const updated = [...articles]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    updateArticles(updated)
    setExpandedArticleIndex(targetIndex)
  }

  const handleUpdateArticleItem = (
    index: number,
    fieldKey: keyof TravelInsightArticle,
    value: any
  ) => {
    const updated = articles.map((art, idx) => {
      if (idx !== index) return art
      return {
        ...art,
        [fieldKey]: value,
      }
    })
    updateArticles(updated)
  }



  return (
    <FormSection
      title="Travel Insights & Guide Articles"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("travel-insights")}
    >
      <div className="flex flex-col gap-6">
        {/* Section Header Settings */}
        <div className="rounded-xl border border-border/70 bg-card/60 p-4 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Section Headers & Typography
          </h4>

          {/* Eyebrow Label */}
          <DynamicStyledField
            type="text"
            label="Eyebrow Label (e.g. TRAVEL INSIGHTS)"
            fieldName="travelInsight.label"
            placeholder="e.g. TRAVEL INSIGHTS"
            value={travelInsight.label}
            onChange={(val) => updateTravelInsightField("label", val)}
          />

          {/* Main Title Heading */}
          <DynamicStyledField
            type="text"
            label="Main Section Title"
            fieldName="travelInsight.title"
            placeholder="e.g. Everything you need to know before you go"
            value={travelInsight.title}
            onChange={(val) => updateTravelInsightField("title", val)}
          />

          {/* Section Description / Subhead (Above Image) */}
          <DynamicStyledField
            type="textarea"
            label="Section Description / Overview (Above Image)"
            fieldName="travelInsight.description"
            placeholder="e.g. Explore curated guides, insider tips, and practical travel insights."
            value={travelInsight.description}
            onChange={(val) => updateTravelInsightField("description", val)}
          />
        </div>

        {/* Featured Right Media Card */}
        <UniversalMultimediaForm
          title="Featured Large Image / Card (Right Column)"
          fieldName="travelInsight.featuredMultimedia"
          imageFieldName="locationTravelInsightFeaturedImage"
          videoFieldName="locationTravelInsightFeaturedVideo"
          hideFieldNameBadge={true}
          value={
            travelInsight.featuredMultimedia ||
            (travelInsight.featuredImage
              ? {
                  show: "image",
                  image: {
                    url: travelInsight.featuredImage,
                    alt: travelInsight.featuredImageAlt || "Featured Article",
                  },
                }
              : null)
          }
          onChange={(multimedia) => {
            updateField("travelInsight.featuredMultimedia", multimedia)
          }}
        />

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Media (Image / Video / Color)"
          fieldName="travelInsight.backgroundMultimedia"
          imageFieldName="locationTravelInsightBgImage"
          videoFieldName="locationTravelInsightBgVideo"
          hideFieldNameBadge={true}
          value={travelInsight.backgroundMultimedia || emptyLocation.travelInsights?.backgroundMultimedia || emptyLocation.travelInfo?.backgroundMultimedia}
          onChange={(multimedia) =>
            updateTravelInsightField("backgroundMultimedia", multimedia)
          }
        />

        {/* Guide Articles Repeater List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Guide Articles List ({articles.length})
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add travel guide articles, itineraries, food spots, and practical tips.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddArticle}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Article
            </button>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">
                No guide articles added yet
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1 mb-4">
                Click the button below to add your first travel guide article.
              </p>
              <button
                type="button"
                onClick={handleAddArticle}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add First Article
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article, index) => {
                const isItemOpen = expandedArticleIndex === index
                const articleTitle =
                  typeof article.title === "object"
                    ? (article.title as any)?.value || ""
                    : article.title || ""
                const categoryLabel =
                  typeof article.category === "object"
                    ? (article.category as any)?.value || ""
                    : article.category || ""
                const thumbUrl =
                  (article.thumbnailMultimedia as any)?.image?.url ||
                  (article.thumbnailMultimedia as any)?.imageData?.url ||
                  (typeof article.thumbnailMultimedia === "string"
                    ? article.thumbnailMultimedia
                    : "") ||
                  article.thumbnail ||
                  ""

                return (
                  <div
                    key={`article-${index}`}
                    className={`rounded-xl border transition-all duration-200 ${
                      isItemOpen
                        ? "border-primary/50 bg-card shadow-sm"
                        : "border-border/70 bg-card/60 hover:border-border"
                    }`}
                  >
                    {/* Item Header / Accordion Bar */}
                    <div className="flex items-center justify-between p-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedArticleIndex(isItemOpen ? null : index)
                        }
                        className="flex flex-1 items-center gap-3 text-left overflow-hidden group cursor-pointer"
                      >
                        {/* Number Badge */}
                        <span className="flex h-6 w-7 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-mono font-semibold text-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {/* Thumbnail Preview in Form */}
                        {thumbUrl ? (
                          <img
                            src={thumbUrl}
                            alt=""
                            className="h-8 w-8 rounded object-cover border border-border/50 shrink-0"
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
                            <ImageIcon className="h-3.5 w-3.5" />
                          </div>
                        )}

                        {/* Title & Category Snippet */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                            {articleTitle || "Untitled Article"}
                          </p>
                          <p className="truncate text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                            {categoryLabel || "General Guide"}
                          </p>
                        </div>
                      </button>

                      {/* Reorder and Delete Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveArticle(index, "up")}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === articles.length - 1}
                          onClick={() => handleMoveArticle(index, "down")}
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
                          title="Move down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveArticle(index)}
                          className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-1 cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedArticleIndex(isItemOpen ? null : index)
                          }
                          className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors ml-1 cursor-pointer"
                        >
                          {isItemOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Item Form Body */}
                    {isItemOpen && (
                      <div className="border-t border-border/60 p-4 space-y-4 bg-muted/5 rounded-b-xl">
                        {/* Category Tag */}
                        <DynamicStyledField
                          type="text"
                          label="Category Tag (e.g. Accommodation, Hiking, Food & Drink)"
                          fieldName={`travelInsight.articles.${index}.category`}
                          placeholder="e.g. Accommodation"
                          value={article.category}
                          onChange={(val) =>
                            handleUpdateArticleItem(index, "category", val)
                          }
                        />

                        {/* Article Headline / Title */}
                        <DynamicStyledField
                          type="textarea"
                          label="Article Headline / Description"
                          fieldName={`travelInsight.articles.${index}.title`}
                          placeholder="e.g. Where to stay in Berat: guesthouses ranked by neighbourhood"
                          value={article.title}
                          onChange={(val) =>
                            handleUpdateArticleItem(index, "title", val)
                          }
                        />

                        {/* Action Buttons Component (Same as Hero buttons) */}
                        <ButtonsField
                          label="Action Buttons"
                          fieldName={`travelInsight.articles.${index}.buttons`}
                          value={
                            Array.isArray(article.buttons) && article.buttons.length > 0
                              ? article.buttons
                              : article.button
                                ? [
                                    {
                                      label: article.button.label || "Read Article",
                                      url: article.button.url || article.href || "#",
                                      style: article.button.style,
                                      backgroundColor: article.button.backgroundColor,
                                      textColor: article.button.textColor,
                                    },
                                  ]
                                : article.href
                                  ? [{ label: "Read Article", url: article.href || "#" }]
                                  : [{ label: "Read Article", url: "#" }]
                          }
                          onChange={(newButtons) =>
                            handleUpdateArticleItem(index, "buttons", newButtons)
                          }
                        />

                        {/* Article Thumbnail Media */}
                        <UniversalMultimediaForm
                          title="Article Thumbnail Image"
                          allowVideo={false}
                          allowColor={false}
                          hideFieldNameBadge={true}
                          collapsible={false}
                          value={
                            article.thumbnailMultimedia ||
                            (article.thumbnail
                              ? {
                                  show: "image",
                                  image: {
                                    url: article.thumbnail,
                                    alt: "Article thumbnail",
                                  },
                                }
                              : null)
                          }
                          onChange={(multimedia) => {
                            handleUpdateArticleItem(
                              index,
                              "thumbnailMultimedia",
                              multimedia
                            )
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </FormSection>
  )
}
