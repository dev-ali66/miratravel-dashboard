import type { Dispatch, SetStateAction } from "react"

import { TextAreaField, TextField } from "../../../shared/FormControls"
import type { HomePageData } from "../../homeTypes"

type SeoFormProps = {
  page: HomePageData | null | undefined
  setPage: Dispatch<SetStateAction<HomePageData | null>>
}

export const SeoForm = ({ page, setPage }: SeoFormProps) => {
  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        SEO Metadata
      </p>

      <div className="flex flex-col gap-3">
        <TextField
          label="Meta title"
          value={page?.metadata?.title ?? ""}
          onChange={(value) =>
            setPage({
              ...page,
              name: page?.name ?? "Home",
              metadata: {
                ...(page?.metadata ?? {}),
                title: value,
              },
              data: {
                ...(page?.data ?? {}),
              },
            })
          }
        />

        <TextAreaField
          label="Meta description"
          value={page?.metadata?.description ?? ""}
          onChange={(value) =>
            setPage({
              ...page,
              name: page?.name ?? "Home",
              metadata: {
                ...(page?.metadata ?? {}),
                description: value,
              },
              data: {
                ...(page?.data ?? {}),
              },
            })
          }
        />

        <TextField
          label="Keywords (comma separated)"
          value={page?.metadata?.keywords?.join(", ") ?? ""}
          onChange={(value) =>
            setPage({
              ...page,
              name: page?.name ?? "Home",
              metadata: {
                ...(page?.metadata ?? {}),
                keywords: value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              },
              data: {
                ...(page?.data ?? {}),
              },
            })
          }
        />

        <TextField
          label="Canonical URL"
          value={page?.metadata?.canonicalUrl ?? ""}
          onChange={(value) =>
            setPage({
              ...page,
              name: page?.name ?? "Home",
              metadata: {
                ...(page?.metadata ?? {}),
                canonicalUrl: value,
              },
              data: {
                ...(page?.data ?? {}),
              },
            })
          }
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Robots</span>

          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={page?.metadata?.robots?.index ?? true}
                onChange={(event) =>
                  setPage({
                    ...page,
                    name: page?.name ?? "Home",
                    metadata: {
                      ...(page?.metadata ?? {}),
                      robots: {
                        ...(page?.metadata?.robots ?? {}),
                        index: event.target.checked,
                      },
                    },
                    data: {
                      ...(page?.data ?? {}),
                    },
                  })
                }
              />
              Index
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={page?.metadata?.robots?.follow ?? true}
                onChange={(event) =>
                  setPage({
                    ...page,
                    name: page?.name ?? "Home",
                    metadata: {
                      ...(page?.metadata ?? {}),
                      robots: {
                        ...(page?.metadata?.robots ?? {}),
                        follow: event.target.checked,
                      },
                    },
                    data: {
                      ...(page?.data ?? {}),
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
