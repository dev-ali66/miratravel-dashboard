import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"
import {
  TextField,
  TextAreaField,
  ColorField,
} from "../shared/FormControls"
import { ButtonsField } from "../shared/ButtonsField"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import type { CtaPageData } from "./ctaTypes"

export const CtaForm = () => {
  const {
    page,
    setPage,
    isLoading,
    isSaving,
    save,
  } = useCmsPage<CtaPageData>(
    "cta",
    "CTA"
  )

  console.log(page)

  const updatePage = (
    updates: Partial<CtaPageData>
  ) => {
    setPage({
      name: page?.name ?? "CTA",

      metadata: {
        title:
          page?.metadata?.title ?? "",

        description:
          page?.metadata?.description ?? "",

        keywords:
          page?.metadata?.keywords ?? [],

        canonicalUrl:
          page?.metadata?.canonicalUrl ?? "",

        robots: {
          index:
            page?.metadata?.robots?.index ?? true,

          follow:
            page?.metadata?.robots?.follow ?? true,
        },

        ...updates.metadata,
      },

      data: {
        page:
          page?.data?.page ?? "cta",

        eyebrow:
          page?.data?.eyebrow ?? "",

        titleLine1:
          page?.data?.titleLine1 ?? "",

        titleHighlight:
          page?.data?.titleHighlight ?? "",

        description:
          page?.data?.description ?? "",

        bgColor:
          page?.data?.bgColor ?? "#ffffff",

        bgImage: {
          ctaLeftImage:
            page?.data?.bgImage?.ctaLeftImage ?? "",

          alt:
            page?.data?.bgImage?.alt ?? "",
        },

        buttons:
          page?.data?.buttons ?? [],

        ...updates.data,
      },
    })
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */
  if (isLoading) {
    return (
      <div className="flex flex-col">
        <SaveBar
          title="Call To Action"
          description="Reusable CTA banner shown across the public site."
          onSave={save}
          isSaving={isSaving}
          isLoading={isLoading}
        />

        <div className="flex items-center justify-center p-10">
          <p className="text-sm text-muted-foreground">
            Loading CTA data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">

      {/* ======================================================
          SAVE BAR
      ======================================================= */}
      <SaveBar
        title="Call To Action"
        description="Reusable CTA banner shown across the public site."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-6 p-4">

        {/* ====================================================
            SEO METADATA
        ===================================================== */}
        <div className="rounded-lg border border-border/60 p-3">

          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            SEO Metadata
          </div>

          <div className="flex flex-col gap-3">

            {/* Meta Title */}
            <TextField
              label="Meta title"
              value={
                page?.metadata?.title ?? ""
              }
              onChange={(value) =>
                updatePage({
                  metadata: {
                    title: value,
                    description:
                      page?.metadata?.description ?? "",
                    keywords:
                      page?.metadata?.keywords ?? [],
                    canonicalUrl:
                      page?.metadata?.canonicalUrl ?? "",
                    robots: {
                      index:
                        page?.metadata?.robots?.index ?? true,
                      follow:
                        page?.metadata?.robots?.follow ?? true,
                    },
                  },
                })
              }
            />

            {/* Meta Description */}
            <TextAreaField
              label="Meta description"
              value={
                page?.metadata?.description ?? ""
              }
              onChange={(value) =>
                updatePage({
                  metadata: {
                    title:
                      page?.metadata?.title ?? "",
                    description: value,
                    keywords:
                      page?.metadata?.keywords ?? [],
                    canonicalUrl:
                      page?.metadata?.canonicalUrl ?? "",
                    robots: {
                      index:
                        page?.metadata?.robots?.index ?? true,
                      follow:
                        page?.metadata?.robots?.follow ?? true,
                    },
                  },
                })
              }
            />

            {/* Keywords */}
            <TextField
              label="Keywords (comma separated)"
              value={
                page?.metadata?.keywords?.join(", ") ?? ""
              }
              onChange={(value) =>
                updatePage({
                  metadata: {
                    title:
                      page?.metadata?.title ?? "",
                    description:
                      page?.metadata?.description ?? "",
                    keywords: value
                      .split(",")
                      .map(
                        (keyword) =>
                          keyword.trim()
                      )
                      .filter(Boolean),
                    canonicalUrl:
                      page?.metadata?.canonicalUrl ?? "",
                    robots: {
                      index:
                        page?.metadata?.robots?.index ?? true,
                      follow:
                        page?.metadata?.robots?.follow ?? true,
                    },
                  },
                })
              }
            />

            {/* Canonical URL */}
            <TextField
              label="Canonical URL"
              value={
                page?.metadata?.canonicalUrl ?? ""
              }
              onChange={(value) =>
                updatePage({
                  metadata: {
                    title:
                      page?.metadata?.title ?? "",
                    description:
                      page?.metadata?.description ?? "",
                    keywords:
                      page?.metadata?.keywords ?? [],
                    canonicalUrl: value,
                    robots: {
                      index:
                        page?.metadata?.robots?.index ?? true,
                      follow:
                        page?.metadata?.robots?.follow ?? true,
                    },
                  },
                })
              }
            />

            {/* =================================================
                ROBOTS
            ================================================== */}
            <div className="flex flex-col gap-2">

              <span className="text-sm font-medium">
                Robots
              </span>

              <div className="flex items-center gap-5">

                {/* Index */}
                <label className="flex items-center gap-2 text-sm">

                  <input
                    type="checkbox"
                    checked={
                      page?.metadata?.robots?.index ??
                      true
                    }
                    onChange={(event) =>
                      updatePage({
                        metadata: {
                          title:
                            page?.metadata?.title ?? "",

                          description:
                            page?.metadata?.description ?? "",

                          keywords:
                            page?.metadata?.keywords ?? [],

                          canonicalUrl:
                            page?.metadata?.canonicalUrl ?? "",

                          robots: {
                            index:
                              event.target.checked,

                            follow:
                              page?.metadata?.robots
                                ?.follow ?? true,
                          },
                        },
                      })
                    }
                  />

                  Index
                </label>

                {/* Follow */}
                <label className="flex items-center gap-2 text-sm">

                  <input
                    type="checkbox"
                    checked={
                      page?.metadata?.robots?.follow ??
                      true
                    }
                    onChange={(event) =>
                      updatePage({
                        metadata: {
                          title:
                            page?.metadata?.title ?? "",

                          description:
                            page?.metadata?.description ?? "",

                          keywords:
                            page?.metadata?.keywords ?? [],

                          canonicalUrl:
                            page?.metadata?.canonicalUrl ?? "",

                          robots: {
                            index:
                              page?.metadata?.robots
                                ?.index ?? true,

                            follow:
                              event.target.checked,
                          },
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

        {/* ====================================================
            CTA CONTENT
        ===================================================== */}
        <div className="rounded-lg border border-border/60 p-3">

          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            CTA Content
          </div>

          <div className="flex flex-col gap-3">

            {/* Eyebrow */}
            <TextField
              label="Eyebrow"
              value={
                page?.data?.eyebrow ?? ""
              }
              onChange={(value) =>
                updatePage({
                  data: {
                    page:
                      page?.data?.page ?? "cta",

                    eyebrow: value,

                    titleLine1:
                      page?.data?.titleLine1 ?? "",

                    titleHighlight:
                      page?.data?.titleHighlight ?? "",

                    description:
                      page?.data?.description ?? "",

                    bgColor:
                      page?.data?.bgColor ??
                      "#ffffff",

                    bgImage: {
                      ctaLeftImage:
                        page?.data?.bgImage
                          ?.ctaLeftImage ?? "",

                      alt:
                        page?.data?.bgImage?.alt ??
                        "",
                    },

                    buttons:
                      page?.data?.buttons ?? [],
                  },
                })
              }
            />

            {/* Title Line 1 */}
            <TextField
              label="Title line 1"
              value={
                page?.data?.titleLine1 ?? ""
              }
              onChange={(value) =>
                updatePage({
                  data: {
                    page:
                      page?.data?.page ?? "cta",

                    eyebrow:
                      page?.data?.eyebrow ?? "",

                    titleLine1: value,

                    titleHighlight:
                      page?.data?.titleHighlight ?? "",

                    description:
                      page?.data?.description ?? "",

                    bgColor:
                      page?.data?.bgColor ??
                      "#ffffff",

                    bgImage: {
                      ctaLeftImage:
                        page?.data?.bgImage
                          ?.ctaLeftImage ?? "",

                      alt:
                        page?.data?.bgImage?.alt ??
                        "",
                    },

                    buttons:
                      page?.data?.buttons ?? [],
                  },
                })
              }
            />

            {/* Highlighted Title */}
            <TextField
              label="Highlighted title line"
              value={
                page?.data?.titleHighlight ?? ""
              }
              onChange={(value) =>
                updatePage({
                  data: {
                    page:
                      page?.data?.page ?? "cta",

                    eyebrow:
                      page?.data?.eyebrow ?? "",

                    titleLine1:
                      page?.data?.titleLine1 ?? "",

                    titleHighlight: value,

                    description:
                      page?.data?.description ?? "",

                    bgColor:
                      page?.data?.bgColor ??
                      "#ffffff",

                    bgImage: {
                      ctaLeftImage:
                        page?.data?.bgImage
                          ?.ctaLeftImage ?? "",

                      alt:
                        page?.data?.bgImage?.alt ??
                        "",
                    },

                    buttons:
                      page?.data?.buttons ?? [],
                  },
                })
              }
            />

            {/* Description */}
            <TextAreaField
              label="Description"
              value={
                page?.data?.description ?? ""
              }
              onChange={(value) =>
                updatePage({
                  data: {
                    page:
                      page?.data?.page ?? "cta",

                    eyebrow:
                      page?.data?.eyebrow ?? "",

                    titleLine1:
                      page?.data?.titleLine1 ?? "",

                    titleHighlight:
                      page?.data?.titleHighlight ?? "",

                    description: value,

                    bgColor:
                      page?.data?.bgColor ??
                      "#ffffff",

                    bgImage: {
                      ctaLeftImage:
                        page?.data?.bgImage
                          ?.ctaLeftImage ?? "",

                      alt:
                        page?.data?.bgImage?.alt ??
                        "",
                    },

                    buttons:
                      page?.data?.buttons ?? [],
                  },
                })
              }
            />

          </div>
        </div>

        {/* ====================================================
            BACKGROUND
        ===================================================== */}
        <div className="rounded-lg border border-border/60 p-3">

          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Background
          </div>

          <div className="flex flex-col gap-3">

            {/* Background Color */}
            <ColorField
              label="Background color"
              value={
                page?.data?.bgColor ??
                "#ffffff"
              }
              onChange={(value) =>
                updatePage({
                  data: {
                    page:
                      page?.data?.page ?? "cta",

                    eyebrow:
                      page?.data?.eyebrow ?? "",

                    titleLine1:
                      page?.data?.titleLine1 ?? "",

                    titleHighlight:
                      page?.data?.titleHighlight ?? "",

                    description:
                      page?.data?.description ?? "",

                    bgColor: value,

                    bgImage: {
                      ctaLeftImage:
                        page?.data?.bgImage
                          ?.ctaLeftImage ?? "",

                      alt:
                        page?.data?.bgImage?.alt ??
                        "",
                    },

                    buttons:
                      page?.data?.buttons ?? [],
                  },
                })
              }
            />

            {/* CTA Image */}
            <ImageUploadField
              label="CTA Image"
              value={
                page?.data?.bgImage?.ctaLeftImage ?? ""
              }
              fieldName="ctaLeftImage"
              onChange={(value: any) =>
                updatePage({
                  data: {
                    page:
                      page?.data?.page ?? "cta",

                    eyebrow:
                      page?.data?.eyebrow ?? "",

                    titleLine1:
                      page?.data?.titleLine1 ?? "",

                    titleHighlight:
                      page?.data?.titleHighlight ?? "",

                    description:
                      page?.data?.description ?? "",

                    bgColor:
                      page?.data?.bgColor ?? "#ffffff",

                    bgImage: {
                      ctaLeftImage: value,

                      alt:
                        page?.data?.bgImage?.alt ?? "",
                    },

                    buttons:
                      page?.data?.buttons ?? [],
                  },
                })
              }
            />
            {/* Image Alt */}
            <TextField
              label="Image alt text"
              value={
                page?.data?.bgImage?.alt ?? ""
              }
              onChange={(value) =>
                updatePage({
                  data: {
                    page:
                      page?.data?.page ?? "cta",

                    eyebrow:
                      page?.data?.eyebrow ?? "",

                    titleLine1:
                      page?.data?.titleLine1 ?? "",

                    titleHighlight:
                      page?.data?.titleHighlight ?? "",

                    description:
                      page?.data?.description ?? "",

                    bgColor:
                      page?.data?.bgColor ??
                      "#ffffff",

                    bgImage: {
                      ctaLeftImage:
                        page?.data?.bgImage
                          ?.ctaLeftImage ?? "",

                      alt: value,
                    },

                    buttons:
                      page?.data?.buttons ?? [],
                  },
                })
              }
            />

          </div>
        </div>

        {/* ====================================================
            BUTTONS
        ===================================================== */}
        <div className="rounded-lg border border-border/60 p-3">

          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Buttons
          </div>

          <ButtonsField
            value={
              page?.data?.buttons ?? []
            }
            onChange={(buttons) =>
              updatePage({
                data: {
                  page:
                    page?.data?.page ?? "cta",

                  eyebrow:
                    page?.data?.eyebrow ?? "",

                  titleLine1:
                    page?.data?.titleLine1 ?? "",

                  titleHighlight:
                    page?.data?.titleHighlight ?? "",

                  description:
                    page?.data?.description ?? "",

                  bgColor:
                    page?.data?.bgColor ??
                    "#ffffff",

                  bgImage: {
                    ctaLeftImage:
                      page?.data?.bgImage
                        ?.ctaLeftImage ?? "",

                    alt:
                      page?.data?.bgImage?.alt ??
                      "",
                  },

                  buttons,
                },
              })
            }
          />

        </div>

      </div>
    </div>
  )
}
