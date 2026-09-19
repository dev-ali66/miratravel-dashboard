import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createEmptyMultimediaItem } from "./emptyPhilosophy"

export type PhilosophyFormProps = {
  section: any
  index: number
  updateSection: (index: number, patch: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number | string
}

export function PhilosophyForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: PhilosophyFormProps) {
  const isOpen = Boolean(openSections["philosophy"])
  const philosophyData = section || {}
  const multimedias: any[] = Array.isArray(philosophyData.multimedias)
    ? philosophyData.multimedias
    : [philosophyData.multimedia1, philosophyData.multimedia2, philosophyData.multimedia3].filter(Boolean)

  const updateMultimediaItem = (mIdx: number, val: any) => {
    const updated = [...multimedias]
    updated[mIdx] = val
    updateSection(index, { multimedias: updated })
  }

  const addMediaItem = () => {
    const updated = [...multimedias, createEmptyMultimediaItem()]
    updateSection(index, { multimedias: updated })
  }

  const removeMediaItem = (mIdx: number) => {
    const updated = multimedias.filter((_: any, i: number) => i !== mIdx)
    updateSection(index, { multimedias: updated })
  }

  const moveMediaItem = (mIdx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? mIdx - 1 : mIdx + 1
    if (targetIdx < 0 || targetIdx >= multimedias.length) return
    const updated = [...multimedias]
    const [moved] = updated.splice(mIdx, 1)
    updated.splice(targetIdx, 0, moved)
    updateSection(index, { multimedias: updated })
  }

  return (
    <FormSection
      title="Philosophy Section"
      sectionNumber={String(sectionNumber)}
      active={isOpen}
      onClick={() => toggleSection("philosophy")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          label="Eyebrow / Category"
          value={philosophyData.eyebrow}
          onChange={(val: any) => updateSection(index, { eyebrow: val })}
        />

        <DynamicStyledField
          label="Title / Headline"
          type="textarea"
          value={philosophyData.title}
          onChange={(val: any) => updateSection(index, { title: val })}
        />

        <DynamicStyledField
          label="Description Body"
          type="textarea"
          value={philosophyData.description}
          onChange={(val: any) => updateSection(index, { description: val })}
        />

        <DynamicStyledField
          label="Highlight Quote"
          type="textarea"
          value={philosophyData.quote}
          onChange={(val: any) => updateSection(index, { quote: val })}
        />

        {/* Section Media Assets Repeater List */}
        <div className="pt-2 border-t border-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Section Media Assets ({multimedias.length})
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMediaItem}
              className="h-7 text-xs gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Media Item
            </Button>
          </div>

          {multimedias.length === 0 ? (
            <div className="p-4 border border-dashed border-border/60 rounded-lg text-center text-xs text-muted-foreground">
              No media items added. Click "Add Media Item" above.
            </div>
          ) : (
            multimedias.map((item: any, mIdx: number) => (
              <div
                key={mIdx}
                className="relative rounded-lg border border-border/60 bg-card p-3 space-y-2"
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">
                    Media Item #{mIdx + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={mIdx === 0}
                      onClick={() => moveMediaItem(mIdx, "up")}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={mIdx === multimedias.length - 1}
                      onClick={() => moveMediaItem(mIdx, "down")}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMediaItem(mIdx)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive/80 cursor-pointer"
                      title="Delete Media Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <UniversalMultimediaForm
                  title={`Media Asset #${mIdx + 1}`}
                  fieldName={`philosophy.multimedias.${mIdx}`}
                  value={item}
                  onChange={(val: any) => updateMultimediaItem(mIdx, val)}
                />
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-border/40">
          <UniversalMultimediaForm
            title="Section Background"
            fieldName="philosophy.backgroundMultimedia"
            value={philosophyData.backgroundMultimedia}
            onChange={(val: any) => updateSection(index, { backgroundMultimedia: val })}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default PhilosophyForm
