import { useState } from "react"
import type { HomeSection } from "../../homeTypes"
import { DynamicStyledField } from "../../../shared/FormControls"
import { UniversalMultimediaForm } from "../../../shared/UniversalMultimediaForm"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export type WhyMiraFormProps = {
  section: HomeSection
  index: number
  updateSection: (index: number, patch: Partial<HomeSection>) => void
  updateSectionContent: (index: number, patch: Record<string, any>) => void
}

export function WhyMiraForm({
  section,
  index,
  updateSection,
  updateSectionContent,
}: WhyMiraFormProps) {
  const content = (section.content ?? {}) as any
  const paragraphs = (content.paragraphs ?? []) as string[]

  const [openParagraphs, setOpenParagraphs] = useState<Record<number, boolean>>({
    0: true,
  })

  const toggleParagraph = (pIndex: number) => {
    setOpenParagraphs((prev) => ({
      ...prev,
      [pIndex]: !prev[pIndex],
    }))
  }

  const addParagraph = () => {
    const newIdx = paragraphs.length
    const updated = [...paragraphs, ""]
    updateSectionContent(index, { paragraphs: updated })
    setOpenParagraphs((prev) => ({ ...prev, [newIdx]: true }))
  }

  const removeParagraph = (pIndex: number) => {
    const updated = paragraphs.filter((_, i) => i !== pIndex)
    updateSectionContent(index, { paragraphs: updated })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-md border border-border/50 p-3">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          Header Content
        </p>
        <div className="flex flex-col gap-3">
          <DynamicStyledField
            type="text"
            label="Eyebrow"
            value={content.eyebrow ?? ""}
            onChange={(value) =>
              updateSectionContent(index, { eyebrow: value })
            }
            enableStyle
            style={content.homeWhyMiraEyebrowStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeWhyMiraEyebrowStyle: style })
            }
          />

          <DynamicStyledField
            type="text"
            label="Title"
            value={content.title ?? ""}
            onChange={(value) => updateSectionContent(index, { title: value })}
            enableStyle
            style={content.homeWhyMiraTitleStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeWhyMiraTitleStyle: style })
            }
          />

          <DynamicStyledField
            type="text"
            label="Signature"
            value={content.signature ?? ""}
            onChange={(value) =>
              updateSectionContent(index, { signature: value })
            }
            enableStyle
            style={content.homeWhyMiraSignatureStyle}
            onStyleChange={(style) =>
              updateSectionContent(index, { homeWhyMiraSignatureStyle: style })
            }
          />
        </div>
      </div>

      <div className="rounded-md border border-border/50 p-3">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Paragraphs Array ({paragraphs.length})
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addParagraph}
            className="h-7 gap-1 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Paragraph
          </Button>
        </div>

        {paragraphs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border/60 py-6 text-center">
            <p className="mb-2 text-xs text-muted-foreground">
              No paragraphs added yet.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addParagraph}
              className="gap-1 text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Paragraph
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {paragraphs.map((paragraph: string, paragraphIndex: number) => {
              const isOpen = openParagraphs[paragraphIndex] ?? false

              return (
                <div
                  key={paragraphIndex}
                  className="overflow-hidden rounded-md border border-border/40 bg-card/40"
                >
                  <div
                    onClick={() => toggleParagraph(paragraphIndex)}
                    className="flex cursor-pointer items-center justify-between bg-muted/30 px-3 py-2.5 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-semibold text-foreground">
                        Paragraph {paragraphIndex + 1}:
                      </span>
                      <span className="text-muted-foreground truncate max-w-[250px] md:max-w-[400px]">
                        {paragraph || "Empty paragraph"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeParagraph(paragraphIndex)
                      }}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      title="Remove paragraph"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {isOpen && (
                    <div className="flex flex-col gap-3 p-3 border-t border-border/30">
                      <DynamicStyledField
                        type="textarea"
                        label={`Paragraph ${paragraphIndex + 1} Content`}
                        value={paragraph ?? ""}
                        onChange={(value) => {
                          const updated = [...paragraphs]
                          updated[paragraphIndex] = value
                          updateSectionContent(index, { paragraphs: updated })
                        }}
                        enableStyle
                        style={
                          content[
                            `homeWhyMiraParagraph${paragraphIndex + 1}Style`
                          ]
                        }
                        onStyleChange={(style) =>
                          updateSectionContent(index, {
                            [`homeWhyMiraParagraph${paragraphIndex + 1}Style`]:
                              style,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <UniversalMultimediaForm
        section={section}
        content={content}
        updateSection={(patch) => updateSection(index, patch)}
        updateSectionContent={(patch) => updateSectionContent(index, patch)}
        contentMediaKey="backgroundMultimedia"
        sectionTitle="Background"
        showColorPicker
        colorLabel="Background color"
        defaultColor="#1F3A1B"
        imageFieldName="cmsHomeWhyMiraBackgroundImage"
        videoFieldName="cmsHomeWhyMiraBackgroundVideo"
        imageAltStyleKey="homeWhyMiraBackgroundImageAltStyle"
        videoAltStyleKey="homeWhyMiraBackgroundVideoAltStyle"
      />

      <UniversalMultimediaForm
        section={section}
        content={content}
        updateSection={(patch) => updateSection(index, patch)}
        updateSectionContent={(patch) => updateSectionContent(index, patch)}
        contentMediaKey="rightSideMultimedia"
        sectionTitle="Right Section"
        showColorPicker
        colorLabel="Right section color"
        defaultColor="#FBF9F5"
        imageTitle="Side Image"
        imageLabel="Side image"
        imageFieldName="cmsHomeWhyMiraRightSectionImage"
        videoFieldName="cmsHomeWhyMiraRightSectionVideo"
        imageAltStyleKey="homeWhyMiraSideImageAltStyle"
        videoAltStyleKey="homeWhyMiraRightSectionVideoAltStyle"
      />
    </div>
  )
}
