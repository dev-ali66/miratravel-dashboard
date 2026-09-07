import { useMemo } from "react"
import {
  MapPin,
  Compass,
  Sparkles,
  BookOpen,
  Clock,
  ArrowRight,
  Bookmark,
  CheckCircle2,
} from "lucide-react"
import type { Story, CmsButton, ArticleBlock } from "./storyTypes"
import { useStoryJourneys } from "@/hooks/story/useStoryJourneys"
import { useGetStories } from "@/hooks/story/useGetStories"
import { useStoryFooterCms } from "@/hooks/story/useStoryFooterCms"
import { FooterPreview } from "../CMS/Footer/FooterPreview"
import type { FooterPageData } from "../CMS/Footer/footerTypes"
import { getDefaultCmsPageData } from "../CMS/shared/defaultCmsData"
import { UniversalMultimediaPreview } from "../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../CMS/shared/fieldStyle"

interface StoryPreviewProps {
  formData: {
    title: string
    titleStyle?: Record<string, any>
    slug: string
    category: string
    description: string
    descriptionStyle?: Record<string, any>
    readTime: string
    readTimeStyle?: Record<string, any>
    templateType: string
    image: string
    heroMultimedia?: Record<string, any>
    buttons?: CmsButton[]
    tagPlace: string
    tagTheme: string
    tagLens: string
    destinationPlace: string
    author: string
    authorStyle?: Record<string, any>
    authorTitle: string
    authorTitleStyle?: Record<string, any>
    journeyIds: string[]
    manualRelatedStoryIds: string[]
    blocks: Array<ArticleBlock>
  }
}

export function StoryPreview({ formData }: StoryPreviewProps) {
  const { data: journeysData } = useStoryJourneys(1, 50)
  const { data: storiesData } = useGetStories()
  const { data: footerCmsData } = useStoryFooterCms()

  const allJourneys = useMemo(() => journeysData?.data || [], [journeysData])
  const allStories = useMemo(() => storiesData?.data || [], [storiesData])

  // Compute Dynamic CMS Footer Data safely
  const footerData = useMemo(() => {
    const rawData = footerCmsData?.data
    const item = Array.isArray(rawData) ? rawData[0] : rawData
    if (item && (item.data?.theme || item.data?.content)) {
      return item as FooterPageData
    }
    return getDefaultCmsPageData("footer", "Footer") as unknown as FooterPageData
  }, [footerCmsData])

  // Filter linked Journeys
  const linkedJourneys = useMemo(() => {
    if (!formData.journeyIds || formData.journeyIds.length === 0) return []
    return allJourneys.filter((j: any) => formData.journeyIds.includes(j.id))
  }, [allJourneys, formData.journeyIds])

  // Compute Related Stories based on Tag Overlap Algorithm (3 > 2 > 1) & Manual Overrides
  const relatedStories = useMemo(() => {
    if (!allStories || allStories.length === 0) return []

    // 1. Check manual overrides first
    const manualStories = allStories.filter((s: Story) =>
      formData.manualRelatedStoryIds?.includes(s.id)
    )

    // 2. Score remaining stories based on tag matching
    const scoredStories = allStories
      .filter((s: Story) => !formData.manualRelatedStoryIds?.includes(s.id))
      .map((s: Story) => {
        let score = 0
        const detail = s.detail || {}
        if (formData.tagPlace && detail.tagPlace?.toLowerCase() === formData.tagPlace.toLowerCase()) score += 1
        if (formData.tagTheme && detail.tagTheme?.toLowerCase() === formData.tagTheme.toLowerCase()) score += 1
        if (formData.tagLens && detail.tagLens?.toLowerCase() === formData.tagLens.toLowerCase()) score += 1
        return { story: s, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.story)

    // Combine manual overrides + scored algorithm results up to 3 cards
    const combined = [...manualStories, ...scoredStories]
    return combined.slice(0, 3)
  }, [allStories, formData.manualRelatedStoryIds, formData.tagPlace, formData.tagTheme, formData.tagLens])

  const defaultCover =
    formData.heroMultimedia?.url ||
    formData.heroMultimedia?.imageData?.url ||
    formData.image ||
    "https://images.unsplash.com/photo-1548625361-18da857bbf08?auto=format&fit=crop&w=1400&q=80"

  const displayPlace = formData.destinationPlace || formData.tagPlace || "Balkans"
  const isGuideTemplate =
    (formData.templateType || "").toLowerCase().includes("guide")

  return (
    <div className="w-full bg-[#FCFBF9] dark:bg-background text-foreground font-sans antialiased min-h-screen selection:bg-[#af6348] selection:text-white">
      {/* ====================================================
          1. Hero Header Banner
             Full-width media background with centered text overlay
      ==================================================== */}
      <header data-section="sec-identity" className="relative min-h-[460px] w-full overflow-hidden md:min-h-[540px]">
        {/* Background Multimedia */}
        <UniversalMultimediaPreview
          multimedia={formData.heroMultimedia}
          fallbackImageSrc={defaultCover}
          fallbackAlt={formData.title || "Story Cover Media"}
          fallbackColor="#0F2A2E"
          mode="background"
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0"
        />

        {/* Gradient Overlay for Text Readability */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,42,46,0.65) 0%, rgba(15,42,46,0.45) 50%, rgba(15,42,46,0.85) 100%)",
          }}
        />

        {/* Hero Content Overlay */}
        <div className="relative z-20 flex min-h-[460px] flex-col items-center justify-center px-6 py-16 text-center text-white md:min-h-[540px] md:px-12 md:py-24">
          {/* Breadcrumb Label */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs font-bold tracking-[0.2em] text-amber-200/90 uppercase">
            <span>{formData.templateType || "Long Story"}</span>
            <span className="opacity-40">•</span>
            <span>{formData.category || "Culture & Heritage"}</span>
            {displayPlace && (
              <>
                <span className="opacity-40">•</span>
                <span className="text-white/80">{displayPlace}</span>
              </>
            )}
          </div>

          {/* Hero Title */}
          <h1
            className="max-w-4xl font-serif text-2xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-md break-words"
            style={fieldCssStyle(formData.titleStyle)}
          >
            {formData.title || "Stories from the Balkans"}
          </h1>

          {/* Hero Description */}
          <p
            className="mt-6 max-w-2xl text-sm font-normal leading-relaxed text-amber-50/90 sm:text-base md:text-xl drop-shadow-xs break-words"
            style={fieldCssStyle(formData.descriptionStyle)}
          >
            {formData.description ||
              "Discover rich cultures, breathtaking landscapes, and timeless stories — one journey at a time."}
          </p>

          {/* Three-Tag Taxonomy Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {formData.tagPlace && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <MapPin className="h-3.5 w-3.5 text-amber-300" />
                {formData.tagPlace}
              </span>
            )}
            {formData.tagTheme && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <Compass className="h-3.5 w-3.5 text-emerald-300" />
                {formData.tagTheme}
              </span>
            )}
            {formData.tagLens && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                {formData.tagLens}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {formData.buttons && formData.buttons.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {formData.buttons.map((btn, index) => (
                <a
                  key={index}
                  href={btn.url || "#"}
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-lg transition-all hover:opacity-90 hover:scale-105"
                  style={{
                    backgroundColor: btn.backgroundColor || (btn.style === "outline" ? "transparent" : "#af6348"),
                    color: btn.textColor || "#FFFFFF",
                    border: btn.style === "outline" ? "1px solid rgba(255, 255, 255, 0.4)" : "none",
                  }}
                >
                  {btn.label || "Explore Story"}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}

          {/* Author & Reading Time Sub-Bar */}
          <div className="mt-10 flex w-full max-w-2xl flex-wrap items-center justify-between border-t border-white/20 pt-4 text-xs text-white/80">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 text-amber-200 font-bold text-xs border border-amber-300/30">
                {(formData.author || "M")[0]}
              </div>
              <div className="text-left">
                <p className="font-semibold text-white" style={fieldCssStyle(formData.authorStyle)}>
                  {formData.author || "MIRA Editorial"}
                </p>
                <p className="text-[10px] text-white/70" style={fieldCssStyle(formData.authorTitleStyle)}>
                  {formData.authorTitle || "Curator & Travel Writer"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 font-medium" style={fieldCssStyle(formData.readTimeStyle)}>
                <Clock className="h-3.5 w-3.5 text-amber-300" />
                {formData.readTime || "5 min read"}
              </span>
              <span className="flex items-center gap-1.5 font-medium capitalize">
                <BookOpen className="h-3.5 w-3.5 text-emerald-300" />
                {formData.templateType || "long-story"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================
          2. Editorial Narrative Content (Dynamic Blocks)
      ==================================================== */}
      <section data-section="sec-builder" className="w-full px-6 py-14 md:px-12 md:py-20 bg-background transition-colors">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          {formData.blocks && formData.blocks.length > 0 ? (
            formData.blocks.map((block) => {
              // 1. Heading H2
              if (block.type === "heading") {
                return (
                  <h2
                    key={block.id}
                    className="mt-4 font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl border-b border-border/40 pb-3"
                    style={fieldCssStyle(block.textStyle)}
                  >
                    {block.text || block.title || "Section Heading"}
                  </h2>
                )
              }

              // 2. Large Pull Quote (Terracotta Accent Quote)
              if (block.type === "quote") {
                return (
                  <div key={block.id} className="my-8 text-center px-4 md:px-8 py-6">
                    <p
                      className="font-serif text-2xl font-medium leading-relaxed text-[#af6348] md:text-3xl italic"
                      style={fieldCssStyle(block.textStyle)}
                    >
                      "{block.text || "The Balkans are not discovered quickly. They unfold slowly, revealing themselves to those who take the time to listen."}"
                    </p>
                    <div className="mx-auto mt-4 h-0.5 w-16 bg-[#af6348]/40" />
                  </div>
                )
              }

              // 3. Spotlight Block (Image Left + Text Right OR Text Left + Image Right)
              if (block.type === "spotlight") {
                const isImageLeft = block.layout !== "image-right"
                return (
                  <div
                    key={block.id}
                    className={`my-6 flex flex-col gap-6 md:flex-row md:items-center ${
                      isImageLeft ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="w-full md:w-1/2">
                      <div className="overflow-hidden rounded-xl border border-border/60 shadow-lg aspect-[4/3]">
                        <UniversalMultimediaPreview
                          multimedia={block.multimedia}
                          fallbackImageSrc={block.url || defaultCover}
                          fallbackAlt={block.title || "Spotlight Image"}
                          mode="inline"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-3 md:w-1/2">
                      {block.title && (
                        <h3 className="font-serif text-xl font-bold text-foreground md:text-2xl" style={fieldCssStyle(block.textStyle)}>
                          {block.title}
                        </h3>
                      )}
                      {block.text && (
                        <p className="text-sm font-normal leading-relaxed text-muted-foreground md:text-base">
                          {block.text}
                        </p>
                      )}
                      {block.highlights && block.highlights.length > 0 && (
                        <ul className="mt-2 space-y-1.5 text-xs text-foreground/80">
                          {block.highlights.map((hl, hIdx) => (
                            <li key={hIdx} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#af6348]" />
                              <span>{hl}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )
              }

              // 4. 2-Column Gallery
              if (block.type === "gallery") {
                return (
                  <div key={block.id} className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-xl border border-border/60 shadow-md aspect-[4/3]">
                      <UniversalMultimediaPreview
                        multimedia={block.multimedia}
                        fallbackImageSrc={block.url || defaultCover}
                        fallbackAlt="Gallery Image 1"
                        mode="inline"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden rounded-xl border border-border/60 shadow-md aspect-[4/3]">
                      <UniversalMultimediaPreview
                        multimedia={block.secondMultimedia}
                        fallbackImageSrc={block.secondUrl || defaultCover}
                        fallbackAlt="Gallery Image 2"
                        mode="inline"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )
              }

              // 5. Practical Notes Grid (Guide Story 2x2 Box)
              if (block.type === "practical-notes") {
                const items = block.items || [
                  { title: "Getting There", content: "Fly to Tirana or Dubrovnik. Rental cars recommended for mountain passes." },
                  { title: "Accommodation", content: "Traditional stone guesthouses (Kullas) & boutique eco-lodges." },
                  { title: "What to Pack", content: "Sturdy hiking boots, rain jacket, offline maps & cash for rural villages." },
                  { title: "Cultural Etiquette", content: "Warm hospitality is customary. Small token gifts are appreciated." },
                ]
                return (
                  <div key={block.id} className="my-8 rounded-2xl border border-[#af6348]/30 bg-[#FDFAF7] p-6 shadow-sm dark:bg-card/70 md:p-8">
                    <h3 className="mb-6 font-serif text-xl font-bold text-[#af6348] text-center">
                      {block.title || "Practical Notes"}
                    </h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {items.map((item, iIdx) => (
                        <div key={iIdx} className="flex flex-col gap-1">
                          <span className="text-xs font-bold tracking-wider text-[#af6348] uppercase">
                            {item.title}
                          </span>
                          <p className="text-xs leading-relaxed text-muted-foreground">
                            {item.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }

              // 6. Single Image / Media Block
              if (block.type === "image" && (block.url || block.multimedia?.url || block.multimedia?.imageData?.url || block.multimedia?.videoData?.url)) {
                return (
                  <figure key={block.id} className="my-6 flex flex-col gap-3">
                    <div className="overflow-hidden rounded-xl border border-border/60 shadow-md aspect-[16/9]">
                      <UniversalMultimediaPreview
                        multimedia={block.multimedia}
                        fallbackImageSrc={block.url}
                        fallbackAlt={block.caption || "Article media"}
                        mode="inline"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {block.caption && (
                      <figcaption
                        className="text-center text-xs italic text-muted-foreground"
                        style={fieldCssStyle(block.captionStyle)}
                      >
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              }

              // 7. Paragraph Block
              return (
                <p
                  key={block.id}
                  className="text-base font-normal leading-loose tracking-wide text-foreground/90 md:text-lg"
                  style={fieldCssStyle(block.textStyle)}
                >
                  {block.text}
                </p>
              )
            })
          ) : (
            <p className="text-base italic text-muted-foreground py-8 text-center">
              No narrative blocks created yet. Add content blocks in the left form builder.
            </p>
          )}
        </div>
      </section>

      {/* ====================================================
          3. MIRA Travel Notes Callout Box
      ==================================================== */}
      <section data-section="sec-taxonomy" className="w-full px-6 pb-14 md:px-12 md:pb-20 bg-background transition-colors">
        <div className="mx-auto max-w-4xl rounded-2xl border-l-4 border-[#af6348] border-y border-r border-border/60 bg-[#FDFAF7] p-6 shadow-sm dark:bg-card/60 md:p-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-widest text-[#af6348] uppercase">
            <Bookmark className="h-4 w-4" />
            <span>MIRA Travel Notes</span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Geographical Focus
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {displayPlace}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Primary Editorial Lens
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formData.tagTheme || "Culture"} &bull; {formData.tagLens || "Tradition"}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Curated By
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formData.author || "MIRA Editorial Team"}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Linked Journeys
              </span>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {linkedJourneys.length} Experience(s) Connected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          4. Relational Module: Linked / Similar Journeys
      ==================================================== */}
      {linkedJourneys.length > 0 && (
        <section data-section="sec-journeys" className="w-full border-t border-border/60 bg-[#F8F6F0] dark:bg-card/30 px-6 py-14 md:px-12 md:py-20 transition-colors">
          <div className="mb-8 max-w-4xl mx-auto text-center md:text-left">
            <span className="text-xs font-bold tracking-widest text-[#af6348] uppercase">
              {isGuideTemplate ? "SIMILAR JOURNEYS" : "CURATED EXPERIENCES"}
            </span>
            <h3 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">
              {isGuideTemplate ? "Similar Journeys" : "Journeys Connected to this Story"}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              A selection of destination journeys carefully planned for our most discerning travelers.
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid grid-cols-1 gap-6 md:grid-cols-3">
            {linkedJourneys.map((journey: any) => (
              <div
                key={journey.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-[#af6348]/50 hover:shadow-xl"
              >
                {journey.image && (
                  <div className="relative h-44 w-full overflow-hidden bg-muted">
                    <img
                      src={journey.image}
                      alt={journey.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-[#af6348] uppercase">
                      {journey.duration || "Bespoke Journey"}
                    </span>
                    <h4 className="mt-1 font-serif text-base font-bold text-foreground transition-colors group-hover:text-[#af6348]">
                      {journey.title}
                    </h4>
                    {journey.subtitle && (
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {journey.subtitle}
                      </p>
                    )}
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3">
                    <span className="text-xs font-bold text-foreground">
                      {journey.price ? `$${journey.price}` : "Custom Quote"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#af6348] transition-transform group-hover:translate-x-1">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================
          5. Relational Module: Related Editorial Stories
      ==================================================== */}
      {relatedStories.length > 0 && (
        <section data-section="sec-related" className="w-full border-t border-border/60 bg-background px-6 py-14 md:px-12 md:py-20 transition-colors">
          <div className="mb-8 max-w-4xl mx-auto text-center md:text-left">
            <span className="text-xs font-bold tracking-widest text-[#af6348] uppercase">
              KEEP EXPLORING
            </span>
            <h3 className="mt-1 font-serif text-2xl font-bold text-foreground md:text-3xl">
              Related Editorial Stories
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              A selection of destinations curated by experienced travelers.
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedStories.map((story: Story) => (
              <div
                key={story.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {story.image && (
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-[#af6348] uppercase">
                      {story.category || "Editorial"}
                    </span>
                    <h4 className="mt-1 font-serif text-base font-bold text-foreground line-clamp-2 transition-colors group-hover:text-[#af6348]">
                      {story.title}
                    </h4>
                    {story.description && (
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {story.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#af6348]" />
                      {story.readTime || "5 min read"}
                    </span>
                    <span className="font-bold text-[#af6348]">Read Story &rarr;</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ====================================================
          6. Dynamic CMS Footer Preview Component
      ==================================================== */}
      <div data-section="sec-footer" className="w-full">
        <FooterPreview footerData={footerData} />
      </div>
    </div>
  )
}
