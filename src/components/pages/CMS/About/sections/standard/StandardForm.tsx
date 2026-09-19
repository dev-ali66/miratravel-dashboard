import { useState } from "react"
import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from "lucide-react"
import { emptyStandardItemIcon } from "./emptyStandard"

export type StandardFormProps = {
  section: any
  index: number
  updateSection: (index: number, patch: Record<string, any>) => void
  openSections: Record<string, boolean>
  toggleSection: (key: string) => void
  sectionNumber: number | string
}

export function StandardForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: StandardFormProps) {
  const isOpen = Boolean(openSections["standard"])
  const standardData = section || {}
  const itemsList = Array.isArray(standardData.items) ? standardData.items : []

  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true })

  const toggleItem = (iIdx: number) => {
    setOpenItems((prev) => ({ ...prev, [iIdx]: !prev[iIdx] }))
  }

  const updateItemsList = (updated: any[]) => {
    updateSection(index, { items: updated })
  }

  const updateItem = (iIdx: number, patch: Record<string, any>) => {
    const updated = [...itemsList]
    updated[iIdx] = { ...updated[iIdx], ...patch }
    updateItemsList(updated)
  }

  const addItem = () => {
    const newItem = {
      title: {
        value: "New Standard Feature",
        textColor: "#B86B3A",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "Feature description content...",
        textColor: "#4B5563",
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      icon: emptyStandardItemIcon,
    }
    const newIdx = itemsList.length
    setOpenItems((prev) => ({ ...prev, [newIdx]: true }))
    updateItemsList([...itemsList, newItem])
  }

  const removeItem = (iIdx: number) => {
    const updated = itemsList.filter((_: any, i: number) => i !== iIdx)
    updateItemsList(updated)
  }

  const moveItem = (iIdx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? iIdx - 1 : iIdx + 1
    if (targetIdx < 0 || targetIdx >= itemsList.length) return
    const updated = [...itemsList]
    const temp = updated[iIdx]
    updated[iIdx] = updated[targetIdx]
    updated[targetIdx] = temp

    setOpenItems((prev) => ({
      ...prev,
      [iIdx]: prev[targetIdx],
      [targetIdx]: prev[iIdx],
    }))

    updateItemsList(updated)
  }

  return (
    <FormSection
      title="The MIRA Standard Section"
      sectionNumber={String(sectionNumber)}
      active={isOpen}
      onClick={() => toggleSection("standard")}
    >
      <div className="space-y-4">
        <DynamicStyledField
          label="Eyebrow / Category"
          value={standardData.eyebrow}
          onChange={(val: any) => updateSection(index, { eyebrow: val })}
        />

        <DynamicStyledField
          label="Title / Headline"
          type="textarea"
          value={standardData.title}
          onChange={(val: any) => updateSection(index, { title: val })}
        />

        <div className="pt-2 border-t border-border/40">
          <UniversalMultimediaForm
            title="Featured Left Side Media / Photo"
            value={standardData.multimedia}
            onChange={(val: any) => updateSection(index, { multimedia: val })}
          />
        </div>

        {/* Feature Items List */}
        <div className="pt-2 border-t border-border/40 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Standard Features ({itemsList.length})
            </h4>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> Add Feature
            </button>
          </div>

          {itemsList.map((item: any, iIdx: number) => {
            const isItemOpen = Boolean(openItems[iIdx])
            const itemTitle =
              typeof item.title === "object" ? item.title?.value : item.title || ""

            return (
              <div key={iIdx} className="rounded-lg border border-border/60 overflow-hidden bg-background">
                {/* Header Bar */}
                <div
                  className="flex items-center justify-between p-3 bg-muted/40 cursor-pointer select-none hover:bg-muted/60 transition-colors"
                  onClick={() => toggleItem(iIdx)}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    {isItemOpen ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-foreground truncate">
                      Feature #{iIdx + 1}
                      {itemTitle ? ` — ${itemTitle}` : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={iIdx === 0}
                      onClick={() => moveItem(iIdx, "up")}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={iIdx === itemsList.length - 1}
                      onClick={() => moveItem(iIdx, "down")}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(iIdx)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors ml-1"
                      title="Remove Feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                {isItemOpen && (
                  <div className="p-4 border-t border-border/40 bg-muted/10 space-y-4">
                    <DynamicStyledField
                      label="Feature Title"
                      value={item.title}
                      onChange={(val: any) => updateItem(iIdx, { title: val })}
                    />

                    <DynamicStyledField
                      label="Feature Description"
                      type="textarea"
                      value={item.description}
                      onChange={(val: any) => updateItem(iIdx, { description: val })}
                    />

                    <UniversalMultimediaForm
                      title="Feature Icon / Media"
                      value={item.icon || item.multimedia || emptyStandardItemIcon}
                      onChange={(val: any) => updateItem(iIdx, { icon: val })}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="pt-2 border-t border-border/40">
          <UniversalMultimediaForm
            title="Section Background"
            value={standardData.backgroundMultimedia}
            onChange={(val: any) => updateSection(index, { backgroundMultimedia: val })}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default StandardForm
