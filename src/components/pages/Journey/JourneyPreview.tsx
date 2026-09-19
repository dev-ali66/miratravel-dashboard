import { useState } from "react"
import { useJourneyDraft } from "./shared/JourneyDraftContext"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import {
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Compass,
} from "lucide-react"

export function JourneyPreview() {
  const { draft, activePreviewTab, setActivePreviewTab } = useJourneyDraft()
  const [activeTab, setActiveTab] = useState(activePreviewTab || "overview")

  // State for expanded day in Itinerary
  const [expandedDay, setExpandedDay] = useState<number | string | null>(1)
  // State for expanded add-on
  const [expandedAddon, setExpandedAddon] = useState<number | string | null>(0)

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey)
    setActivePreviewTab(tabKey)
  }

  if (!draft) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center p-8 text-muted-foreground font-sans">
        No journey draft loaded.
      </div>
    )
  }

  const hero = draft.hero || {}
  const overview = draft.overview || {}
  const itinerary = draft.itinerary || {}
  const accommodations = draft.accommodations || {}
  const whatsIncluded = draft.whatsIncluded || {}
  const addOns = draft.addOns || {}
  const gallery = draft.gallery || {}

  const heroTitle = hero.title || draft.title || "Yellowstone Wilderness"
  const heroMultimedia = hero.backgroundMultimedia
  const heroBgImage = hero.background_image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"

  const priceFormatted = `${draft.currency === "EUR" ? "€" : draft.currency === "USD" ? "$" : draft.currency || "$"}${draft.price || "3,195"}`

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "itinerary", label: "Itinerary" },
    { key: "accommodation", label: "Accommodation" },
    { key: "included", label: "What's Included" },
    { key: "addons", label: "Add-Ons" },
  ]

  // Default fallback gallery images if empty
  const galleryItems = (gallery.items && gallery.items.length > 0)
    ? gallery.items
    : [
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" },
        { url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=800&q=80" },
      ]

  // Chapters Data Hierarchy (JOURNEY -> CHAPTERS -> DAYS -> EXPERIENCES)
  const chapters = (itinerary.chaptersList && itinerary.chaptersList.length > 0)
    ? itinerary.chaptersList
    : [
        {
          id: "chap-1",
          chapterNumber: "Chapter I",
          title: "The Beginning",
          subtitle: "Days 1–3 · Tirana & surroundings",
          days: [
            {
              dayNumber: 1,
              title: "Arrival in Tirana & Welcome Cocktail",
              location: "Tirana",
              description: "Arrive at Tirana airport with private transfer to your boutique hotel. Enjoy an evening welcome cocktail and traditional introductory dinner.",
              stayName: "Plaza Hotel Tirana",
              image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            },
            {
              dayNumber: 2,
              title: "Historic Berat Castle & Wine Tasting",
              location: "Berat",
              description: "Explore the UNESCO listed town of Berat, visit the castle grounds, and enjoy exclusive wine tasting at a family vineyard.",
              stayName: "Mangalem Heritage Hotel",
              image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
            },
            {
              dayNumber: 3,
              title: "Gjirokastër Stone City Exploration",
              location: "Gjirokastër",
              description: "Discover Gjirokastër's Ottoman architecture, ancient fortress museum, and artisan craft bazaar.",
              stayName: "Gjirokastër Castle Hotel",
              image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
            },
          ],
        },
        {
          id: "chap-2",
          chapterNumber: "Chapter II",
          title: "Into the Mountains",
          subtitle: "Days 4–7 · Northern Alps & Valbona",
          days: [
            {
              dayNumber: 4,
              title: "Theth National Park & Blue Eye Exploration",
              location: "Theth",
              description: "Journey into the heart of the Albanian Alps. Hike to the natural turquoise Blue Eye spring and visit the traditional lock-in tower.",
              stayName: "Theth Alpine Sanctuary",
              image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
            },
          ],
        },
      ]

  return (
    <div className="w-full bg-[#FAF6F0] text-[#2D241E] min-h-screen font-serif selection:bg-[#E5A84B]/20">
      {/* 1. HERO BANNER SECTION */}
      <div className="relative h-[420px] md:h-[500px] w-full flex items-end overflow-hidden">
        {/* Universal Background */}
        <UniversalMultimediaPreview
          multimedia={heroMultimedia ?? undefined}
          fallbackImageSrc={heroBgImage}
          fallbackVideoSrc={hero.video}
          fallbackAlt={heroTitle}
          mode="background"
          className="h-full w-full object-cover"
          containerClassName="absolute inset-0 z-0"
        />

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 pb-10 space-y-4">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
            {heroTitle}
          </h1>

          {/* INDIVIDUAL PILLS WITH MIRA GOLD OUTLINE TREATMENT */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5A84B] bg-black/40 px-3.5 py-1 text-xs font-sans font-medium text-white shadow-xs backdrop-blur">
              <Clock className="h-3.5 w-3.5 text-[#E5A84B]" />
              {draft.minDays || 7} DAYS
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5A84B] bg-black/40 px-3.5 py-1 text-xs font-sans font-medium text-white shadow-xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-[#E5A84B]" />
              {draft.comfortLevel?.replace(/_/g, " ") || "BOUTIQUE"}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5A84B] bg-black/40 px-3.5 py-1 text-xs font-sans font-medium text-white shadow-xs backdrop-blur">
              <Compass className="h-3.5 w-3.5 text-[#E5A84B]" />
              {draft.pace || "BALANCED"}
            </span>

            {(draft.journeyType || []).slice(0, 1).map((type) => (
              <span
                key={type}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E5A84B] bg-black/40 px-3.5 py-1 text-xs font-sans font-medium text-white shadow-xs backdrop-blur uppercase"
              >
                {type.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. STICKY TABS NAVIGATION BAR */}
      <div className="sticky top-0 z-30 bg-[#FAF6F0] border-b border-[#EAE3D9] px-6 md:px-12 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-8 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const isActive = activeTab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => handleTabChange(t.key)}
                className={`relative py-4 text-sm md:text-base font-serif font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive ? "text-[#E5A84B] font-semibold" : "text-[#5A4E44] hover:text-[#2D241E]"
                }`}
              >
                {t.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E5A84B] rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. MAIN TWO-COLUMN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] gap-10 items-start">
          
          {/* =========================================================
              LEFT COLUMN: ACTIVE TAB CONTENT
          ========================================================= */}
          <div className="w-full min-w-0 space-y-12">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-12">
                {/* Section 1: Why we designed this journey? */}
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#2D241E]">
                    Why we designed this journey?
                  </h2>

                  <div className="space-y-3 font-sans text-sm md:text-base text-[#5A4E44] leading-relaxed">
                    <p>
                      {overview.overviewText ||
                        "Viverra blandit neque ac risus euismod tincidunt ut nec velit. Hendrerit potenti eleifend hendrerit lobortis enim duis duis rhoncus vulputate. Integer volutpat purus feugiat eros sed volutpat mauris faucibus."}
                    </p>
                    <p>
                      Fringilla cras malesuada suscipit felis pretium. Rutrum eget eleifend nisi dui pulvinar elementum magnis. Vulputate commodo ultrices id tincidunt imperdiet mauris.
                    </p>
                  </div>

                  <div className="flex justify-end pt-2">
                    <span className="text-[#E5A84B] font-serif font-semibold text-lg flex items-center gap-1.5">
                      — MIRA <span className="text-xs">✦</span>
                    </span>
                  </div>
                </div>

                {/* Section 2: Journey Overview */}
                <div className="space-y-4 pt-6 border-t border-[#EAE3D9]">
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#2D241E]">
                    {overview.title || "Journey Overview"}
                  </h2>

                  <div className="space-y-3 font-sans text-sm md:text-base text-[#5A4E44] leading-relaxed">
                    <p>
                      Immerse yourself in the timeless beauty and rich history of the region on this carefully curated 7-day journey. From ancient fortress ruins to breathtaking mountain vistas, experience the very best of authentic local culture, cuisine, and hospitality.
                    </p>
                    <p>
                      This journey is designed for travelers who appreciate depth over breadth. Rather than rushing through a checklist of sites, we've built in time to truly absorb each destination.
                    </p>
                  </div>
                </div>

                {/* Section 3: Highlights */}
                <div className="space-y-4 pt-6 border-t border-[#EAE3D9]">
                  <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#2D241E]">
                    Highlights
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-sm text-[#5A4E44]">
                    {(overview.highlightsList && overview.highlightsList.length > 0
                      ? overview.highlightsList
                      : [
                          { title: "Private Ottoman castle and fortress tour" },
                          { title: "UNESCO heritage museum with local expert" },
                          { title: "Ancient archaeological park exploration" },
                          { title: "Local vineyard wine tasting & cooking class" },
                          { title: "Traditional village artisan craft workshops" },
                          { title: "Authentic trattoria dining experiences" },
                        ]
                    ).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[#E5A84B] font-bold">✓</span>
                        <span>{hl.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Gallery Grid (1 large left + 4 right 2x2 grid) */}
                <div className="space-y-4 pt-6 border-t border-[#EAE3D9]">
                  <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#2D241E]">
                    Gallery
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Large Photo */}
                    <div className="h-[280px] md:h-[340px] rounded-xl overflow-hidden shadow-xs">
                      <img
                        src={galleryItems[0]?.url || heroBgImage}
                        alt="Gallery main"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Right 2x2 Photos Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {galleryItems.slice(1, 5).map((img, i) => (
                        <div key={i} className="h-[132px] md:h-[162px] rounded-xl overflow-hidden shadow-xs">
                          <img
                            src={img.url || heroBgImage}
                            alt={`Gallery ${i + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 5: Is this Journey for you? */}
                <div className="space-y-4 pt-6 border-t border-[#EAE3D9]">
                  <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#2D241E]">
                    Is this Journey for you?
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans text-sm text-[#5A4E44]">
                    {(draft.perfectFor && draft.perfectFor.length > 0
                      ? draft.perfectFor
                      : ["COUPLES", "FAMILIES", "FIRST_TIME_VISITORS", "NATURE_LOVERS"]
                    ).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[#E5A84B] font-bold">✓</span>
                        <span>Perfect for {item.replace(/_/g, " ").toLowerCase()} seeking bespoke travel</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ITINERARY (CHAPTERS -> DAYS -> EXPERIENCES) */}
            {activeTab === "itinerary" && (
              <div className="space-y-10">
                {/* Section 1: Journey Route */}
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#2D241E]">
                    Journey Route
                  </h2>
                  <p className="font-sans text-sm text-[#5A4E44]">
                    Follow the highlights of your journey on a carefully crafted route.
                  </p>

                  {/* Route Map Card (Primary focus on Journey Route & Stops) */}
                  <div className="rounded-2xl border border-[#EAE3D9] bg-[#F4EFEA] p-4 grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-4 items-center">
                    <div className="space-y-2 p-2 font-sans">
                      <span className="text-xs font-bold text-[#E5A84B] uppercase tracking-wider">
                        JOURNEY STOPS
                      </span>
                      <ul className="space-y-2 text-xs text-[#2D241E]">
                        <li className="flex items-center gap-2">
                          <span className="size-5 rounded-full bg-[#182D09] text-white flex items-center justify-center text-[10px] font-bold">
                            1
                          </span>
                          <span className="font-semibold">Tirana</span>
                          <span className="text-[10px] text-[#5A4E44]">Day 1</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="size-5 rounded-full bg-[#182D09] text-white flex items-center justify-center text-[10px] font-bold">
                            2
                          </span>
                          <span className="font-semibold">Berat</span>
                          <span className="text-[10px] text-[#5A4E44]">Day 2</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="size-5 rounded-full bg-[#182D09] text-white flex items-center justify-center text-[10px] font-bold">
                            3
                          </span>
                          <span className="font-semibold">Gjirokastër</span>
                          <span className="text-[10px] text-[#5A4E44]">Day 3</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="size-5 rounded-full bg-[#182D09] text-white flex items-center justify-center text-[10px] font-bold">
                            4
                          </span>
                          <span className="font-semibold">Theth</span>
                          <span className="text-[10px] text-[#5A4E44]">Day 4</span>
                        </li>
                      </ul>
                    </div>

                    <div className="h-[220px] rounded-xl overflow-hidden bg-slate-200 relative">
                      <img
                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                        alt="Journey Route Map"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                        <span className="bg-white/95 px-3 py-1.5 rounded-full text-xs font-sans font-semibold text-[#2D241E] shadow-sm">
                          📍 Journey Route & Stops Map
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2: CHAPTERS HIERARCHY (JOURNEY -> CHAPTERS -> DAYS -> EXPERIENCES) */}
                <div className="space-y-8 pt-6 border-t border-[#EAE3D9]">
                  <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#2D241E]">
                      Day by Day Itinerary
                    </h2>
                    <p className="font-sans text-sm text-[#5A4E44]">
                      Explore each chapter and day of your curated journey.
                    </p>
                  </div>

                  {/* CHAPTERS RENDERER */}
                  <div className="space-y-10">
                    {chapters.map((chap, cIdx) => (
                      <div key={chap.id || cIdx} className="space-y-4">
                        {/* CHAPTER HEADER */}
                        <div className="space-y-1 pb-2 border-b border-[#E5A84B]/40">
                          <span className="text-xs font-sans font-bold text-[#E5A84B] uppercase tracking-widest">
                            {chap.chapterNumber || `Chapter ${cIdx + 1}`}
                          </span>
                          <h3 className="text-xl md:text-2xl font-serif font-bold text-[#2D241E]">
                            {chap.title}
                          </h3>
                          {chap.subtitle && (
                            <p className="font-sans text-xs text-[#5A4E44]">
                              {chap.subtitle}
                            </p>
                          )}
                        </div>

                        {/* DAYS UNDER CHAPTER */}
                        <div className="space-y-3">
                          {(chap.days || []).map((day, dIdx) => {
                            const dayNum = day.dayNumber || dIdx + 1
                            const isOpen = expandedDay === dayNum

                            return (
                              <div
                                key={dIdx}
                                className="rounded-xl border border-[#EAE3D9] bg-[#F4EFEA] overflow-hidden transition-all"
                              >
                                <button
                                  type="button"
                                  onClick={() => setExpandedDay(isOpen ? null : dayNum)}
                                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="size-7 rounded-full bg-[#182D09] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                      {dayNum}
                                    </span>

                                    <div className="size-14 rounded-lg overflow-hidden shrink-0 bg-slate-300">
                                      <img
                                        src={day.image || heroBgImage}
                                        alt={day.title}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>

                                    <div>
                                      <span className="text-[11px] font-sans font-medium text-[#E5A84B] uppercase">
                                        DAY {dayNum}
                                      </span>
                                      <h4 className="text-sm md:text-base font-serif font-bold text-[#2D241E]">
                                        {day.title}
                                      </h4>
                                      {day.location && (
                                        <span className="text-xs font-sans text-[#5A4E44]">
                                          {day.location}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {isOpen ? (
                                    <ChevronUp className="h-5 w-5 text-[#5A4E44]" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-[#5A4E44]" />
                                  )}
                                </button>

                                {isOpen && (
                                  <div className="p-4 pt-0 border-t border-[#EAE3D9]/60 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px] gap-4 items-center">
                                    <div className="space-y-2 font-sans text-xs md:text-sm text-[#5A4E44] leading-relaxed">
                                      <p>{day.description}</p>
                                      {day.stayName && (
                                        <p className="font-semibold text-[#2D241E]">
                                          Overnight: {day.stayName}
                                        </p>
                                      )}
                                    </div>

                                    <div className="h-[160px] rounded-lg overflow-hidden">
                                      <img
                                        src={day.image || heroBgImage}
                                        alt={day.title}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ACCOMMODATION */}
            {activeTab === "accommodation" && (
              <div className="space-y-10">
                {/* Section 1: Philosophy */}
                <div className="space-y-4">
                  <span className="text-xs font-sans font-bold text-[#E5A84B] uppercase tracking-wider">
                    OUR ACCOMMODATION PHILOSOPHY
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <h2 className="text-2xl md:text-4xl font-serif font-semibold text-[#2D241E]">
                      Our Accommodation Philosophy
                    </h2>
                    <p className="font-sans text-xs md:text-sm text-[#5A4E44] leading-relaxed">
                      We handpick properties that reflect the soul of each region, offering authentic luxury, superior comfort, and personal hospitality.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    {["Character", "Location", "Comfort", "Connection"].map((pillar, i) => (
                      <div key={i} className="rounded-xl border border-[#EAE3D9] bg-[#F4EFEA] p-4 text-center space-y-1">
                        <span className="text-lg text-[#E5A84B]">✦</span>
                        <h4 className="text-xs font-sans font-bold text-[#2D241E] uppercase">{pillar}</h4>
                        <p className="text-[11px] font-sans text-[#5A4E44]">Bespoke standards</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: Stays Cards with MIRA Seal */}
                <div className="space-y-4 pt-6 border-t border-[#EAE3D9]">
                  <span className="text-xs font-sans font-bold text-[#E5A84B] uppercase tracking-wider">
                    YOUR ACCOMMODATION JOURNEY
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#2D241E]">
                    Your Accommodation Stays
                  </h2>

                  <div className="space-y-4">
                    {((accommodations.staysList && accommodations.staysList.length > 0)
                      ? accommodations.staysList
                      : [
                          {
                            name: "Plaza Hotel Tirana",
                            stayType: "Luxury Boutique",
                            city: "Tirana",
                            duration: "2 Nights",
                            description: "5-star luxury stay with panoramic spa and fine dining.",
                            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                          },
                          {
                            name: "Mangalem Heritage Hotel",
                            stayType: "Boutique Heritage",
                            city: "Berat",
                            duration: "2 Nights",
                            description: "Restored Ottoman residence in the heart of the historic quarter.",
                            image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
                          },
                        ]
                    ).map((stay, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-[#EAE3D9] bg-[#F4EFEA] overflow-hidden grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)_60px] items-center"
                      >
                        <div className="h-[160px] md:h-full">
                          <img
                            src={stay.image || heroBgImage}
                            alt={stay.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="p-5 space-y-2">
                          <span className="text-xs font-sans font-bold text-[#E5A84B] uppercase">
                            {stay.city} • {stay.duration || "2 Nights"}
                          </span>
                          <h3 className="text-xl font-serif font-bold text-[#2D241E]">
                            {stay.name}
                          </h3>
                          <p className="font-sans text-xs text-[#5A4E44] leading-relaxed">
                            {stay.description}
                          </p>
                        </div>

                        <div className="hidden md:flex flex-col items-center justify-center p-4 border-l border-[#EAE3D9]/60">
                          <span className="size-10 rounded-full border border-[#E5A84B] text-[#E5A84B] flex items-center justify-center font-serif text-xs font-bold" title="Approved by MIRA">
                            M
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: WHAT'S INCLUDED */}
            {activeTab === "included" && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left: What's Included */}
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#2D241E] pb-2 border-b border-[#EAE3D9]">
                      What's Included
                    </h2>
                    <ul className="space-y-2.5 font-sans text-xs md:text-sm text-[#5A4E44]">
                      {(whatsIncluded.inclusions && whatsIncluded.inclusions.length > 0
                        ? whatsIncluded.inclusions
                        : [
                            { title: "6 nights accommodation in luxury boutique hotels" },
                            { title: "Daily gourmet breakfast and 4 curated dinners" },
                            { title: "Private airport transfers in executive vehicles" },
                            { title: "All guided tours with certified local experts" },
                            { title: "Skip-the-line tickets to major attractions" },
                            { title: "24/7 dedicated trip concierge support" },
                          ]
                      ).map((inc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#E5A84B] font-bold">✓</span>
                          <span>{inc.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: What's Not Included */}
                  <div className="space-y-4">
                    <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#2D241E] pb-2 border-b border-[#EAE3D9]">
                      What's Not Included
                    </h2>
                    <ul className="space-y-2.5 font-sans text-xs md:text-sm text-[#5A4E44]">
                      {(whatsIncluded.exclusions && whatsIncluded.exclusions.length > 0
                        ? whatsIncluded.exclusions
                        : [
                            { title: "International flights to and from destination" },
                            { title: "Travel insurance coverage" },
                            { title: "Personal expenses and souvenirs" },
                            { title: "Gratuities for drivers and local guides" },
                          ]
                      ).map((exc, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#5A4E44] font-bold">✕</span>
                          <span>{exc.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Important Information Box */}
                <div className="rounded-2xl border border-[#EAE3D9] bg-[#F4EFEA] p-6 space-y-3 relative">
                  <h3 className="text-base font-serif font-bold text-[#2D241E]">
                    Important Information
                  </h3>
                  <ul className="space-y-1.5 font-sans text-xs text-[#5A4E44]">
                    <li>• Moderate walking required; comfortable walking shoes recommended.</li>
                    <li>• Dietary requirements can be accommodated with advance notice.</li>
                    <li>• Minimum age: 12 years.</li>
                  </ul>
                  <span className="absolute bottom-4 right-4 size-8 rounded-full border border-[#E5A84B] text-[#E5A84B] flex items-center justify-center font-serif text-xs font-bold">
                    M
                  </span>
                </div>
              </div>
            )}

            {/* TAB 5: ADD-ONS */}
            {activeTab === "addons" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#2D241E]">
                    Add some fun in your trip
                  </h2>
                  <p className="font-sans text-sm text-[#5A4E44]">
                    Select optional upgrades to enhance your travel experience.
                  </p>
                </div>

                <div className="space-y-4">
                  {(addOns.itemsList && addOns.itemsList.length > 0
                    ? addOns.itemsList
                    : [
                        {
                          title: "Cycling Excursion",
                          price: 1495,
                          description: "Explore scenic countryside trails and historic villages on premium bikes with local cycling guides.",
                          image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
                        },
                        {
                          title: "Private Boat Riding & Fjord Tour",
                          price: 1495,
                          description: "Glide across crystal coastal waters on a private speed boat with local skipper.",
                          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                        },
                      ]
                  ).map((item, idx) => {
                    const isOpen = expandedAddon === idx

                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-[#EAE3D9] bg-[#F4EFEA] overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedAddon(isOpen ? null : idx)}
                          className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="size-7 rounded-full bg-[#182D09] text-white flex items-center justify-center text-xs font-bold shrink-0">
                              {idx + 1}
                            </span>

                            <div className="size-14 rounded-lg overflow-hidden shrink-0 bg-slate-300">
                              <img
                                src={item.image || heroBgImage}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div>
                              <h4 className="text-base font-serif font-bold text-[#2D241E]">
                                {item.title}
                              </h4>
                              <span className="text-xs font-sans font-semibold text-[#E5A84B]">
                                +${item.price}
                              </span>
                            </div>
                          </div>

                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-[#5A4E44]" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-[#5A4E44]" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="p-4 pt-0 border-t border-[#EAE3D9]/60 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px] gap-4 items-center">
                            <div className="space-y-3 font-sans text-xs md:text-sm text-[#5A4E44]">
                              <p>{item.description}</p>
                              <button
                                type="button"
                                className="rounded bg-[#182D09] px-4 py-2 text-xs font-semibold text-white hover:bg-[#23420d] transition-all cursor-pointer"
                              >
                                Add this item
                              </button>
                            </div>

                            <div className="h-[160px] rounded-lg overflow-hidden">
                              <img
                                src={item.image || heroBgImage}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* =========================================================
              RIGHT COLUMN: STICKY BOOKING CARD (OverviewCard)
          ========================================================= */}
          <aside className="w-full shrink-0 sticky top-20">
            <div className="rounded-[10px] border border-[#EAE3D9] bg-[#F4EFEA] p-6 space-y-6 shadow-xs font-sans">
              {/* Price Row */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-serif text-[#2D241E]">
                    {priceFormatted}
                  </span>
                  <span className="text-xs text-[#5A4E44]">per person</span>
                </div>
                <p className="text-xs text-[#5A4E44]">based on double occupancy</p>
              </div>

              {/* Taxes Row */}
              <div className="flex items-center justify-between pt-3 border-t border-[#EAE3D9] text-xs text-[#5A4E44]">
                <span>Taxes & fees</span>
                <span>Calculated at checkout</span>
              </div>

              {/* Request Button */}
              <button
                type="button"
                className="w-full rounded-[4px] bg-[#182D09] py-3.5 px-4 text-center font-semibold text-xs text-white uppercase tracking-wider transition-colors hover:bg-[#23420d] cursor-pointer shadow-sm"
              >
                Request This Journey
              </button>

              {/* Questions Link */}
              <div className="text-center space-y-1">
                <p className="text-xs text-[#5A4E44]">Questions on this journey?</p>
                <a
                  href="#contact"
                  className="text-xs font-semibold text-[#E5A84B] underline underline-offset-2 hover:opacity-80"
                >
                  Contact our travel experts
                </a>
              </div>

              {/* Benefits Checklist */}
              <ul className="space-y-2 pt-4 border-t border-[#EAE3D9] text-xs text-[#5A4E44]">
                <li className="flex items-center gap-2">
                  <span className="text-[#E5A84B] font-bold">✓</span>
                  <span>Free cancellation up to 30 days</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#E5A84B] font-bold">✓</span>
                  <span>Flexible payment plans available</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#E5A84B] font-bold">✓</span>
                  <span>Financial protection</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#E5A84B] font-bold">✓</span>
                  <span>Responsible tour operator</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#E5A84B] font-bold">✓</span>
                  <span>Instant local support</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
