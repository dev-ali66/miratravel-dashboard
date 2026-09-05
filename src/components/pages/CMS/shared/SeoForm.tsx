import { TextAreaField, TextField } from "./FormControls"

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
}

export const SeoForm = ({ metadata, onChange }: SeoFormProps) => {
  const normalizedMetadata: SeoMetadata = {
    ...(metadata ?? {}),
    robots: {
      index: metadata?.robots?.index ?? true,
      follow: metadata?.robots?.follow ?? true,
    },
  }

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        SEO Metadata
      </p>

      <div className="flex flex-col gap-3">
        <TextField
          label="Meta title"
          value={normalizedMetadata.title ?? ""}
          onChange={(value) =>
            onChange({ ...normalizedMetadata, title: value })
          }
        />

        <TextAreaField
          label="Meta description"
          value={normalizedMetadata.description ?? ""}
          onChange={(value) =>
            onChange({ ...normalizedMetadata, description: value })
          }
        />

        <TextField
          label="Keywords (comma separated)"
          value={normalizedMetadata.keywords?.join(", ") ?? ""}
          onChange={(value) =>
            onChange({
              ...normalizedMetadata,
              keywords: value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
        />

        <TextField
          label="Canonical URL"
          value={normalizedMetadata.canonicalUrl ?? ""}
          onChange={(value) =>
            onChange({ ...normalizedMetadata, canonicalUrl: value })
          }
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Robots</span>

          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
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
              Index
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
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
              Follow
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
