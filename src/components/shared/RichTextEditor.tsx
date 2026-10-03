import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Unlink,
  Palette,
  Highlighter,
  Eraser,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  canvasClassName?: string
  minHeight?: string
}

const PRESET_COLORS = [
  "#000000",
  "#171717",
  "#4B5563",
  "#9CA3AF",
  "#FFFFFF",
  "#D97706",
  "#B45309",
  "#E11D48",
  "#2563EB",
  "#059669",
  "#7C3AED",
  "#DB2777",
]

const PRESET_HIGHLIGHTS = [
  "#FEF08A",
  "#FED7AA",
  "#BBF7D0",
  "#BFDBFE",
  "#DDD6FE",
  "#FBCFE8",
  "#E5E7EB",
  "#374151",
]

const MenuBar = ({ editor }: { editor: any }) => {
  const [customColor, setCustomColor] = useState("#FFFFFF")

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter Link URL", previousUrl || "https://")

    if (url === null) return
    if (url === "" || url === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border/60 bg-muted/40 p-1.5 backdrop-blur">
      {/* Headings / Block Types */}
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(
            "h-7 w-7 text-xs font-semibold",
            editor.isActive("paragraph") && "bg-background text-foreground shadow-xs"
          )}
          title="Paragraph"
        >
          P
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("heading", { level: 1 }) && "bg-background text-foreground shadow-xs"
          )}
          title="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("heading", { level: 2 }) && "bg-background text-foreground shadow-xs"
          )}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(
            "h-7 w-7",
            editor.isActive("heading", { level: 3 }) && "bg-background text-foreground shadow-xs"
          )}
          title="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mx-0.5 h-4 w-px bg-border/60" />

      {/* Formatting Marks */}
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("h-7 w-7", editor.isActive("bold") && "bg-background text-foreground shadow-xs")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("h-7 w-7", editor.isActive("italic") && "bg-background text-foreground shadow-xs")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn("h-7 w-7", editor.isActive("underline") && "bg-background text-foreground shadow-xs")}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn("h-7 w-7", editor.isActive("strike") && "bg-background text-foreground shadow-xs")}
          title="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mx-0.5 h-4 w-px bg-border/60" />

      {/* Text Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="Text Color"
          >
            <Palette className="h-3.5 w-3.5 text-primary" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="start">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Text Color</p>
          <div className="grid grid-cols-6 gap-1.5">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className="h-6 w-6 rounded-md border border-border/80 transition hover:scale-110"
                style={{ backgroundColor: c }}
                onClick={() => editor.chain().focus().setColor(c).run()}
              />
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value)
                editor.chain().focus().setColor(e.target.value).run()
              }}
              className="h-7 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value)
                if (/^#[0-9a-f]{6}$/i.test(e.target.value)) {
                  editor.chain().focus().setColor(e.target.value).run()
                }
              }}
              className="h-7 flex-1 rounded border border-border bg-background px-2 text-xs font-mono"
              placeholder="#FFFFFF"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="mt-2 w-full text-xs"
          >
            Reset Color
          </Button>
        </PopoverContent>
      </Popover>

      {/* Highlight Color Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", editor.isActive("highlight") && "bg-background text-foreground shadow-xs")}
            title="Highlight Color"
          >
            <Highlighter className="h-3.5 w-3.5 text-amber-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="start">
          <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">Highlight Color</p>
          <div className="grid grid-cols-4 gap-1.5">
            {PRESET_HIGHLIGHTS.map((c) => (
              <button
                key={c}
                type="button"
                className="h-6 w-full rounded-md border border-border/80 transition hover:scale-105"
                style={{ backgroundColor: c }}
                onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().unsetHighlight().run()}
            className="mt-2.5 w-full text-xs"
          >
            Remove Highlight
          </Button>
        </PopoverContent>
      </Popover>

      <div className="mx-0.5 h-4 w-px bg-border/60" />

      {/* Alignment */}
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={cn("h-7 w-7", editor.isActive({ textAlign: "left" }) && "bg-background text-foreground shadow-xs")}
          title="Align Left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={cn("h-7 w-7", editor.isActive({ textAlign: "center" }) && "bg-background text-foreground shadow-xs")}
          title="Align Center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={cn("h-7 w-7", editor.isActive({ textAlign: "right" }) && "bg-background text-foreground shadow-xs")}
          title="Align Right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={cn("h-7 w-7", editor.isActive({ textAlign: "justify" }) && "bg-background text-foreground shadow-xs")}
          title="Align Justify"
        >
          <AlignJustify className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mx-0.5 h-4 w-px bg-border/60" />

      {/* Lists & Blockquote */}
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("h-7 w-7", editor.isActive("bulletList") && "bg-background text-foreground shadow-xs")}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("h-7 w-7", editor.isActive("orderedList") && "bg-background text-foreground shadow-xs")}
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn("h-7 w-7", editor.isActive("blockquote") && "bg-background text-foreground shadow-xs")}
          title="Quote"
        >
          <Quote className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mx-0.5 h-4 w-px bg-border/60" />

      {/* Links & Clear */}
      <div className="flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={setLink}
          className={cn("h-7 w-7", editor.isActive("link") && "bg-background text-foreground shadow-xs")}
          title="Insert / Edit Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </Button>
        {editor.isActive("link") && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="h-7 w-7 text-destructive"
            title="Remove Link"
          >
            <Unlink className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="h-7 w-7"
          title="Clear Formatting"
        >
          <Eraser className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-7 w-7"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-7 w-7"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder: _placeholder = "Write content here...",
  className,
  canvasClassName,
  minHeight = "160px",
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: false,
        underline: false,
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none p-3.5 min-h-[140px] text-foreground leading-relaxed",
          canvasClassName
        ),
      },
    },
  })

  // Synchronize editor content if external value changes
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      if (value === "" || value === null) {
        editor.commands.setContent("")
      } else if (editor.getText() === "" && value) {
        editor.commands.setContent(value)
      }
    }
  }, [value, editor])

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-all focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20",
        className
      )}
    >
      <MenuBar editor={editor} />
      <div style={{ minHeight }} className="cursor-text bg-background">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default RichTextEditor
