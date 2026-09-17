import { useState } from "react"
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  DollarSign,
  Tag,
  Layers,
} from "lucide-react"

import type { LocationFormSectionProps } from "../../config/locationSections"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { ExperienceCard } from "../../locationTypes"

export function PlaceExperiencesForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: LocationFormSectionProps) {
  const sectionKey = "experiences"
  const isOpen = Boolean(openSections[sectionKey])

  const expData = draft.experience || draft.experiences || {}
  const featured = expData.featured_experience || {}
  const cards: ExperienceCard[] = Array.isArray(expData.cards) ? expData.cards : []

  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null)

  const handleUpdateFeatured = (key: string, val: any) => {
    updateField(`experiences.featured_experience.${key}`, val)
  }

  const handleAddCard = () => {
    const newCard: ExperienceCard = {
      id: Date.now(),
      title: {
        value: "New Curated Experience",
        textColor: "#182d09",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      category: "TREK & DISCOVERY",
      price: "From $250",
      subtitle: {
        value: "Experience description subtitle...",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "Full details about this experience...",
        textColor: "#565e69",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      action_text: "View Experience",
      image: "",
      imageMultimedia: {
        show: "color",
        color: { color: "#EDE7D8", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
        image: { url: "", alt: "Curated Experience", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
        video: { url: "", alt: "", autoplay: true, loop: true, muted: true, opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
      },
    }
    const updated = [...cards, newCard]
    updateField("experiences.cards", updated)
    setExpandedCardIndex(updated.length - 1)
  }

  const handleUpdateCard = (index: number, key: string, val: any) => {
    const updated = cards.map((card, i) => {
      if (i !== index) return card
      return { ...card, [key]: val }
    })
    updateField("experiences.cards", updated)
  }

  const handleRemoveCard = (index: number) => {
    const updated = cards.filter((_, i) => i !== index)
    updateField("experiences.cards", updated)
    if (expandedCardIndex === index) setExpandedCardIndex(null)
  }

  const handleMoveCard = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= cards.length) return
    const updated = [...cards]
    const temp = updated[index]
    updated[index] = updated[targetIdx]
    updated[targetIdx] = temp
    updateField("experiences.cards", updated)
    setExpandedCardIndex(targetIdx)
  }

  return (
    <FormSection
      title="Curated Experiences"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection(sectionKey)}
    >
      <div className="flex flex-col gap-6">
        {/* Section Header Controls */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">
              Eyebrow Location Label
            </label>
            <input
              type="text"
              value={expData.location || ""}
              onChange={(e) => updateField("experiences.location", e.target.value)}
              placeholder="e.g. Dhërmi, Albania"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <DynamicStyledField
            type="text"
            label="Section Main Title"
            fieldName="title"
            value={expData.title}
            onChange={(val: any) => updateField("experiences.title", val)}
            placeholder="e.g. Experiences"
          />

          <DynamicStyledField
            type="textarea"
            label="Section Description"
            fieldName="description"
            value={expData.description}
            onChange={(val: any) => updateField("experiences.description", val)}
            placeholder="e.g. Curated ways to discover the wild beauty and heritage..."
          />
        </div>

        {/* Featured Experience Banner Card */}
        <div className="flex flex-col gap-4 rounded-xl border border-primary/20 p-4 bg-primary/5">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
              Featured Experience Banner
            </h4>
          </div>

          <DynamicStyledField
            type="text"
            label="Featured Experience Title"
            fieldName="title"
            value={featured.title}
            onChange={(val: any) => handleUpdateFeatured("title", val)}
            placeholder="e.g. Pirate Cave Coastal Kayaking Expedition"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground">Category</label>
              <input
                type="text"
                value={featured.category || ""}
                onChange={(e) => handleUpdateFeatured("category", e.target.value)}
                placeholder="e.g. SEA EXPEDITIONS"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-foreground">Duration</label>
              <input
                type="text"
                value={featured.duration || ""}
                onChange={(e) => handleUpdateFeatured("duration", e.target.value)}
                placeholder="e.g. Half Day (4 Hours)"
                className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground"
              />
            </div>
          </div>

          <DynamicStyledField
            type="text"
            label="Featured Experience Subtitle"
            fieldName="subtitle"
            value={featured.subtitle}
            onChange={(val: any) => handleUpdateFeatured("subtitle", val)}
            placeholder="e.g. Paddle into hidden sea caves and turquoise bays..."
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-foreground">Button / Action Label</label>
            <input
              type="text"
              value={featured.action_text || ""}
              onChange={(e) => handleUpdateFeatured("action_text", e.target.value)}
              placeholder="e.g. Discover Experience"
              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground"
            />
          </div>

          <UniversalMultimediaForm
            title="Featured Media (Image / Video)"
            value={featured.imageMultimedia}
            onChange={(val: any) => handleUpdateFeatured("imageMultimedia", val)}
            defaultColor="#EDE7D8"
          />
        </div>

        {/* Experience Cards Array */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/60 p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-semibold text-foreground">
                Experience Cards Grid ({cards.length})
              </h4>
            </div>

            <button
              type="button"
              onClick={handleAddCard}
              className="flex items-center gap-1 rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Experience Card
            </button>
          </div>

          {cards.length === 0 ? (
            <p className="text-xs text-muted-foreground italic py-3 text-center border border-dashed border-border/60 rounded-lg">
              No experience cards added. Click &quot;Add Experience Card&quot; above.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {cards.map((card, idx) => {
                const isCardExpanded = expandedCardIndex === idx
                const cardTitleStr =
                  typeof card.title === "string"
                    ? card.title
                    : (card.title as any)?.value || `Experience Card ${idx + 1}`

                return (
                  <div
                    key={card.id || idx}
                    className="rounded-lg border border-border/60 bg-card overflow-hidden transition"
                  >
                    {/* Card Row Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-muted/30">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCardIndex(isCardExpanded ? null : idx)
                        }
                        className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-xs font-semibold truncate text-foreground">
                          {cardTitleStr}
                        </span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveCard(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCard(idx, "down")}
                          disabled={idx === cards.length - 1}
                          className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveCard(idx)}
                          className="p-1 text-muted-foreground hover:text-destructive cursor-pointer ml-1"
                          title="Delete Experience Card"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Expanded Form Controls */}
                    {isCardExpanded && (
                      <div className="p-4 flex flex-col gap-4 border-t border-border/40">
                        <DynamicStyledField
                          type="text"
                          label="Title"
                          fieldName="title"
                          value={card.title}
                          onChange={(val: any) => handleUpdateCard(idx, "title", val)}
                          placeholder="e.g. Gjipe Canyon Trek & Hidden Beach"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-foreground flex items-center gap-1">
                              <Tag className="h-3 w-3 text-muted-foreground" /> Category
                            </label>
                            <input
                              type="text"
                              value={card.category || ""}
                              onChange={(e) =>
                                handleUpdateCard(idx, "category", e.target.value)
                              }
                              placeholder="e.g. NATURE & HIKING"
                              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium text-foreground flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-muted-foreground" /> Price / Rate
                            </label>
                            <input
                              type="text"
                              value={card.price || ""}
                              onChange={(e) =>
                                handleUpdateCard(idx, "price", e.target.value)
                              }
                              placeholder="e.g. From $180 / person"
                              className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground"
                            />
                          </div>
                        </div>

                        <DynamicStyledField
                          type="text"
                          label="Subtitle / Short Teaser"
                          fieldName="subtitle"
                          value={card.subtitle}
                          onChange={(val: any) => handleUpdateCard(idx, "subtitle", val)}
                          placeholder="e.g. Descend down limestone cliffs to a pristine cove..."
                        />

                        <DynamicStyledField
                          type="textarea"
                          label="Description"
                          fieldName="description"
                          value={card.description}
                          onChange={(val: any) => handleUpdateCard(idx, "description", val)}
                          placeholder="e.g. Full experience story and details..."
                        />

                        <div className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-foreground">Action Text</label>
                          <input
                            type="text"
                            value={card.action_text || "More info"}
                            onChange={(e) =>
                              handleUpdateCard(idx, "action_text", e.target.value)
                            }
                            placeholder="e.g. View Itinerary"
                            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground"
                          />
                        </div>

                        <UniversalMultimediaForm
                          title="Card Media (Image / Video)"
                          value={card.imageMultimedia}
                          onChange={(val: any) =>
                            handleUpdateCard(idx, "imageMultimedia", val)
                          }
                          defaultColor="#EDE7D8"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Season Information Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-border/60 p-4 bg-muted/20">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" /> Season Guidance Note
            </label>
            <textarea
              value={expData.seasonInfo || ""}
              onChange={(e) => updateField("experiences.seasonInfo", e.target.value)}
              placeholder="e.g. All information is available on site. The season runs from May to October..."
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-foreground">
              Season Location Pin Text
            </label>
            <input
              type="text"
              value={expData.seasonLocation || ""}
              onChange={(e) => updateField("experiences.seasonLocation", e.target.value)}
              placeholder="e.g. Dhërmi, Albanian Riviera"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Section Background Multimedia */}
        <UniversalMultimediaForm
          title="Section Background Styling & Multimedia"
          value={expData.backgroundMultimedia}
          onChange={(val: any) => updateField("experiences.backgroundMultimedia", val)}
          defaultColor="#F1EEE5"
        />
      </div>
    </FormSection>
  )
}

