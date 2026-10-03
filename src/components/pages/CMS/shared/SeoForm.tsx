import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { TextAreaField, TextField, getSafeString } from "./FormControls"

export type SeoMetadata = {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  robots?: {
    index?: boolean
    follow?: boolean
  }
}

type SeoFormProps = {
  metadata?: SeoMetadata
  onChange: (metadata: SeoMetadata) => void
  showBanner?: boolean
}

export function parseKeywords(raw: any): string {
  if (raw === null || raw === undefined) return ""

  // Case 1: If raw is an object with a .value or .keywords property
  if (typeof raw === "object" && !Array.isArray(raw)) {
    if (raw.value !== undefined) return parseKeywords(raw.value)
    if (raw.keywords !== undefined) return parseKeywords(raw.keywords)
    return ""
  }

  // Case 2: If raw is an array
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === "string") {
          return item.trim() === "[object Object]" ? "" : item.trim()
        }
        if (typeof item === "number" || typeof item === "boolean") return String(item)
        if (item && typeof item === "object") {
          if (item.value !== undefined) return parseKeywords(item.value)
          if (item.label !== undefined) return parseKeywords(item.label)
          if (item.name !== undefined) return parseKeywords(item.name)
          if (item.text !== undefined) return parseKeywords(item.text)
        }
        return ""
      })
      .filter(Boolean)
      .join(", ")
  }

  // Case 3: If raw is a string
  if (typeof raw === "string") {
    if (raw.trim() === "[object Object]") return ""
    return raw
  }

  // Case 4: If raw is a number or boolean
  if (typeof raw === "number" || typeof raw === "boolean") {
    return String(raw)
  }

  return ""
}

export const SeoForm = ({
  metadata,
  onChange,
  showBanner = true,
}: SeoFormProps) => {
  const normalizedMetadata: SeoMetadata = {
    ...(metadata ?? {}),
    title: getSafeString(metadata?.title),
    description: getSafeString(metadata?.description),
    canonicalUrl: getSafeString(metadata?.canonicalUrl),
    robots: {
      index: metadata?.robots?.index ?? true,
      follow: metadata?.robots?.follow ?? true,
    },
  }

  // Local state to allow natural typing of spaces, commas, and trailing characters
  const [keywordsText, setKeywordsText] = useState<string>(() => {
    return parseKeywords(metadata?.keywords)
  })

  // Sync keywordsText when metadata.keywords prop changes externally (e.g. on initial data load)
  useEffect(() => {
    const externalStr = parseKeywords(metadata?.keywords)
    const currentParsedStr = parseKeywords(
      keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    )

    if (externalStr !== currentParsedStr && externalStr !== keywordsText) {
      setKeywordsText(externalStr)
    }
  }, [metadata?.keywords])

  const handleKeywordsChange = (val: string) => {
    setKeywordsText(val)
    const array = val
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "" && item !== "[object Object]")
    onChange({
      ...normalizedMetadata,
      keywords: array,
    })
  }

  return (
    <div className="space-y-4">
      {showBanner && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <Globe className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">
              Search Engine Optimization (SEO)
            </p>
            <p className="mt-0.5 leading-relaxed">
              Configure search engine metadata, OpenGraph canonical URL, search keywords, and robot crawling directives for this page.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border/70 bg-card p-3.5">
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          SEO Metadata Settings
        </p>

        <div className="flex flex-col gap-3">
          <TextField
            label="Meta title"
            value={normalizedMetadata.title ?? ""}
            onChange={(value) =>
              onChange({ ...normalizedMetadata, title: getSafeString(value) })
            }
          />

          <TextAreaField
            label="Meta description"
            value={normalizedMetadata.description ?? ""}
            onChange={(value) =>
              onChange({ ...normalizedMetadata, description: getSafeString(value) })
            }
          />

          <TextField
            label="Keywords (comma separated)"
            value={keywordsText}
            onChange={(value) => handleKeywordsChange(String(value))}
          />

          <TextField
            label="Canonical URL"
            value={normalizedMetadata.canonicalUrl ?? ""}
            onChange={(value) =>
              onChange({ ...normalizedMetadata, canonicalUrl: getSafeString(value) })
            }
          />

          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Robots Directives
            </span>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  checked={normalizedMetadata.robots?.index ?? true}
                  onChange={(event) =>
                    onChange({
                      ...normalizedMetadata,
                      robots: {
                        ...(normalizedMetadata.robots ?? {}),
                        index: event.target.checked,
                      },
                    })
                  }
                />
                Index Page
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                  checked={normalizedMetadata.robots?.follow ?? true}
                  onChange={(event) =>
                    onChange({
                      ...normalizedMetadata,
                      robots: {
                        ...(normalizedMetadata.robots ?? {}),
                        follow: event.target.checked,
                      },
                    })
                  }
                />
                Follow Links
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
