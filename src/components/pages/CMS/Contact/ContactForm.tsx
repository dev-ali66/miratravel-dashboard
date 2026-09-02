import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"
import {
  TextField,
  TextAreaField,
  ColorField,
} from "../shared/FormControls"
import {
  type ContactPageData,
  type ContactSection,
} from "./contactTypes"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import {
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react"

export const ContactForm = () => {
  const {
    page,
    setPage,
    isLoading,
    isSaving,
    save,
  } = useCmsPage<ContactPageData>(
    "contact-us",
    "Contact Us"
  )

  /* =====================================================
      METADATA
  ====================================================== */

  const updateMetadata = (
    key: keyof ContactPageData["metadata"],
    value: string
  ) => {
    if (!page) return

    setPage({
      ...page,
      metadata: {
        ...page.metadata,
        [key]: value,
      },
    })
  }

  /* =====================================================
      SECTION
  ====================================================== */

  const updateSection = (
    index: number,
    updates: Partial<ContactSection>
  ) => {
    if (!page) return

    const sections = [...page.data.sections]

    sections[index] = {
      ...sections[index],
      ...updates,
    }

    setPage({
      ...page,
      data: {
        ...page.data,
        sections,
      },
    })
  }

  /* =====================================================
      SECTION CONTENT
  ====================================================== */

  const updateSectionContent = (
    index: number,
    key: string,
    value: any
  ) => {
    if (!page) return

    const section = page.data.sections[index]
    const sections = [...page.data.sections]

    sections[index] = {
      ...section,
      content: {
        ...(section.content ?? {}),
        [key]: value,
      },
    }

    setPage({
      ...page,
      data: {
        ...page.data,
        sections,
      },
    })
  }

  /* =====================================================
      SECTION FIELD
  ====================================================== */

  const updateSectionField = (
    sectionIndex: number,
    fieldIndex: number,
    key: string,
    value: any
  ) => {
    if (!page) return

    const section = page.data.sections[sectionIndex]

    if (!section.fields) return

    const fields = [...section.fields]

    fields[fieldIndex] = {
      ...fields[fieldIndex],
      [key]: value,
    }

    updateSection(sectionIndex, {
      fields,
    })
  }

  /* =====================================================
      BUTTON
  ====================================================== */

  const updateButton = (
    sectionIndex: number,
    buttonIndex: number,
    key: string,
    value: any
  ) => {
    if (!page) return

    const section = page.data.sections[sectionIndex]

    if (!section.buttons) return

    const buttons = [...section.buttons]

    buttons[buttonIndex] = {
      ...buttons[buttonIndex],
      [key]: value,
    }

    updateSection(sectionIndex, {
      buttons,
    })
  }

  /* =====================================================
      BACKGROUND IMAGE
  ====================================================== */

  const updateImage = (
    sectionIndex: number,
    value: string
  ) => {
    if (!page) return

    const section = page.data.sections[sectionIndex]

    updateSection(sectionIndex, {
      bgImages: {
        ...(section.bgImages ?? {}),
        url: value,
      },
    })
  }

  /* =====================================================
      SIDE IMAGE
  ====================================================== */

  const updateSideImage = (
    sectionIndex: number,
    value: string
  ) => {
    if (!page) return

    const section = page.data.sections[sectionIndex]

    const currentImage =
      section.sideImages?.[0] ?? {
        url: "",
      }

    updateSection(sectionIndex, {
      sideImages: [
        {
          ...currentImage,
          url: value,
        },
      ],
    })
  }

  const updateSideImageAlt = (
    sectionIndex: number,
    value: string
  ) => {
    if (!page) return

    const section = page.data.sections[sectionIndex]

    const currentImage =
      section.sideImages?.[0] ?? {
        url: "",
      }

    updateSection(sectionIndex, {
      sideImages: [
        {
          ...currentImage,
          alt: value,
        },
      ],
    })
  }

  /* =====================================================
      ITEMS
  ====================================================== */

  const updateItem = (
    sectionIndex: number,
    itemIndex: number,
    key: string,
    value: string
  ) => {
    if (!page) return

    const section = page.data.sections[sectionIndex]

    if (!section.items) return

    const items = [...section.items] as any[]

    items[itemIndex] = {
      ...items[itemIndex],
      [key]: value,
    }

    updateSection(sectionIndex, {
      items,
    })
  }

  /* =====================================================
      ADD PROCESS STEP
  ====================================================== */

  const addStep = (
    sectionIndex: number
  ) => {
    if (!page) return

    const section =
      page.data.sections[sectionIndex]

    const items = [
      ...(section.items ?? []),
    ] as any[]

    const nextStepNumber =
      items.length + 1

    items.push({
      id: `step-${Date.now()}`,
      index: String(nextStepNumber),
      title: "",
      description: "",
    })

    updateSection(sectionIndex, {
      items,
    })
  }

  /* =====================================================
      REMOVE PROCESS STEP
  ====================================================== */

  const removeStep = (
    sectionIndex: number,
    itemIndex: number
  ) => {
    if (!page) return

    const section =
      page.data.sections[sectionIndex]

    if (!section.items) return

    const items = [
      ...section.items,
    ] as any[]

    items.splice(itemIndex, 1)

    /*
     * Automatically re-number steps
     */

    const updatedItems =
      items.map(
        (item, index) => ({
          ...item,
          index: String(index + 1),
        })
      )

    updateSection(sectionIndex, {
      items: updatedItems,
    })
  }

  const addContactInfo = (
    sectionIndex: number
  ) => {
    if (!page) return

    const section =
      page.data.sections[sectionIndex]

    const items = [
      ...(section.items ?? []),
    ] as any[]

    items.push({
      id: `contact-info-${Date.now()}`,
      label: "",
      value: "",
      url: "",
    })

    updateSection(sectionIndex, {
      items,
    })
  }

  const removeContactInfo = (
    sectionIndex: number,
    itemIndex: number
  ) => {
    if (!page) return

    const section =
      page.data.sections[sectionIndex]

    if (!section.items) return

    const items = [
      ...section.items,
    ] as any[]

    items.splice(itemIndex, 1)

    updateSection(sectionIndex, {
      items,
    })
  }

  /* =====================================================
      LOADING
  ====================================================== */

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <SaveBar
          title="Contact Us"
          description="Manage contact page content and sections."
          onSave={save}
          isSaving={isSaving}
          isLoading={isLoading}
        />

        <div className="p-6 text-sm text-muted-foreground">
          Loading contact page...
        </div>
      </div>
    )
  }

  /* =====================================================
      NO PAGE
  ====================================================== */

  if (!page) {
    return (
      <div className="flex flex-col">
        <SaveBar
          title="Contact Us"
          description="Manage contact page content and sections."
          onSave={save}
          isSaving={isSaving}
          isLoading={isLoading}
        />

        <div className="p-6 text-sm text-muted-foreground">
          Contact page data not found.
        </div>
      </div>
    )
  }

  const sections =
    page.data?.sections ?? []

  /* =====================================================
      RENDER
  ====================================================== */

  return (
    <div className="flex flex-col">

      <SaveBar
        title="Contact Us"
        description="Manage contact page content and sections."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-4 p-4">

        {/* =====================================================
            SEO METADATA
        ====================================================== */}

        <details className="group rounded-lg border border-border/60">

          <summary className="flex cursor-pointer list-none items-center justify-between p-4">

            <div>
              <h3 className="text-sm font-semibold">
                SEO Metadata
              </h3>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Manage SEO title and description
              </p>
            </div>

            <ChevronDown
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
            />

          </summary>

          <div className="border-t border-border/50 p-4">

            <div className="flex flex-col gap-3">

              <TextField
                label="SEO Title"
                value={
                  page.metadata?.title ?? ""
                }
                onChange={(value) =>
                  updateMetadata(
                    "title",
                    value
                  )
                }
              />

              <TextAreaField
                label="SEO Description"
                value={
                  page.metadata?.description ??
                  ""
                }
                onChange={(value) =>
                  updateMetadata(
                    "description",
                    value
                  )
                }
              />

            </div>

          </div>

        </details>

        {/* =====================================================
            SECTIONS
        ====================================================== */}

        {sections.map(
          (section, index) => {

            const content =
              section.content ?? {}

            return (
              <details
                key={section.key}
                className="group overflow-hidden rounded-lg border border-border/60"
              >

                {/* SECTION HEADER */}

                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/30">

                  <div className="flex min-w-0 items-center gap-3">

                    <ChevronDown
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    />

                    <div className="min-w-0">

                      <h3 className="truncate text-sm font-semibold">
                        {section.key}
                      </h3>

                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Type: {section.type}
                      </p>

                    </div>

                  </div>

                  <span className="shrink-0 rounded bg-muted px-2 py-1 text-[10px]">
                    Order {section.order}
                  </span>

                </summary>

                {/* SECTION CONTENT */}

                <div className="border-t border-border/50 p-4">

                  {/* =================================================
                      BACKGROUND
                  ================================================== */}

                  <div className="mb-5">

                    <ColorField
                      label="Background Color"
                      value={
                        section.bgColor ??
                        "#ffffff"
                      }
                      onChange={(value) =>
                        updateSection(
                          index,
                          {
                            bgColor:
                              value,
                          }
                        )
                      }
                    />

                  </div>

                  {/* =================================================
                      PAGE HERO
                  ================================================== */}

                  {section.type ===
                    "pageHero" && (
                      <div className="flex flex-col gap-4">

                        <h4 className="text-xs font-semibold">
                          Hero Content
                        </h4>

                        <TextField
                          label="Eyebrow"
                          value={
                            content.eyebrow ??
                            ""
                          }
                          onChange={(value) =>
                            updateSectionContent(
                              index,
                              "eyebrow",
                              value
                            )
                          }
                        />

                        <TextField
                          label="Title Line 1"
                          value={
                            content.titleLine1 ??
                            ""
                          }
                          onChange={(value) =>
                            updateSectionContent(
                              index,
                              "titleLine1",
                              value
                            )
                          }
                        />

                        <TextField
                          label="Title Line 2"
                          value={
                            content.titleLine2 ??
                            ""
                          }
                          onChange={(value) =>
                            updateSectionContent(
                              index,
                              "titleLine2",
                              value
                            )
                          }
                        />

                        <TextAreaField
                          label="Description"
                          value={
                            content.description ??
                            ""
                          }
                          onChange={(value) =>
                            updateSectionContent(
                              index,
                              "description",
                              value
                            )
                          }
                        />

                        {/* HERO IMAGE */}

                        <details className="group rounded-md border border-border/50">

                          <summary className="flex cursor-pointer list-none items-center justify-between p-4">

                            <h4 className="text-xs font-semibold">
                              Hero Background Image
                            </h4>

                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                            />

                          </summary>

                          <div className="border-t border-border/50 p-4">

                            <ImageUploadField
                              label="Hero Background Image"
                              fieldName="contactHeroBgImage"
                              value={
                                section
                                  .bgImages
                                  ?.url ??
                                ""
                              }
                              onChange={(url) =>
                                updateImage(
                                  index,
                                  url
                                )
                              }
                            />

                            <div className="mt-4">

                              <TextField
                                label="Alt Text"
                                value={
                                  section
                                    .bgImages
                                    ?.alt ??
                                  ""
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSection(
                                    index,
                                    {
                                      bgImages:
                                      {
                                        ...(section.bgImages ??
                                          {}),
                                        alt: value,
                                      },
                                    }
                                  )
                                }
                              />

                            </div>

                            <div className="mt-4">

                              <TextField
                                label="Device"
                                value={
                                  section
                                    .bgImages
                                    ?.device ??
                                  "desktop"
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSection(
                                    index,
                                    {
                                      bgImages:
                                      {
                                        ...(section.bgImages ??
                                          {}),
                                        device:
                                          value as
                                          | "desktop"
                                          | "mobile",
                                      },
                                    }
                                  )
                                }
                              />

                            </div>

                          </div>

                        </details>

                      </div>
                    )}

                  {/* =================================================
                      PROCESS STEPS
                  ================================================== */}

                  {section.type ===
                    "stepList" && (
                      <div className="flex flex-col gap-4">

                        {/* SECTION TITLE */}

                        <TextField
                          label="Section Title"
                          value={
                            content.title ??
                            ""
                          }
                          onChange={(value) =>
                            updateSectionContent(
                              index,
                              "title",
                              value
                            )
                          }
                        />

                        {/* STEP HEADER */}

                        <div className="flex items-center justify-between gap-3">

                          <div>

                            <h4 className="text-xs font-semibold">
                              Process Steps
                            </h4>

                            <p className="mt-1 text-[11px] text-muted-foreground">
                              Add, edit or remove process steps.
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              addStep(index)
                            }
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                          >

                            <Plus className="h-3.5 w-3.5" />

                            Add Step

                          </button>

                        </div>

                        {/* STEPS */}

                        <div className="flex flex-col gap-3">

                          {section.items?.map(
                            (
                              item: any,
                              itemIndex
                            ) => (

                              <details
                                key={
                                  item.id ??
                                  `step-${itemIndex}`
                                }
                                className="group rounded-md border border-border/50"
                              >

                                {/* STEP HEADER */}

                                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">

                                  <div className="flex min-w-0 items-center gap-3">

                                    <ChevronDown
                                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                                    />

                                    <div className="min-w-0">

                                      <p className="text-xs font-semibold">

                                        Step{" "}

                                        {itemIndex +
                                          1}

                                        {item.title
                                          ? ` — ${item.title}`
                                          : ""}

                                      </p>

                                    </div>

                                  </div>

                                  {/* DELETE */}

                                  <button
                                    type="button"
                                    onClick={(
                                      event
                                    ) => {

                                      event.preventDefault()

                                      event.stopPropagation()

                                      removeStep(
                                        index,
                                        itemIndex
                                      )

                                    }}
                                    className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                    title="Remove step"
                                  >

                                    <Trash2 className="h-4 w-4" />

                                  </button>

                                </summary>

                                {/* STEP CONTENT */}

                                <div className="border-t border-border/50 p-4">

                                  <div className="flex flex-col gap-3">

                                    <TextField
                                      label="Step"
                                      value={
                                        item.index ??
                                        String(
                                          itemIndex +
                                          1
                                        )
                                      }
                                      onChange={(
                                        value
                                      ) =>
                                        updateItem(
                                          index,
                                          itemIndex,
                                          "index",
                                          value
                                        )
                                      }
                                    />

                                    <TextField
                                      label="Title"
                                      value={
                                        item.title ??
                                        ""
                                      }
                                      onChange={(
                                        value
                                      ) =>
                                        updateItem(
                                          index,
                                          itemIndex,
                                          "title",
                                          value
                                        )
                                      }
                                    />

                                    <TextAreaField
                                      label="Description"
                                      value={
                                        item.description ??
                                        ""
                                      }
                                      onChange={(
                                        value
                                      ) =>
                                        updateItem(
                                          index,
                                          itemIndex,
                                          "description",
                                          value
                                        )
                                      }
                                    />

                                  </div>

                                </div>

                              </details>

                            )
                          )}

                          {/* EMPTY STATE */}

                          {(!section.items ||
                            section.items.length ===
                            0) && (

                              <div className="rounded-md border border-dashed border-border/60 p-6 text-center">

                                <p className="text-xs text-muted-foreground">
                                  No process steps added yet.
                                </p>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addStep(
                                      index
                                    )
                                  }
                                  className="mt-3 inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
                                >

                                  <Plus className="h-3.5 w-3.5" />

                                  Add First Step

                                </button>

                              </div>

                            )}

                        </div>

                      </div>
                    )}

                  {/* =================================================
                      CONTACT FORM
                  ================================================== */}

                  {section.type ===
                    "contactForm" && (
                      <div className="flex flex-col gap-5">

                        {/* FORM CONTENT */}

                        <details
                          open
                          className="group rounded-md border border-border/50"
                        >

                          <summary className="flex cursor-pointer list-none items-center justify-between p-4">

                            <h4 className="text-xs font-semibold">
                              Form Content
                            </h4>

                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                            />

                          </summary>

                          <div className="border-t border-border/50 p-4">

                            <div className="flex flex-col gap-3">

                              <TextField
                                label="Eyebrow"
                                value={
                                  content.eyebrow ??
                                  ""
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSectionContent(
                                    index,
                                    "eyebrow",
                                    value
                                  )
                                }
                              />

                              <TextField
                                label="Title"
                                value={
                                  content.title ??
                                  ""
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSectionContent(
                                    index,
                                    "title",
                                    value
                                  )
                                }
                              />

                            </div>

                          </div>

                        </details>

                        {/* FORM FIELDS */}

                        <details className="group rounded-md border border-border/50">

                          <summary className="flex cursor-pointer list-none items-center justify-between p-4">

                            <h4 className="text-xs font-semibold">
                              Form Fields
                            </h4>

                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                            />

                          </summary>

                          <div className="border-t border-border/50 p-4">

                            <div className="flex flex-col gap-4">

                              {section.fields?.map(
                                (
                                  field,
                                  fieldIndex
                                ) => (

                                  <details
                                    key={
                                      field.id
                                    }
                                    className="group rounded-md border border-border/50"
                                  >

                                    <summary className="flex cursor-pointer list-none items-center justify-between p-4">

                                      <p className="text-xs font-semibold">
                                        {
                                          field.label
                                        }
                                      </p>

                                      <ChevronDown
                                        className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                                      />

                                    </summary>

                                    <div className="border-t border-border/50 p-4">

                                      <div className="flex flex-col gap-3">

                                        <TextField
                                          label="Label"
                                          value={
                                            field.label
                                          }
                                          onChange={(
                                            value
                                          ) =>
                                            updateSectionField(
                                              index,
                                              fieldIndex,
                                              "label",
                                              value
                                            )
                                          }
                                        />

                                        <TextField
                                          label="Placeholder"
                                          value={
                                            field.placeholder ??
                                            ""
                                          }
                                          onChange={(
                                            value
                                          ) =>
                                            updateSectionField(
                                              index,
                                              fieldIndex,
                                              "placeholder",
                                              value
                                            )
                                          }
                                        />

                                        <TextField
                                          label="Type"
                                          value={
                                            field.type
                                          }
                                          onChange={(
                                            value
                                          ) =>
                                            updateSectionField(
                                              index,
                                              fieldIndex,
                                              "type",
                                              value
                                            )
                                          }
                                        />

                                        <TextField
                                          label="Row"
                                          value={String(
                                            field.row ??
                                            ""
                                          )}
                                          onChange={(
                                            value
                                          ) =>
                                            updateSectionField(
                                              index,
                                              fieldIndex,
                                              "row",
                                              Number(
                                                value
                                              )
                                            )
                                          }
                                        />

                                      </div>

                                    </div>

                                  </details>

                                )
                              )}

                            </div>

                          </div>

                        </details>

                        {/* SIDE IMAGE */}

                        <details className="group rounded-md border border-border/50">

                          <summary className="flex cursor-pointer list-none items-center justify-between p-4">

                            <h4 className="text-xs font-semibold">
                              Side Image
                            </h4>

                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                            />

                          </summary>

                          <div className="border-t border-border/50 p-4">

                            <ImageUploadField
                              label="Side Image"
                              fieldName="contactFormSideImage"
                              value={
                                section
                                  .sideImages?.[0]
                                  ?.url ?? ""
                              }
                              onChange={(url) =>
                                updateSideImage(
                                  index,
                                  url
                                )
                              }
                            />

                            <div className="mt-4">

                              <TextField
                                label="Alt Text"
                                value={
                                  section
                                    .sideImages?.[0]
                                    ?.alt ?? ""
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSideImageAlt(
                                    index,
                                    value
                                  )
                                }
                              />

                            </div>

                          </div>

                        </details>

                        {/* BUTTON */}

                        <details className="group rounded-md border border-border/50">

                          <summary className="flex cursor-pointer list-none items-center justify-between p-4">

                            <h4 className="text-xs font-semibold">
                              Submit Button
                            </h4>

                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                            />

                          </summary>

                          <div className="border-t border-border/50 p-4">

                            {section.buttons?.map(
                              (
                                button,
                                buttonIndex
                              ) => (

                                <div
                                  key={
                                    buttonIndex
                                  }
                                  className="flex flex-col gap-3"
                                >

                                  <TextField
                                    label="Label"
                                    value={
                                      button.label
                                    }
                                    onChange={(
                                      value
                                    ) =>
                                      updateButton(
                                        index,
                                        buttonIndex,
                                        "label",
                                        value
                                      )
                                    }
                                  />

                                  <TextField
                                    label="URL"
                                    value={
                                      button.url
                                    }
                                    onChange={(
                                      value
                                    ) =>
                                      updateButton(
                                        index,
                                        buttonIndex,
                                        "url",
                                        value
                                      )
                                    }
                                  />

                                </div>

                              )
                            )}

                          </div>

                        </details>

                      </div>
                    )}

                  {/* =================================================
                      PERSONAL APPROACH
                  ================================================== */}

                  {section.type ===
                    "textImageFeature" && (
                      <div className="flex flex-col gap-4">

                        <TextField
                          label="Eyebrow"
                          value={
                            content.eyebrow ??
                            ""
                          }
                          onChange={(value) =>
                            updateSectionContent(
                              index,
                              "eyebrow",
                              value
                            )
                          }
                        />

                        <TextField
                          label="Title"
                          value={
                            content.title ??
                            ""
                          }
                          onChange={(value) =>
                            updateSectionContent(
                              index,
                              "title",
                              value
                            )
                          }
                        />

                        {content.paragraphs?.map(
                          (
                            paragraph,
                            paragraphIndex
                          ) => (

                            <TextAreaField
                              key={
                                paragraphIndex
                              }
                              label={`Paragraph ${paragraphIndex +
                                1
                                }`}
                              value={
                                paragraph
                              }
                              onChange={(
                                value
                              ) => {

                                const paragraphs =
                                  [
                                    ...(content.paragraphs ??
                                      []),
                                  ]

                                paragraphs[
                                  paragraphIndex
                                ] = value

                                updateSectionContent(
                                  index,
                                  "paragraphs",
                                  paragraphs
                                )

                              }}
                            />

                          )
                        )}

                        {/* FEATURE IMAGE */}

                        <details className="group rounded-md border border-border/50">

                          <summary className="flex cursor-pointer list-none items-center justify-between p-4">

                            <h4 className="text-xs font-semibold">
                              Feature Image
                            </h4>

                            <ChevronDown
                              className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                            />

                          </summary>

                          <div className="border-t border-border/50 p-4">

                            <ImageUploadField
                              label="Feature Image"
                              fieldName="personalApproachImage"
                              value={
                                section
                                  .sideImages?.[0]
                                  ?.url ?? ""
                              }
                              onChange={(url) =>
                                updateSideImage(
                                  index,
                                  url
                                )
                              }
                            />

                            <div className="mt-4">

                              <TextField
                                label="Alt Text"
                                value={
                                  section
                                    .sideImages?.[0]
                                    ?.alt ?? ""
                                }
                                onChange={(
                                  value
                                ) =>
                                  updateSideImageAlt(
                                    index,
                                    value
                                  )
                                }
                              />

                            </div>

                          </div>

                        </details>

                      </div>
                    )}

                  {/* =================================================
                      CONTACT INFO
                  ================================================== */}

                  {section.type ===
                    "infoColumns" && (
                      <div className="flex flex-col gap-4">

                        {/* HEADER */}

                        <div className="flex items-center justify-between gap-3">

                          <div>
                            <h4 className="text-xs font-semibold">
                              Contact Information
                            </h4>

                            <p className="mt-1 text-[11px] text-muted-foreground">
                              Add, edit or remove contact information.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              addContactInfo(index)
                            }
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Contact
                          </button>

                        </div>

                        {/* CONTACT ITEMS */}

                        <div className="flex flex-col gap-3">

                          {section.items?.map(
                            (
                              item: any,
                              itemIndex
                            ) => (

                              <details
                                key={
                                  item.id ??
                                  `contact-${itemIndex}`
                                }
                                className="group rounded-md border border-border/50"
                              >

                                {/* HEADER */}

                                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">

                                  <div className="flex min-w-0 items-center gap-3">

                                    <ChevronDown
                                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                                    />

                                    <div className="min-w-0">

                                      <p className="truncate text-xs font-semibold">
                                        {item.label ||
                                          `Contact ${itemIndex + 1}`}
                                      </p>

                                      {item.value && (
                                        <p className="mt-1 truncate text-[11px] text-muted-foreground">
                                          {item.value}
                                        </p>
                                      )}

                                    </div>

                                  </div>

                                  {/* DELETE */}

                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.preventDefault()
                                      event.stopPropagation()

                                      removeContactInfo(
                                        index,
                                        itemIndex
                                      )
                                    }}
                                    className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                    title="Remove contact information"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>

                                </summary>

                                {/* CONTENT */}

                                <div className="border-t border-border/50 p-4">

                                  <div className="flex flex-col gap-3">

                                    <TextField
                                      label="Label"
                                      value={
                                        item.label ?? ""
                                      }
                                      onChange={(value) =>
                                        updateItem(
                                          index,
                                          itemIndex,
                                          "label",
                                          value
                                        )
                                      }
                                    />

                                    <TextField
                                      label="Value"
                                      value={
                                        item.value ?? ""
                                      }
                                      onChange={(value) =>
                                        updateItem(
                                          index,
                                          itemIndex,
                                          "value",
                                          value
                                        )
                                      }
                                    />

                                    <TextField
                                      label="URL"
                                      value={
                                        item.url ?? ""
                                      }
                                      onChange={(value) =>
                                        updateItem(
                                          index,
                                          itemIndex,
                                          "url",
                                          value
                                        )
                                      }
                                    />

                                  </div>

                                </div>

                              </details>

                            )
                          )}

                          {/* EMPTY STATE */}

                          {(!section.items ||
                            section.items.length === 0) && (

                              <div className="rounded-md border border-dashed border-border/60 p-6 text-center">

                                <p className="text-xs text-muted-foreground">
                                  No contact information added yet.
                                </p>

                                <button
                                  type="button"
                                  onClick={() =>
                                    addContactInfo(index)
                                  }
                                  className="mt-3 inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  Add First Contact
                                </button>

                              </div>

                            )}

                        </div>

                      </div>
                    )}

                  {/* =================================================
                      CTA
                  ================================================== */}

                  {section.type ===
                    "ctaBanner" && (
                      <div className="flex flex-col gap-4">

                        <TextField
                          label="Title"
                          value={
                            content.title ??
                            ""
                          }
                          onChange={(value) =>
                            updateSectionContent(
                              index,
                              "title",
                              value
                            )
                          }
                        />

                        <TextAreaField
                          label="Description"
                          value={
                            content.description ??
                            ""
                          }
                          onChange={(value) =>
                            updateSectionContent(
                              index,
                              "description",
                              value
                            )
                          }
                        />

                        {section.buttons?.map(
                          (
                            button,
                            buttonIndex
                          ) => (

                            <details
                              key={
                                buttonIndex
                              }
                              className="group rounded-md border border-border/50"
                            >

                              <summary className="flex cursor-pointer list-none items-center justify-between p-4">

                                <h4 className="text-xs font-semibold">
                                  CTA Button
                                </h4>

                                <ChevronDown
                                  className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                                />

                              </summary>

                              <div className="border-t border-border/50 p-4">

                                <div className="flex flex-col gap-3">

                                  <TextField
                                    label="Label"
                                    value={
                                      button.label
                                    }
                                    onChange={(
                                      value
                                    ) =>
                                      updateButton(
                                        index,
                                        buttonIndex,
                                        "label",
                                        value
                                      )
                                    }
                                  />

                                  <TextField
                                    label="URL"
                                    value={
                                      button.url
                                    }
                                    onChange={(
                                      value
                                    ) =>
                                      updateButton(
                                        index,
                                        buttonIndex,
                                        "url",
                                        value
                                      )
                                    }
                                  />

                                  <TextField
                                    label="Style"
                                    value={
                                      button.style ??
                                      ""
                                    }
                                    onChange={(
                                      value
                                    ) =>
                                      updateButton(
                                        index,
                                        buttonIndex,
                                        "style",
                                        value
                                      )
                                    }
                                  />

                                </div>

                              </div>

                            </details>

                          )
                        )}

                      </div>
                    )}

                </div>

              </details>
            )
          }
        )}

      </div>

    </div>
  )
}
