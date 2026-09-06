/* =====================================================
   JOURNEYS — OVERVIEW FORM SECTION
   Directly manages:
   - draft.data.overview.backgroundMultimedia
   - draft.data.overview.whyTitle ("Why we designed this journey?")
   - draft.data.overview.whyParagraphs (String[])
   - draft.data.overview.whySignature ("— MIRA")
   - draft.data.overview.overviewTitle ("Journey Overview")
   - draft.data.overview.titlegraphs (String[])
   - draft.data.overview.highlightsTitle ("Curated Highlights")
===================================================== */

import { Plus, Trash2, HeartHandshake, BookOpen } from "lucide-react"
import {
  FormSection,
  DynamicStyledField,
  UniversalMultimediaForm,
} from "../../shared/fields"
import { useJourneyDraft } from "../../shared/JourneyDraftContext"
import {
  whyWeDesignedData,
  overviewListData,
} from "../../preview/journeyStaticData"
import type { Journey } from "../../journeyTypes"

export type OverviewFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function OverviewForm({
  draft,
  updateField: _updateField,
  openSections,
  toggleSection,
}: OverviewFormProps) {
  const { setDraft } = useJourneyDraft()

  const overviewData =
    (draft?.data?.overview as any) ||
    (draft?.data?.overviewList as any) ||
    {}

  const whyTitle = overviewData.whyTitle ?? whyWeDesignedData.title
  const whyParagraphs: string[] = Array.isArray(overviewData.whyParagraphs)
    ? overviewData.whyParagraphs
    : Array.isArray(whyWeDesignedData.paragraphs)
    ? [...whyWeDesignedData.paragraphs]
    : []
  const whySignature = overviewData.whySignature ?? whyWeDesignedData.signature

  const overviewTitle = overviewData.overviewTitle ?? overviewListData.title
  const titlegraphs: string[] = Array.isArray(overviewData.titlegraphs)
    ? overviewData.titlegraphs
    : Array.isArray(overviewListData.titlegraphs)
    ? [...overviewListData.titlegraphs]
    : []
  const highlightsTitle = overviewData.highlightsTitle ?? overviewListData.highlightsTitle

  const backgroundMultimedia = overviewData.backgroundMultimedia || {
    type: "color",
    color: "#F9F9F9",
  }

  const syncOverview = (patch: Record<string, any>) => {
    setDraft((prev) => {
      const prevData = prev.data || {}
      const currentOverview =
        (prevData.overview as any) ||
        (prevData.overviewList as any) ||
        {}
      const updatedOverview = {
        ...currentOverview,
        ...patch,
      }

      return {
        ...prev,
        data: {
          ...prevData,
          overview: updatedOverview,
          overviewList: updatedOverview,
        },
      }
    })
  }

  // Paragraph managers
  const handleWhyParagraphChange = (index: number, val: string) => {
    const updated = [...whyParagraphs]
    updated[index] = val
    syncOverview({ whyParagraphs: updated })
  }

  const handleAddWhyParagraph = () => {
    syncOverview({ whyParagraphs: [...whyParagraphs, ""] })
  }

  const handleRemoveWhyParagraph = (index: number) => {
    syncOverview({ whyParagraphs: whyParagraphs.filter((_, i) => i !== index) })
  }

  const handleTitlegraphChange = (index: number, val: string) => {
    const updated = [...titlegraphs]
    updated[index] = val
    syncOverview({ titlegraphs: updated })
  }

  const handleAddTitlegraph = () => {
    syncOverview({ titlegraphs: [...titlegraphs, ""] })
  }

  const handleRemoveTitlegraph = (index: number) => {
    syncOverview({ titlegraphs: titlegraphs.filter((_, i) => i !== index) })
  }

  return (
    <FormSection
      title="Journey Overview & Why We Designed"
      active={!!openSections["overview"]}
      onClick={() => toggleSection("overview")}
      badge={`${whyParagraphs.length + titlegraphs.length} Paragraphs`}
    >
      <div className="space-y-6">
        {/* Section Background */}
        <UniversalMultimediaForm
          sectionTitle="Overview Section Background"
          section={{ backgroundMultimedia } as any}
          content={{ backgroundMultimedia } as Record<string, any>}
          updateSection={(patch: any) =>
            syncOverview({
              backgroundMultimedia: patch?.backgroundMultimedia || patch,
            })
          }
          updateSectionContent={(patch: any) =>
            syncOverview({
              backgroundMultimedia: patch?.backgroundMultimedia || patch,
            })
          }
          backgroundType={backgroundMultimedia.type || "color"}
          onBackgroundTypeChange={(type) =>
            syncOverview({
              backgroundMultimedia: { ...backgroundMultimedia, type },
            })
          }
          defaultColor={backgroundMultimedia.color}
          onColorChange={(color) =>
            syncOverview({
              backgroundMultimedia: {
                ...backgroundMultimedia,
                type: "color",
                color,
              },
            })
          }
          image={backgroundMultimedia.image}
          onImageChange={(image) =>
            syncOverview({
              backgroundMultimedia: {
                ...backgroundMultimedia,
                type: "image",
                image,
                url: image?.url || "",
              },
            })
          }
          video={backgroundMultimedia.video}
          onVideoChange={(video) =>
            syncOverview({
              backgroundMultimedia: {
                ...backgroundMultimedia,
                type: "video",
                video,
                url: video?.url || "",
              },
            })
          }
        />

        {/* 1. Why We Designed This Journey */}
        <div className="space-y-4 rounded-xl border border-border/70 bg-card/40 p-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HeartHandshake className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Why We Designed This Journey
              </h3>
              <p className="text-xs text-muted-foreground">
                Curator perspective, design philosophy & signature quote.
              </p>
            </div>
          </div>

          <DynamicStyledField
            type="text"
            label="Section Title"
            value={whyTitle}
            onChange={(val: string) => syncOverview({ whyTitle: val })}
            placeholder="Why we designed this journey?"
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Curator Narrative Paragraphs ({whyParagraphs.length})
              </label>
              <button
                type="button"
                onClick={handleAddWhyParagraph}
                className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                <Plus className="h-3.5 w-3.5" /> Add Paragraph
              </button>
            </div>

            {whyParagraphs.map((para, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="flex-1">
                  <DynamicStyledField
                    type="textarea"
                    label={`Paragraph ${idx + 1}`}
                    value={para}
                    onChange={(val: string) =>
                      handleWhyParagraphChange(idx, val)
                    }
                    placeholder="Atmospheric narrative explaining the travel inspiration..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveWhyParagraph(idx)}
                  className="mt-7 rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Remove Paragraph"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <DynamicStyledField
            type="text"
            label="Signature / Curator Sign-off"
            value={whySignature}
            onChange={(val: string) => syncOverview({ whySignature: val })}
            placeholder="— MIRA"
          />
        </div>

        {/* 2. Journey Narrative Overview */}
        <div className="space-y-4 rounded-xl border border-border/70 bg-card/40 p-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
              <BookOpen className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Journey Narrative Overview
              </h3>
              <p className="text-xs text-muted-foreground">
                Main story, travel rhythm, and comprehensive overview.
              </p>
            </div>
          </div>

          <DynamicStyledField
            type="text"
            label="Overview Title"
            value={overviewTitle}
            onChange={(val: string) => syncOverview({ overviewTitle: val })}
            placeholder="Journey Overview"
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Story Paragraphs ({titlegraphs.length})
              </label>
              <button
                type="button"
                onClick={handleAddTitlegraph}
                className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
              >
                <Plus className="h-3.5 w-3.5" /> Add Paragraph
              </button>
            </div>

            {titlegraphs.map((para, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="flex-1">
                  <DynamicStyledField
                    type="textarea"
                    label={`Overview Paragraph ${idx + 1}`}
                    value={para}
                    onChange={(val: string) =>
                      handleTitlegraphChange(idx, val)
                    }
                    placeholder="Immerse yourself in the timeless beauty and rich culture..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTitlegraph(idx)}
                  className="mt-7 rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Remove Paragraph"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <DynamicStyledField
            type="text"
            label="Highlights Section Title"
            value={highlightsTitle}
            onChange={(val: string) =>
              syncOverview({ highlightsTitle: val })
            }
            placeholder="Curated Highlights"
          />
        </div>
      </div>
    </FormSection>
  )
}
