import { useState } from "react"
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Type,
  Quote,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  Compass,
  BookOpen,
  ChevronDown,
} from "lucide-react"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { FormSection } from "../../shared/fields"
import type { StoryFormSectionProps } from "../../config/storySections"
import { emptyBlockItem, emptyBlocks, emptyBlocksBackgroundMultimedia, emptyGuidanceBlock, emptyNotesBlock } from "./emptyBlocks"
import { deleteMediaFiles } from "./shared/mediaDeleteHelper"
import { ParagraphForm } from "./paragraph"
import { QuoteForm } from "./quote"
import { ImageBlockForm } from "./image"
import { VideoBlockForm } from "./video"
import { SpotlightCardForm } from "./spotlight"
import { GuidanceForm } from "./guidance"
import { NotesForm } from "./notes"

export function BlocksForm({
  draft,
  updateField,
  openSections,
  toggleSection,
  sectionNumber,
}: StoryFormSectionProps) {
  const blocks = Array.isArray(draft?.blocks)
    ? draft.blocks
    : Array.isArray((draft as any)?.data?.blocks)
      ? (draft as any).data.blocks
      : emptyBlocks

  // State for single-active block accordion (default: all blocks closed)
  const [openBlockIndex, setOpenBlockIndex] = useState<number | null>(null)

  const isOpen = Boolean(openSections["blocks"])

  const updateBlocks = (newBlocks: any[]) => {
    updateField("blocks", newBlocks)
  }

  const toggleBlockAccordion = (idx: number) => {
    setOpenBlockIndex((current) => (current === idx ? null : idx))
  }

  const addBlock = (type: "paragraph" | "quote" | "image" | "video" | "spotlight" | "guidance" | "notes") => {
    let newBlock: any
    if (type === "guidance") {
      newBlock = { ...emptyGuidanceBlock }
    } else if (type === "notes") {
      newBlock = { ...emptyNotesBlock }
    } else {
      newBlock = {
        ...emptyBlockItem,
        type,
        title: {
          value: "",
          textColor: "#171717",
          textOpacity: 1,
          backgroundColor: null,
          backgroundOpacity: 1,
        },
        content: {
          value: "",
          textColor: type === "paragraph" ? "#4A4A4A" : type === "quote" ? "#B3884D" : "#374151",
          textOpacity: 1,
          backgroundColor: null,
          backgroundOpacity: 1,
        },
        author: {
          value: "",
          textColor: "#78716C",
          textOpacity: 1,
          backgroundColor: null,
          backgroundOpacity: 1,
        },
        multimedia: {
          ...emptyBlockItem.multimedia,
          show: type === "video" ? "video" : "image",
        },
        items: [],
      }
    }
    const newIndex = blocks.length
    updateBlocks([...blocks, newBlock])
    setOpenBlockIndex(newIndex)
  }

  const removeBlock = async (index: number) => {
    const blockToRemove = blocks[index]
    if (blockToRemove) {
      await deleteMediaFiles(blockToRemove)
    }
    const next = [...blocks]
    next.splice(index, 1)
    updateBlocks(next)
    if (openBlockIndex === index) {
      setOpenBlockIndex(null)
    } else if (openBlockIndex !== null && openBlockIndex > index) {
      setOpenBlockIndex(openBlockIndex - 1)
    }
  }

  const moveBlock = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= blocks.length) return
    const next = [...blocks]
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp
    updateBlocks(next)
    if (openBlockIndex === index) {
      setOpenBlockIndex(targetIndex)
    } else if (openBlockIndex === targetIndex) {
      setOpenBlockIndex(index)
    }
  }

  const updateBlockAt = (index: number, patchOrUpdated: any) => {
    const next = [...blocks]
    next[index] = { ...next[index], ...patchOrUpdated }
    updateBlocks(next)
  }

  return (
    <FormSection
      title="Dynamic Content Blocks"
      sectionNumber={sectionNumber}
      active={isOpen}
      onClick={() => toggleSection("blocks")}
    >
      <div className="flex flex-col gap-6">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Add dynamic narrative blocks (paragraphs, pullquotes, featured images, featured videos, spotlight callouts, guidance guides, or practical notes grids) to build out the story layout.
        </p>

        {/* Blocks Repeater List */}
        <div className="flex flex-col gap-3">
          {blocks.map((block: any, idx: number) => {
            const blockType = block.type || "paragraph"
            const isBlockOpen = openBlockIndex === idx

            // Helper for block title summary
            const titleSummary =
              block.title?.value ||
              (block.content?.value
                ? block.content.value.replace(/<[^>]*>/g, "").slice(0, 40)
                : "") ||
              (blockType === "image"
                ? block.multimedia?.image?.url ? "Featured Image (✓ Image attached)" : "Featured Image (Click chevron to edit/upload)"
                : blockType === "video"
                  ? block.multimedia?.video?.url ? "Featured Video (✓ Video attached)" : "Featured Video (Click chevron to edit/upload)"
                  : blockType === "spotlight"
                    ? "Spotlight Highlight Card"
                    : blockType === "guidance"
                      ? "Guidance Field Guide"
                      : blockType === "notes"
                        ? "Practical Notes Grid"
                        : `Untitled ${blockType}`)

            return (
              <div
                key={idx}
                className="rounded-lg border border-border/70 bg-card overflow-hidden transition-all shadow-2xs"
              >
                {/* Collapsible Block Header Bar */}
                <div
                  onClick={() => toggleBlockAccordion(idx)}
                  className={`flex items-center justify-between p-3 select-none transition-colors cursor-pointer ${
                    isBlockOpen ? "bg-muted/30 border-b border-border/50" : "hover:bg-muted/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-semibold text-primary">
                      {idx + 1}
                    </span>

                    {/* Block Type Badge */}
                    <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-[11px] font-medium text-stone-700 dark:text-stone-300 capitalize">
                      {blockType === "paragraph" && <Type className="h-3 w-3 text-blue-500" />}
                      {blockType === "quote" && <Quote className="h-3 w-3 text-amber-500" />}
                      {blockType === "image" && <ImageIcon className="h-3 w-3 text-emerald-500" />}
                      {blockType === "video" && <VideoIcon className="h-3 w-3 text-red-500" />}
                      {blockType === "spotlight" && <Sparkles className="h-3 w-3 text-purple-500" />}
                      {(blockType === "guidance" || blockType === "guideline") && <Compass className="h-3 w-3 text-teal-500" />}
                      {blockType === "notes" && <BookOpen className="h-3 w-3 text-amber-600" />}
                      {blockType === "image" ? "Featured Image" : blockType === "video" ? "Featured Video" : blockType === "guidance" ? "Guidance Guide" : blockType === "notes" ? "Practical Notes" : blockType}
                    </div>

                    {/* Title Summary */}
                    <span className="text-xs font-medium text-muted-foreground truncate max-w-[180px] sm:max-w-[240px]">
                      {titleSummary}
                    </span>
                  </div>

                  {/* Right Actions: Reorder, Delete & Accordion Chevron */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => moveBlock(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(idx, "down")}
                      disabled={idx === blocks.length - 1}
                      className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(idx)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer mx-0.5"
                      title="Delete Block"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleBlockAccordion(idx)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                      title={isBlockOpen ? "Collapse block" : "Expand block"}
                    >
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isBlockOpen ? "rotate-180 text-foreground" : "rotate-0 text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Collapsible Block Form Content */}
                {isBlockOpen && (
                  <div className="p-4 flex flex-col gap-4">
                    {/* Block Type Switcher Dropdown */}
                    <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                      <label className="text-xs font-medium text-muted-foreground shrink-0">Block Type:</label>
                      <select
                        value={blockType}
                        onChange={(e) => updateBlockAt(idx, { type: e.target.value })}
                        className="h-8 rounded-md border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value="paragraph">Paragraph / Text Body</option>
                        <option value="quote">Pullquote / Quote Callout</option>
                        <option value="image">Featured Image</option>
                        <option value="video">Featured Video</option>
                        <option value="spotlight">Spotlight Card</option>
                        <option value="guidance">Guidance / Field Guide</option>
                        <option value="notes">Practical Notes Grid</option>
                      </select>
                    </div>

                    {/* Dedicated Sub-block Forms */}
                    {blockType === "paragraph" && (
                      <ParagraphForm
                        index={idx}
                        block={block}
                        onChange={(updated) => updateBlockAt(idx, updated)}
                      />
                    )}
                    {blockType === "quote" && (
                      <QuoteForm
                        index={idx}
                        block={block}
                        onChange={(updated) => updateBlockAt(idx, updated)}
                      />
                    )}
                    {blockType === "image" && (
                      <ImageBlockForm
                        index={idx}
                        block={block}
                        onChange={(updated) => updateBlockAt(idx, updated)}
                      />
                    )}
                    {blockType === "video" && (
                      <VideoBlockForm
                        index={idx}
                        block={block}
                        onChange={(updated) => updateBlockAt(idx, updated)}
                      />
                    )}
                    {blockType === "spotlight" && (
                      <SpotlightCardForm
                        index={idx}
                        block={block}
                        onChange={(updated) => updateBlockAt(idx, updated)}
                      />
                    )}
                    {(blockType === "guidance" || blockType === "guideline") && (
                      <GuidanceForm
                        index={idx}
                        block={block}
                        onChange={(updated) => updateBlockAt(idx, updated)}
                      />
                    )}
                    {blockType === "notes" && (
                      <NotesForm
                        index={idx}
                        block={block}
                        onChange={(updated) => updateBlockAt(idx, updated)}
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Add Block Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Add Block:</span>
          <button
            type="button"
            onClick={() => addBlock("paragraph")}
            className="flex items-center gap-1.5 rounded-md bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Paragraph
          </button>
          <button
            type="button"
            onClick={() => addBlock("quote")}
            className="flex items-center gap-1.5 rounded-md bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Quote
          </button>
          <button
            type="button"
            onClick={() => addBlock("image")}
            className="flex items-center gap-1.5 rounded-md bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Featured Image
          </button>
          <button
            type="button"
            onClick={() => addBlock("video")}
            className="flex items-center gap-1.5 rounded-md bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Featured Video
          </button>
          <button
            type="button"
            onClick={() => addBlock("spotlight")}
            className="flex items-center gap-1.5 rounded-md bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Spotlight Card
          </button>
          <button
            type="button"
            onClick={() => addBlock("guidance")}
            className="flex items-center gap-1.5 rounded-md bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Guidance Guide
          </button>
          <button
            type="button"
            onClick={() => addBlock("notes")}
            className="flex items-center gap-1.5 rounded-md bg-secondary hover:bg-secondary/80 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Practical Notes
          </button>
        </div>

        {/* Full Blocks Section Background Multimedia */}
        <div className="pt-4 border-t border-border/60">
          <UniversalMultimediaForm
            title="Full Blocks Section Background"
            fieldName="blocksBackgroundMultimedia"
            imageFieldName="storyBlocksBackgroundImage"
            videoFieldName="storyBlocksBackgroundVideo"
            allowImage={true}
            allowVideo={true}
            allowColor={true}
            defaultShow="color"
            value={draft?.blocksBackgroundMultimedia || emptyBlocksBackgroundMultimedia}
            onChange={(val) => updateField("blocksBackgroundMultimedia", val)}
          />
        </div>
      </div>
    </FormSection>
  )
}

export default BlocksForm
