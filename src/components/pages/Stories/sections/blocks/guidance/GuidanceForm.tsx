import { Plus, Trash2, AlignLeft, AlignRight } from "lucide-react"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper"

export interface GuidanceFormProps {
  block: any
  onChange: (patch: any) => void
  index?: number
}

export function GuidanceForm({
  block,
  onChange,
  index = 0,
}: GuidanceFormProps) {
  const mediaPosition = block.mediaPosition || "left"
  const experiences: string[] = Array.isArray(block.experiences) ? block.experiences : []

  const updateExperience = (itemIdx: number, val: string) => {
    const next = [...experiences]
    next[itemIdx] = val
    onChange({ experiences: next })
  }

  const addExperience = () => {
    const next = [...experiences, "New experience item..."]
    onChange({ experiences: next })
  }

  const removeExperience = (itemIdx: number) => {
    const next = experiences.filter((_, i) => i !== itemIdx)
    onChange({ experiences: next })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Media Position Controls */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/40">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Media Alignment:
        </label>
        <div className="flex items-center gap-1 bg-muted/40 p-0.5 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => onChange({ mediaPosition: "left" })}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
              mediaPosition === "left"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            Media Left
          </button>
          <button
            type="button"
            onClick={() => onChange({ mediaPosition: "right" })}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
              mediaPosition === "right"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
            Media Right
          </button>
        </div>
      </div>

      {/* Media Upload Form */}
      <UniversalMultimediaForm
        title="Guidance Side Media"
        fieldName={`blocks.${index}.multimedia`}
        imageFieldName={`storyGuidanceImage_${index}`}
        videoFieldName={`storyGuidanceVideo_${index}`}
        allowImage={true}
        allowVideo={true}
        allowColor={false}
        defaultShow="image"
        defaultOpen={false}
        value={block.multimedia || createDefaultMultimedia("image")}
        onChange={(val: any) => onChange({ multimedia: val })}
      />

      {/* Main Title & Lead Description */}
      <div className="flex flex-col gap-4 pt-2 border-t border-border/40">
        <DynamicStyledField
          type="text"
          label="Guidance Heading / Region Title"
          fieldName={`blocks.${index}.title`}
          placeholder="e.g. The Dalmatian Hinterland & Karst Canyons"
          value={block.title}
          onChange={(val: any) => onChange({ title: val })}
        />
        <DynamicStyledField
          type="richtext"
          label="Lead Narrative Description"
          fieldName={`blocks.${index}.content`}
          placeholder="Describe the region or feature..."
          value={block.content}
          onChange={(val: any) => onChange({ content: val })}
        />
      </div>

      {/* Essential Experiences Repeater */}
      <div className="flex flex-col gap-3 pt-3 border-t border-border/40">
        <DynamicStyledField
          type="text"
          label="Experiences Section Subtitle"
          fieldName={`blocks.${index}.experiencesTitle`}
          placeholder="e.g. ESSENTIAL EXPERIENCES"
          value={block.experiencesTitle}
          onChange={(val: any) => onChange({ experiencesTitle: val })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
            Essential Experiences ({experiences.length})
          </label>

          {experiences.map((exp: string, expIdx: number) => (
            <div key={expIdx} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground w-4 shrink-0 text-right">
                {expIdx + 1}.
              </span>
              <input
                type="text"
                value={exp}
                onChange={(e) => updateExperience(expIdx, e.target.value)}
                placeholder="e.g. Sample cured pršut aged naturally..."
                className="h-8 flex-1 rounded-md border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => removeExperience(expIdx)}
                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded cursor-pointer shrink-0"
                title="Remove experience item"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="flex items-center justify-center gap-1.5 rounded-md border border-dashed border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 py-1.5 text-xs font-medium text-amber-600 cursor-pointer transition shadow-2xs mt-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add Experience Bullet
          </button>
        </div>
      </div>

      {/* Local Knowledge Callout Box */}
      <div className="flex flex-col gap-3 pt-3 border-t border-border/40 bg-stone-50 dark:bg-stone-900/40 p-3 rounded-lg border border-stone-200/60">
        <DynamicStyledField
          type="text"
          label="Local Knowledge Box Title"
          fieldName={`blocks.${index}.knowledgeTitle`}
          placeholder="e.g. LOCAL KNOWLEDGE"
          value={block.knowledgeTitle}
          onChange={(val: any) => onChange({ knowledgeTitle: val })}
        />
        <DynamicStyledField
          type="richtext"
          label="Local Knowledge Text"
          fieldName={`blocks.${index}.knowledgeContent`}
          placeholder="e.g. Visit the canyon viewpoints during golden hour..."
          value={block.knowledgeContent}
          onChange={(val: any) => onChange({ knowledgeContent: val })}
        />
      </div>

      {/* Route / Footnote Info */}
      <div className="pt-2 border-t border-border/40">
        <DynamicStyledField
          type="text"
          label="Route / Transport Info Footnote"
          fieldName={`blocks.${index}.routeInfo`}
          placeholder="e.g. Route: Easily accessed via scenic highway..."
          value={block.routeInfo}
          onChange={(val: any) => onChange({ routeInfo: val })}
        />
      </div>
    </div>
  )
}

export default GuidanceForm
