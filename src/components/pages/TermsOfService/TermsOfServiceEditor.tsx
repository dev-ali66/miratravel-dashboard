import { RichTextEditor } from "@/components/shared/RichTextEditor"
import type { TermsPart } from "./types"

interface TermsOfServiceEditorProps {
  currentPart: TermsPart
  activeTab: string
  onContentChange: (newContent: string) => void
}

export function TermsOfServiceEditor({
  currentPart,
  activeTab,
  onContentChange,
}: TermsOfServiceEditorProps) {
  return (
    <div className="space-y-4 overflow-hidden rounded-2xl border border-border/60 bg-background/50 p-6 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-2 border-b border-border/40 pb-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {currentPart.fullTitle}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Edit the rich text content for {currentPart.tabTitle.toLowerCase()}{" "}
            below.
          </p>
        </div>
        <div className="self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:self-center">
          Active Tab: {currentPart.tabTitle}
        </div>
      </div>

      <RichTextEditor
        key={activeTab}
        value={currentPart.content}
        onChange={onContentChange}
        className="min-h-100"
        canvasClassName="max-h-[65vh]"
      />
    </div>
  )
}
