import { useState } from "react"

import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"

import {
  TextField,
  TextAreaField,
  ColorField,
} from "../shared/FormControls"

import { RepeaterList } from "../shared/RepeaterList"
import { CollapsibleSectionCard } from "../shared/CollapsibleSectionCard"

import { ImageUploadField } from "@/components/shared/ImageUploadField"

import type {
  FaqItem,
  FaqPageData,
  FaqStyles,
} from "./faqTypes"

export const FaqForm = () => {
  const [openSections, setOpenSections] = useState<
    Record<string, boolean>
  >({
    seo: true,
  })

  const toggleSection = (key: string) => {
    setOpenSections((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const {
    page,
    setPage,
    isLoading,
    isSaving,
    save,
  } = useCmsPage<FaqPageData>("faq", "FAQ")

  if (!page) return null

  const d = page.data

  /* =========================
     DEFAULT STYLES
  ========================== */

  const styles: FaqStyles = d.styles ?? {
    page: {
      backgroundColor:
        d.bgColor || "#FBF6EE",
      textColor: "#171717",
    },

    header: {
      backgroundColor: "transparent",
      eyebrowColor: "#737373",
      titleColor: "#171717",
      subtitleColor: "#737373",
      descriptionColor: "#737373",
    },

    faq: {
      itemBackgroundColor: "#FFFFFF",
      itemBorderColor: "#E5E5E5",
      questionColor: "#171717",
      answerColor: "#737373",
      iconColor: "#737373",

      openBackgroundColor: "#F5F5F5",
      openQuestionColor: "#111111",
      openAnswerColor: "#555555",
    },
  }

  /* =========================
     UPDATE DATA
  ========================== */

  const updateData = (
    value: Partial<FaqPageData["data"]>
  ) => {
    setPage({
      ...page,
      data: {
        ...d,
        ...value,
      },
    })
  }

  /* =========================
     UPDATE METADATA
  ========================== */

  const updateMetadata = (
    value: Partial<FaqPageData["metadata"]>
  ) => {
    setPage({
      ...page,
      metadata: {
        ...page.metadata,
        ...value,
      },
    })
  }

  /* =========================
     UPDATE CONTENT
  ========================== */

  const updateContent = (
    value: Partial<FaqPageData["data"]["content"]>
  ) => {
    updateData({
      content: {
        ...d.content,
        ...value,
      },
    })
  }

  /* =========================
     UPDATE STYLES
  ========================== */

  const updateStyles = (
    value: Partial<FaqStyles>
  ) => {
    updateData({
      styles: {
        ...styles,
        ...value,
      },
    })
  }

  const updatePageStyles = (
    value: Partial<FaqStyles["page"]>
  ) => {
    updateStyles({
      page: {
        ...styles.page,
        ...value,
      },
    })
  }

  const updateHeaderStyles = (
    value: Partial<FaqStyles["header"]>
  ) => {
    updateStyles({
      header: {
        ...styles.header,
        ...value,
      },
    })
  }

  const updateFaqStyles = (
    value: Partial<FaqStyles["faq"]>
  ) => {
    updateStyles({
      faq: {
        ...styles.faq,
        ...value,
      },
    })
  }

  /* =========================
     BACKGROUND IMAGE
  ========================== */

  const backgroundImage = d.bgImages?.find(
    (image) =>
      image.position === "background"
  )

  const updateBackgroundImage = (
    url: string
  ) => {
    const existingImages =
      d.bgImages ?? []

    const otherImages =
      existingImages.filter(
        (image) =>
          image.position !== "background"
      )

    if (!url) {
      updateData({
        bgImages: otherImages,
      })

      return
    }

    const image = {
      id:
        backgroundImage?.id ??
        `faq-bg-${Date.now()}`,

      url,

      alt:
        backgroundImage?.alt ??
        "FAQ background",

      position: "background",
    }

    updateData({
      bgImages: [
        ...otherImages,
        image,
      ],
    })
  }

  return (
    <div className="flex flex-col">

      {/* =========================
          SAVE BAR
      ========================== */}

      <SaveBar
        title="FAQ"
        description="Manage FAQ content, appearance and background."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-6 p-4">
        <div className="px-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            FAQ Sections
          </p>

          <p className="mt-1 text-[11px] text-muted-foreground">
            Click a section to expand or collapse its settings.
          </p>
        </div>

        {/* =========================
            SEO METADATA
        ========================== */}

        <CollapsibleSectionCard
          title="SEO Metadata"
          meta="seo"
          indexLabel="01"
          isOpen={openSections.seo ?? false}
          onToggle={() => toggleSection("seo")}
        >
          <div className="rounded-lg border border-border/60 p-3">

          <p className="mb-3 text-xs font-semibold text-foreground">
            SEO Metadata
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="SEO Title"
              value={
                page.metadata?.title ?? ""
              }
              onChange={(value) =>
                updateMetadata({
                  title: value,
                })
              }
            />

            <TextAreaField
              label="SEO Description"
              value={
                page.metadata?.description ?? ""
              }
              onChange={(value) =>
                updateMetadata({
                  description: value,
                })
              }
            />

          </div>
          </div>
        </CollapsibleSectionCard>

        {/* =========================
            FAQ CONTENT
        ========================== */}

        <CollapsibleSectionCard
          title="FAQ Content"
          meta="content"
          indexLabel="02"
          isOpen={openSections.content ?? false}
          onToggle={() => toggleSection("content")}
        >
          <div className="rounded-lg border border-border/60 p-3">

          <p className="mb-3 text-xs font-semibold text-foreground">
            FAQ Content
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Eyebrow"
              value={
                d.content?.eyebrow ?? ""
              }
              onChange={(value) =>
                updateContent({
                  eyebrow: value,
                })
              }
            />

            <TextField
              label="Title"
              value={
                d.content?.title ?? ""
              }
              onChange={(value) =>
                updateContent({
                  title: value,
                })
              }
            />

            <TextAreaField
              label="Subtitle"
              value={
                d.content?.subtitle ?? ""
              }
              onChange={(value) =>
                updateContent({
                  subtitle: value,
                })
              }
            />

            <TextAreaField
              label="Description"
              value={
                d.content?.description ?? ""
              }
              onChange={(value) =>
                updateContent({
                  description: value,
                })
              }
            />

          </div>
          </div>
        </CollapsibleSectionCard>

        {/* =========================
            BACKGROUND
        ========================== */}

        <CollapsibleSectionCard
          title="Background"
          meta="background"
          indexLabel="03"
          isOpen={openSections.background ?? false}
          onToggle={() => toggleSection("background")}
        >
          <div className="rounded-lg border border-border/60 p-3">

          <p className="mb-3 text-xs font-semibold text-foreground">
            Background
          </p>

          <div className="flex flex-col gap-4">

            {/* COLOR */}

            <ColorField
              label="Background Color"
              value={
                styles.page.backgroundColor ||
                "#FBF6EE"
              }
              onChange={(value) =>
                updatePageStyles({
                  backgroundColor: value,
                })
              }
            />

            {/* IMAGE */}

            <ImageUploadField
              label="Background Image"
              value={
                backgroundImage?.url ?? ""
              }
              onChange={
                updateBackgroundImage
              }
            />

          </div>
          </div>
        </CollapsibleSectionCard>

        {/* =========================
            HEADER APPEARANCE
        ========================== */}

        <CollapsibleSectionCard
          title="Header Appearance"
          meta="header appearance"
          indexLabel="04"
          isOpen={openSections.headerAppearance ?? false}
          onToggle={() => toggleSection("headerAppearance")}
        >
          <div className="rounded-lg border border-border/60 p-3">

          <p className="mb-3 text-xs font-semibold text-foreground">
            Header Appearance
          </p>

          <div className="flex flex-col gap-3">

            <ColorField
              label="Header Background"
              value={
                styles.header
                  .backgroundColor
              }
              onChange={(value) =>
                updateHeaderStyles({
                  backgroundColor:
                    value,
                })
              }
            />

            <ColorField
              label="Eyebrow Color"
              value={
                styles.header
                  .eyebrowColor
              }
              onChange={(value) =>
                updateHeaderStyles({
                  eyebrowColor:
                    value,
                })
              }
            />

            <ColorField
              label="Title Color"
              value={
                styles.header.titleColor
              }
              onChange={(value) =>
                updateHeaderStyles({
                  titleColor: value,
                })
              }
            />

            <ColorField
              label="Subtitle Color"
              value={
                styles.header
                  .subtitleColor
              }
              onChange={(value) =>
                updateHeaderStyles({
                  subtitleColor:
                    value,
                })
              }
            />

            <ColorField
              label="Description Color"
              value={
                styles.header
                  .descriptionColor
              }
              onChange={(value) =>
                updateHeaderStyles({
                  descriptionColor:
                    value,
                })
              }
            />

          </div>
          </div>
        </CollapsibleSectionCard>

        {/* =========================
            FAQ APPEARANCE
        ========================== */}

        <CollapsibleSectionCard
          title="FAQ Appearance"
          meta="faq appearance"
          indexLabel="05"
          isOpen={openSections.faqAppearance ?? false}
          onToggle={() => toggleSection("faqAppearance")}
        >
          <div className="rounded-lg border border-border/60 p-3">

          <p className="mb-3 text-xs font-semibold text-foreground">
            FAQ Appearance
          </p>

          <div className="flex flex-col gap-3">

            <ColorField
              label="Item Background"
              value={
                styles.faq
                  .itemBackgroundColor
              }
              onChange={(value) =>
                updateFaqStyles({
                  itemBackgroundColor:
                    value,
                })
              }
            />

            <ColorField
              label="Item Border"
              value={
                styles.faq
                  .itemBorderColor
              }
              onChange={(value) =>
                updateFaqStyles({
                  itemBorderColor:
                    value,
                })
              }
            />

            <ColorField
              label="Question Color"
              value={
                styles.faq.questionColor
              }
              onChange={(value) =>
                updateFaqStyles({
                  questionColor: value,
                })
              }
            />

            <ColorField
              label="Answer Color"
              value={
                styles.faq.answerColor
              }
              onChange={(value) =>
                updateFaqStyles({
                  answerColor: value,
                })
              }
            />

            <ColorField
              label="Icon Color"
              value={
                styles.faq.iconColor
              }
              onChange={(value) =>
                updateFaqStyles({
                  iconColor: value,
                })
              }
            />

            <ColorField
              label="Open Item Background"
              value={
                styles.faq
                  .openBackgroundColor
              }
              onChange={(value) =>
                updateFaqStyles({
                  openBackgroundColor:
                    value,
                })
              }
            />

            <ColorField
              label="Open Question Color"
              value={
                styles.faq
                  .openQuestionColor
              }
              onChange={(value) =>
                updateFaqStyles({
                  openQuestionColor:
                    value,
                })
              }
            />

            <ColorField
              label="Open Answer Color"
              value={
                styles.faq
                  .openAnswerColor
              }
              onChange={(value) =>
                updateFaqStyles({
                  openAnswerColor:
                    value,
                })
              }
            />

          </div>
          </div>
        </CollapsibleSectionCard>

        {/* =========================
            QUESTIONS
        ========================== */}

        <CollapsibleSectionCard
          title="Questions"
          meta="items"
          indexLabel="06"
          isOpen={openSections.questions ?? false}
          onToggle={() => toggleSection("questions")}
        >
          <div className="rounded-lg border border-border/60 p-3">

          <p className="mb-3 text-xs font-semibold text-foreground">
            Questions
          </p>

          <RepeaterList<FaqItem>
            items={d.items ?? []}

            onChange={(items) =>
              updateData({
                items: items.map(
                  (item, index) => ({
                    ...item,
                    order: index + 1,
                  })
                ),
              })
            }

            addLabel="Add question"

            emptyLabel="No questions added."

            itemLabel={(item) =>
              item.question ||
              "Untitled question"
            }

            newItem={() => ({
              id: `faq-${Date.now()}`,
              order:
                (d.items?.length ?? 0) + 1,
              question: "",
              answer: "",
              isOpenByDefault: false,
            })}

            renderItem={(
              item,
              update
            ) => (
              <div className="flex flex-col gap-2.5">

                <TextField
                  label="Question"
                  value={
                    item.question
                  }
                  onChange={(value) =>
                    update({
                      ...item,
                      question:
                        value,
                    })
                  }
                />

                <TextAreaField
                  label="Answer"
                  value={
                    item.answer
                  }
                  onChange={(value) =>
                    update({
                      ...item,
                      answer:
                        value,
                    })
                  }
                />

                <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">

                  <input
                    type="checkbox"
                    checked={
                      item.isOpenByDefault
                    }
                    onChange={(e) =>
                      update({
                        ...item,
                        isOpenByDefault:
                          e.target
                            .checked,
                      })
                    }
                  />

                  Open by default

                </label>

              </div>
            )}
          />

          </div>
        </CollapsibleSectionCard>

      </div>
    </div>
  )
}