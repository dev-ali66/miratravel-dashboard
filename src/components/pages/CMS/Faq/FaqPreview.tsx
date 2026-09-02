import {
  useEffect,
  useMemo,
  useState,
} from "react"

import { Plus } from "lucide-react"

import { useCmsDraft } from "../shared/CmsDraftContext"

import type {
  FaqPageData,
  FaqStyles,
} from "./faqTypes"

export const FaqPreview = () => {
  const page =
    useCmsDraft<FaqPageData>()

  const data = page?.data

  /* =========================
     SORT FAQ
  ========================== */

  const sortedItems = useMemo(() => {
    return [...(data?.items ?? [])].sort(
      (a, b) =>
        a.order - b.order
    )
  }, [data?.items])

  /* =========================
     DEFAULT OPEN
  ========================== */

  const defaultOpenIndex =
    useMemo(() => {
      return sortedItems.findIndex(
        (item) =>
          item.isOpenByDefault
      )
    }, [sortedItems])

  const [
    openIndex,
    setOpenIndex,
  ] = useState(
    defaultOpenIndex
  )

  /*
   * Update preview immediately
   * when CMS draft changes.
   */

  useEffect(() => {
    setOpenIndex(
      defaultOpenIndex
    )
  }, [defaultOpenIndex])

  if (!page || !data) {
    return null
  }

  /* =========================
     BACKGROUND IMAGE
  ========================== */

  const backgroundImage =
    data.bgImages?.find(
      (image) =>
        image.position ===
        "background"
    )?.url

  /* =========================
     DEFAULT STYLES
  ========================== */

  const styles: FaqStyles =
    data.styles ?? {
      page: {
        backgroundColor:
          data.bgColor ||
          "#FBF6EE",

        textColor:
          "#171717",
      },

      header: {
        backgroundColor:
          "transparent",

        eyebrowColor:
          "#737373",

        titleColor:
          "#171717",

        subtitleColor:
          "#737373",

        descriptionColor:
          "#737373",
      },

      faq: {
        itemBackgroundColor:
          "#FFFFFF",

        itemBorderColor:
          "#E5E5E5",

        questionColor:
          "#171717",

        answerColor:
          "#737373",

        iconColor:
          "#737373",

        openBackgroundColor:
          "#F5F5F5",

        openQuestionColor:
          "#111111",

        openAnswerColor:
          "#555555",
      },
    }

  /* =========================
     TITLE
  ========================== */

  const title =
    data.content?.title ||
    data.title ||
    "Frequently Asked Questions"

  return (
    <div
      className="relative min-h-full overflow-hidden"
      style={{
        backgroundColor:
          styles.page
            .backgroundColor,

        color:
          styles.page.textColor,
      }}
    >

      {/* =========================
          BACKGROUND IMAGE
      ========================== */}

      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                `url(${backgroundImage})`,
            }}
          />

          {/* Color overlay */}

          <div
            className="absolute inset-0"
            style={{
              backgroundColor:
                styles.page
                  .backgroundColor,

              opacity: 0.75,
            }}
          />
        </>
      )}

      {/* =========================
          CONTENT
      ========================== */}

      <div className="relative mx-auto w-full max-w-3xl px-6 py-14">

        {/* =========================
            HEADER
        ========================== */}

        <div
          className="mx-auto max-w-2xl rounded-2xl p-6 text-center"
          style={{
            backgroundColor:
              styles.header
                .backgroundColor,
          }}
        >

          {/* EYEBROW */}

          {data.content?.eyebrow && (
            <p
              className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{
                color:
                  styles.header
                    .eyebrowColor,
              }}
            >
              {
                data.content
                  .eyebrow
              }
            </p>
          )}

          {/* TITLE */}

          <h1
            className="font-serif text-3xl font-bold tracking-tight"
            style={{
              color:
                styles.header
                  .titleColor,
            }}
          >
            {title}
          </h1>

          {/* SUBTITLE */}

          {data.content?.subtitle && (
            <p
              className="mt-3 text-sm leading-6"
              style={{
                color:
                  styles.header
                    .subtitleColor,
              }}
            >
              {
                data.content
                  .subtitle
              }
            </p>
          )}

          {/* DESCRIPTION */}

          {data.content?.description && (
            <p
              className="mt-2 text-xs leading-5"
              style={{
                color:
                  styles.header
                    .descriptionColor,
              }}
            >
              {
                data.content
                  .description
              }
            </p>
          )}

        </div>

        {/* =========================
            FAQ LIST
        ========================== */}

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">

          {sortedItems.length > 0 ? (

            sortedItems.map(
              (item, index) => {

                const isOpen =
                  openIndex === index

                const itemBackground =
                  isOpen
                    ? styles.faq
                        .openBackgroundColor
                    : styles.faq
                        .itemBackgroundColor

                const questionColor =
                  isOpen
                    ? styles.faq
                        .openQuestionColor
                    : styles.faq
                        .questionColor

                const answerColor =
                  isOpen
                    ? styles.faq
                        .openAnswerColor
                    : styles.faq
                        .answerColor

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor:
                        itemBackground,

                      border:
                        `1px solid ${styles.faq.itemBorderColor}`,
                    }}
                  >

                    {/* QUESTION */}

                    <button
                      type="button"
                      onClick={() =>
                        setOpenIndex(
                          isOpen
                            ? -1
                            : index
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >

                      <span
                        className="text-sm font-medium"
                        style={{
                          color:
                            questionColor,
                        }}
                      >
                        {
                          item.question?.trim() ||
                          "Untitled question"
                        }
                      </span>

                      <Plus
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? "rotate-45"
                            : ""
                        }`}
                        style={{
                          color:
                            styles.faq
                              .iconColor,
                        }}
                      />

                    </button>

                    {/* ANSWER */}

                    {isOpen && (
                      <div className="px-5 pb-5">

                        <p
                          className="text-xs leading-5"
                          style={{
                            color:
                              answerColor,
                          }}
                        >
                          {
                            item.answer?.trim() ||
                            "Answer coming soon — fill this in on the left."
                          }
                        </p>

                      </div>
                    )}

                  </div>
                )
              }
            )

          ) : (

            <div
              className="rounded-xl px-6 py-10 text-center"
              style={{
                backgroundColor:
                  styles.faq
                    .itemBackgroundColor,

                border:
                  `1px dashed ${styles.faq.itemBorderColor}`,
              }}
            >
              <p
                className="text-sm"
                style={{
                  color:
                    styles.faq
                      .answerColor,
                }}
              >
                No FAQ questions
                added yet.
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
              color:
                styles.faq
                  .answerColor,
            }}
          >
            {
              sortedItems.length
            }{" "}
            frequently asked
            questions
          </p>
        )}

      </div>
    </div>
  )
}