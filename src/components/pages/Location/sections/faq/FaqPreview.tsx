/* =====================================================
   FAQ — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData, FAQItem } from "../../locationTypes"
import { getLocationBasics, FALLBACK_IMAGE } from "../../shared/previewBasics"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

export type FaqPreviewProps = {
    draft: LocationData | null
}

export function FaqPreview({
    draft,
}: FaqPreviewProps) {
    const { data } = getLocationBasics(draft)

    const faqSection = data.faq_section ?? {}
    const faq = Array.isArray(faqSection.questions) ? faqSection.questions : []

    const [openFaq, setOpenFaq] = useState<number | null>(0)

    useEffect(() => {
        if (faq.length === 0) {
            setOpenFaq(null)
            return
        }

        if (openFaq === null || openFaq >= faq.length) {
            setOpenFaq(0)
        }
    }, [faq.length, openFaq])

    return (
        <>

            {faq.length > 0 && (
                <section className="bg-[#171717] text-white">

                    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">

                        <div className="grid grid-cols-1 gap-12 md:grid-cols-[0.7fr_1.3fr]">

                            <div>

                                {faqSection.image && (
                                    <div className="mb-8 overflow-hidden rounded-2xl">

                                        <img
                                            src={
                                                faqSection.image
                                            }
                                            alt={
                                                faqSection.title ||
                                                "FAQ"
                                            }
                                            className="h-[250px] w-full object-cover md:h-[300px]"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    FALLBACK_IMAGE
                                            }}
                                        />

                                    </div>
                                )}

                                <p className="text-[10px] tracking-[0.25em] text-white/35">
                                    FREQUENTLY ASKED QUESTIONS
                                </p>

                                <h2 className="mt-5 text-4xl font-light md:text-6xl">
                                    Questions,
                                    <br />
                                    answered.
                                </h2>

                            </div>

                            <div>

                                {faq.map(
                                    (
                                        item: FAQItem,
                                        index: number
                                    ) => {

                                        const isOpen =
                                            openFaq ===
                                            index

                                        return (
                                            <div
                                                key={
                                                    item.id ??
                                                    item.question ??
                                                    index
                                                }
                                                className="border-t border-white/10"
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenFaq(
                                                            isOpen
                                                                ? null
                                                                : index
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-between gap-5 py-6 text-left"
                                                >

                                                    <span className="text-lg font-light">
                                                        {
                                                            item.question
                                                        }
                                                    </span>

                                                    <ChevronDown
                                                        className={`h-5 w-5 shrink-0 text-white/40 transition-transform ${
                                                            isOpen
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />

                                                </button>

                                                {isOpen && (
                                                    <p className="max-w-2xl pb-6 text-sm leading-7 text-white/45">
                                                        {
                                                            item.answer
                                                        }
                                                    </p>
                                                )}

                                            </div>
                                        )
                                    }
                                )}

                            </div>

                        </div>

                    </div>
                </section>
            )}

        </>
    )
}
