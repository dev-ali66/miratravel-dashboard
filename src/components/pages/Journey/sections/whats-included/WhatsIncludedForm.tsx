import { useState } from "react"
import type { JourneyData } from "../../journeyTypes"
import { FormSection } from "../../shared/fields"
import { DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, CheckCircle2, XCircle, Info, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhatsIncludedFormProps {
  draft: JourneyData
  updateField: (path: string, value: any) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: string
}

export function WhatsIncludedForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: WhatsIncludedFormProps) {
  const isOpen = Boolean(openSections["whats-included"])
  const incData = draft.whatsIncluded || {}
  const inclusions = incData.items || incData.inclusions || []
  const exclusions = incData.exclusions || []
  const notes = incData.notes || []

  const [openSubSection, setOpenSubSection] = useState<number | null>(0)

  const toggleSub = (index: number) => {
    setOpenSubSection(openSubSection === index ? null : index)
  }

  // --- Helpers for Part 1: Inclusions ---
  const updateInclusions = (nextInc: any[]) => {
    updateField("whatsIncluded.items", nextInc)
    updateField("whatsIncluded.inclusions", nextInc)
  }

  const addInclusion = () => {
    const newItem = {
      category: { value: "Services", textColor: "#af6348", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      title: { value: "", textColor: "#464136", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "", textColor: "#565e69", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
    }
    updateInclusions([...inclusions, newItem])
  }

  const removeInclusion = (index: number) => {
    updateInclusions(inclusions.filter((_: any, i: number) => i !== index))
  }

  const updateInclusionField = (index: number, subPath: string, val: any) => {
    updateField(`whatsIncluded.items.${index}.${subPath}`, val)
    updateField(`whatsIncluded.inclusions.${index}.${subPath}`, val)
  }

  // --- Helpers for Part 2: Exclusions ---
  const addExclusion = () => {
    const newItem = {
      category: { value: "General", textColor: "#9A3412", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      title: { value: "", textColor: "#464136", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
      description: { value: "", textColor: "#565e69", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 },
    }
    updateField("whatsIncluded.exclusions", [...exclusions, newItem])
  }

  const removeExclusion = (index: number) => {
    updateField(
      "whatsIncluded.exclusions",
      exclusions.filter((_: any, i: number) => i !== index)
    )
  }

  const updateExclusionField = (index: number, subPath: string, val: any) => {
    updateField(`whatsIncluded.exclusions.${index}.${subPath}`, val)
  }

  // --- Helpers for Part 3: Important Information ---
  const addNote = () => {
    const newNote = { value: "", textColor: "#464136", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 }
    updateField("whatsIncluded.notes", [...notes, newNote])
  }

  const removeNote = (index: number) => {
    updateField(
      "whatsIncluded.notes",
      notes.filter((_: any, i: number) => i !== index)
    )
  }

  const updateNoteTitle = (index: number, val: any) => {
    updateField(`whatsIncluded.notes.${index}`, val)
  }

  return (
    <FormSection
      title="What's Included & Excluded Section"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("whats-included")}
    >
      <div className="flex flex-col gap-4">
        {/* ========================================================================= */}
        {/* SUB-SECTION 1: WHAT'S INCLUDED                                           */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <div
            onClick={() => toggleSub(0)}
            className="flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 cursor-pointer border-b border-border/40 transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Part 1: What's Included (`items`) ({inclusions.length})
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                openSubSection === 0 && "rotate-180"
              )}
            />
          </div>

          {openSubSection === 0 && (
            <div className="p-4 flex flex-col gap-4 bg-background/50">
              <DynamicStyledField
                type="textarea"
                rows={2}
                label="Section Title"
                fieldName="whatsIncluded.title"
                placeholder="e.g. What's Included"
                value={incData.title}
                onChange={(val) => updateField("whatsIncluded.title", val)}
              />

              {/* Inclusions Items List */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Included Services & Amenities ({inclusions.length})
                  </label>

                  <button
                    type="button"
                    onClick={addInclusion}
                    className="flex items-center gap-1 rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Inclusion
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {inclusions.map((inc: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 space-y-2 shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                          Inclusion #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeInclusion(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                          title="Remove Inclusion"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <DynamicStyledField
                        type="text"
                        label="Inclusion Item Title"
                        fieldName={`whatsIncluded.items.${idx}.title`}
                        placeholder="e.g. All boutique hotel accommodations (8 nights)"
                        value={inc.title}
                        onChange={(val) => updateInclusionField(idx, "title", val)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SUB-SECTION 2: WHAT'S NOT INCLUDED                                       */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <div
            onClick={() => toggleSub(1)}
            className="flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 cursor-pointer border-b border-border/40 transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Part 2: What's Not Included (`exclusions`) ({exclusions.length})
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                openSubSection === 1 && "rotate-180"
              )}
            />
          </div>

          {openSubSection === 1 && (
            <div className="p-4 flex flex-col gap-4 bg-background/50">
              <DynamicStyledField
                type="textarea"
                rows={2}
                label="Section Title"
                fieldName="whatsIncluded.exclusionsTitle"
                placeholder="e.g. What's Not Included"
                value={incData.exclusionsTitle}
                onChange={(val) => updateField("whatsIncluded.exclusionsTitle", val)}
              />

              {/* Exclusions Items List */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    Excluded Services & Airfare ({exclusions.length})
                  </label>

                  <button
                    type="button"
                    onClick={addExclusion}
                    className="flex items-center gap-1 rounded bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Exclusion
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {exclusions.map((exc: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 space-y-2 shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                          Exclusion #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExclusion(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                          title="Remove Exclusion"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <DynamicStyledField
                        type="text"
                        label="Exclusion Item Title"
                        fieldName={`whatsIncluded.exclusions.${idx}.title`}
                        placeholder="e.g. International flight tickets to/from Tirana"
                        value={exc.title}
                        onChange={(val) => updateExclusionField(idx, "title", val)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* SUB-SECTION 3: IMPORTANT INFORMATION                                     */}
        {/* ========================================================================= */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <div
            onClick={() => toggleSub(2)}
            className="flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/70 cursor-pointer border-b border-border/40 transition-colors select-none"
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Part 3: Important Information (`notes`) ({notes.length})
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                openSubSection === 2 && "rotate-180"
              )}
            />
          </div>

          {openSubSection === 2 && (
            <div className="p-4 flex flex-col gap-4 bg-background/50">
              <DynamicStyledField
                type="text"
                label="Card Title"
                fieldName="whatsIncluded.notesTitle"
                placeholder="e.g. Important Information"
                value={incData.notesTitle}
                onChange={(val) => updateField("whatsIncluded.notesTitle", val)}
              />

              {/* Notes Items List */}
              <div className="space-y-3 pt-3 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-primary" />
                    Travel Notes & Guidelines ({notes.length})
                  </label>

                  <button
                    type="button"
                    onClick={addNote}
                    className="flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Note
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {notes.map((note: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2 shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          Note #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeNote(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 cursor-pointer transition-colors"
                          title="Remove Note"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <DynamicStyledField
                        type="text"
                        label="Note Bullet Text"
                        fieldName={`whatsIncluded.notes.${idx}`}
                        placeholder="e.g. Private transfers are tailored to match your arrival time."
                        value={note}
                        onChange={(val) => updateNoteTitle(idx, val)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mandatory Section Background Multimedia */}
        <div className="pt-4 border-t border-border/40">
          <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3">
            What's Included Section Background Multimedia
          </label>
          <UniversalMultimediaForm
            value={incData.backgroundMultimedia || { show: "color", color: { color: "#ffffff" } }}
            onChange={(val) => updateField("whatsIncluded.backgroundMultimedia", val)}
          />
        </div>
      </div>
    </FormSection>
  )
}