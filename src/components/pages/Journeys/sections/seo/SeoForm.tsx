/* =====================================================
   JOURNEYS — SEO & METADATA FORM SECTION
===================================================== */

import { useState } from "react"
import { Trash2 } from "lucide-react"
import {
  FormSection,
  JourneyInputField,
  JourneyTextareaField,
} from "../../shared/fields"
import type { Journey } from "../../journeyTypes"

export type SeoFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function SeoForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: SeoFormProps) {
  const seo = (draft.metadata?.seo as any) || {
    title: "",
    description: "",
    keywords: [],
    robots: {
      index: true,
      follow: true,
    },
  }

  const [newKeyword, setNewKeyword] = useState("")

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return
    const current = seo.keywords || []
    if (!current.includes(newKeyword.trim())) {
      updateField("metadata.seo.keywords", [...current, newKeyword.trim()])
    }
    setNewKeyword("")
  }

  const handleRemoveKeyword = (keyword: string) => {
    const current = seo.keywords || []
    updateField(
      "metadata.seo.keywords",
      current.filter((k: string) => k !== keyword)
    )
  }

  return (
    <FormSection
      title="SEO & Search Engine Metadata"
      active={!!openSections["seo"]}
      onClick={() => toggleSection("seo")}
    >
      <div className="space-y-4">
        <JourneyInputField
          label="Meta Title Tag"
          value={seo.title ?? ""}
          onChange={(val) => updateField("metadata.seo.title", val)}
          placeholder="e.g., Classic Northern Albania & Theth Valley | MIRA Journeys"
          description="Optimal length: 50-60 characters."
        />

        <JourneyTextareaField
          label="Meta Description"
          value={seo.description ?? ""}
          onChange={(val) => updateField("metadata.seo.description", val)}
          rows={3}
          placeholder="Detailed preview text for search engine result cards..."
          description="Optimal length: 150-160 characters."
        />

        {/* Keywords */}
        <div className="space-y-2 pt-1 border-t border-border/40">
          <label className="text-xs font-semibold text-foreground">
            Target Keywords ({(seo.keywords || []).length})
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddKeyword()
                }
              }}
              placeholder="e.g. Albania luxury hiking"
              className="flex-1 rounded-lg border border-border/70 bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {(seo.keywords || []).map((kw: string, idx: number) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Robots */}
        <div className="flex items-center gap-6 pt-2 border-t border-border/40">
          <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={seo.robots?.index !== false}
              onChange={(e) =>
                updateField("metadata.seo.robots.index", e.target.checked)
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Allow Indexing (index)
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={seo.robots?.follow !== false}
              onChange={(e) =>
                updateField("metadata.seo.robots.follow", e.target.checked)
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Allow Link Following (follow)
          </label>
        </div>
      </div>
    </FormSection>
  )
}
