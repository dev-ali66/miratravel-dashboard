import { useEffect, useMemo, useState } from "react"

import { Plus } from "lucide-react"

import { useCmsDraft } from "../shared/CmsDraftContext"

import type { FaqPageData, FaqStyles } from "./faqTypes"
import type { FieldStyle } from "../shared/FormControls"
import { UniversalMultimediaPreview } from "../Home/shared/preview/UniversalMultimediaPreview"

const colorWithOpacity = (
  color: string | null | undefined,
  opacity: number | undefined
): string | undefined => {
  if (!color || opacity === undefined || opacity >= 100) return color ?? undefined

  const hexMatch = color.match(/^#([0-9a-f]{6})$/i)
  if (!hexMatch) return color ?? undefined

  const red = parseInt(hexMatch[1].slice(0, 2), 16)
  const green = parseInt(hexMatch[1].slice(2, 4), 16)
  const blue = parseInt(hexMatch[1].slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`
}

const contentCssStyle = (
  style: FieldStyle | undefined,
  fallbackColor: string
) => ({
  color: colorWithOpacity(
    style?.textColor ?? fallbackColor,
    style?.textOpacity
  ),
  backgroundColor: colorWithOpacity(
    style?.backgroundColor,
    style?.backgroundOpacity
  ),
})

export const FaqContentPreview = () => {
  const page = useCmsDraft<FaqPageData>()

  const data = page?.data

  /* =========================
     SORT FAQ
  ========================== */

  const sortedItems = useMemo(() => {
    return [...(data?.items ?? [])].sort((a, b) => a.order - b.order)
  }, [data?.items])

  /* =========================
     DEFAULT OPEN
  ========================== */

  const defaultOpenIndex = useMemo(() => {
    return sortedItems.findIndex((item) => item.isOpenByDefault)
  }, [sortedItems])

  const [openIndex, setOpenIndex] = useState(defaultOpenIndex)

  /*
   * Update preview immediately
   * when CMS draft changes.
   */

  useEffect(() => {
    setOpenIndex(defaultOpenIndex)
  }, [defaultOpenIndex])

  if (!page || !data) {
    return null
  }

  /* =========================
     BACKGROUND IMAGE
  ========================== */

  const backgroundImage = data.bgImages?.find(
    (image) => image.position === "background"
  )?.url
  const backgroundMultimedia = data.backgroundMultimedia

  /* =========================
     DEFAULT STYLES
  ========================== */

  const styles: FaqStyles = data.styles ?? {
    page: {
      backgroundColor: data.bgColor || "#FBF6EE",

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
     TITLE
  ========================== */

  const title =
    data.content?.title || data.title || "Frequently Asked Questions"
  const contentMultimedia = data.content?.contentMultimedia

  const eyebrowStyle = contentCssStyle(
    data.content?.faqContentEyebrowStyle,
    styles.header.eyebrowColor
  )
  const titleStyle = contentCssStyle(
    data.content?.faqContentTitleStyle,
    styles.header.titleColor
  )
  const subtitleStyle = contentCssStyle(
    data.content?.faqContentSubtitleStyle,
    styles.header.subtitleColor
  )
  const descriptionStyle = contentCssStyle(
    data.content?.faqContentDescriptionStyle,
    styles.header.descriptionColor
  )

  return (
    <div
      className="relative min-h-full overflow-hidden"
      style={{
        backgroundColor: styles.page.backgroundColor,

        color: styles.page.textColor,
      }}
    >
      {/* =========================
          BACKGROUND IMAGE
      ========================== */}

      {(backgroundMultimedia || backgroundImage) && (
        <>
          <UniversalMultimediaPreview
            multimedia={
              backgroundMultimedia ?? {
                type: "image",
                url: backgroundImage,
              }
            }
            mode="background"
            className="absolute inset-0"
            containerClassName="absolute inset-0"
          />

          {/* Color overlay */}

          <div
            className="absolute inset-0"
            style={{
              backgroundColor: styles.page.backgroundColor,

              opacity: 0.75,
            }}
          />
        </>
      )}

      {/* =========================
          CONTENT
      ========================== */}

      <div className="relative mx-auto w-full container px-4 lg:px-0 py-16 md:py-24 max-w-[1200px]">
        {/* =========================
            HEADER
        ========================== */}

        <div
          className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl p-6 text-center"
          style={{
            backgroundColor: styles.header.backgroundColor,
          }}
        >
          {contentMultimedia && (
            <UniversalMultimediaPreview
              multimedia={contentMultimedia}
              mode="background"
              className="absolute inset-0 z-0"
              containerClassName="absolute inset-0 z-0"
            />
          )}

          {/* EYEBROW */}

          {data.content?.eyebrow && (
            <p
              className="relative z-10 mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-accent"
              style={{
                ...eyebrowStyle,
              }}
            >
              {data.content.eyebrow}
            </p>
          )}

          {/* TITLE */}

          <h1
            className="relative z-10 font-heading text-3xl md:text-5xl font-semibold tracking-tight"
            style={{
              ...titleStyle,
            }}
          >
            {title}
          </h1>

          {/* SUBTITLE */}

          {data.content?.subtitle && (
            <p
              className="relative z-10 mt-3 text-sm md:text-base leading-relaxed text-subtitle"
              style={{
                ...subtitleStyle,
              }}
            >
              {data.content.subtitle}
            </p>
          )}

          {/* DESCRIPTION */}

          {data.content?.description && (
            <p
              className="relative z-10 mt-2 text-xs md:text-sm leading-5 text-subtitle"
              style={{
                ...descriptionStyle,
              }}
            >
              {data.content.description}
            </p>
          )}
        </div>

        {/* =========================
            FAQ LIST
        ========================== */}

        <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3.5">
          {sortedItems.length > 0 ? (
            sortedItems.map((item, index) => {
              const isOpen = openIndex === index

              const itemBackground = isOpen
                ? styles.faq.openBackgroundColor
                : styles.faq.itemBackgroundColor

              const questionColor = isOpen
                ? styles.faq.openQuestionColor
                : styles.faq.questionColor

              const answerColor = isOpen
                ? styles.faq.openAnswerColor
                : styles.faq.answerColor

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: itemBackground,

                    border: `1px solid ${styles.faq.itemBorderColor}`,
                  }}
                >
                  {/* QUESTION */}

                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: questionColor,
                      }}
                    >
                      {item.question?.trim() || "Untitled question"}
                    </span>

                    <Plus
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                      style={{
                        color: styles.faq.iconColor,
                      }}
                    />
                  </button>

                  {/* ANSWER */}

                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p
                        className="text-xs leading-5"
                        style={{
                          color: answerColor,
                        }}
                      >
                        {item.answer?.trim() ||
                          "Answer coming soon — fill this in on the left."}
                      </p>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div
              className="rounded-xl px-6 py-10 text-center"
              style={{
                backgroundColor: styles.faq.itemBackgroundColor,

                border: `1px dashed ${styles.faq.itemBorderColor}`,
              }}
            >
              <p
                className="text-sm"
                style={{
                  color: styles.faq.answerColor,
                }}
              >
                No FAQ questions added yet.
              </p>
            </div>
          )}
        </div>

        {/* =========================
            COUNT
        ========================== */}

        {sortedItems.length > 0 && (
          <p
            className="mt-4 text-center text-[10px]"
            style={{
              color: styles.faq.answerColor,
            }}
          >
            {sortedItems.length} frequently asked questions
          </p>
        )}
      </div>
    </div>
  )
}
