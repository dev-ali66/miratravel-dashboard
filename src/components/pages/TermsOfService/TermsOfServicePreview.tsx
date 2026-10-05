import React, { useState } from "react"
import type { TermsPart } from "./types"
import { FileText, Shield, CreditCard, RefreshCw, AlertTriangle, Award, Scale, Mail } from "lucide-react"

interface TermsOfServicePreviewProps {
  parts: TermsPart[]
  effectiveDate: string
  lastUpdated: string
}

function getSectionIcon(index: number) {
  const icons = [FileText, CreditCard, RefreshCw, Shield, AlertTriangle, Award, Scale, Mail]
  const IconComponent = icons[index % icons.length]
  return <IconComponent className="h-5 w-5 text-[#6E7F5B] shrink-0" />
}

export function TermsOfServicePreview({
  parts,
  lastUpdated,
}: TermsOfServicePreviewProps) {
  const [activeSectionId, setActiveSectionId] = useState<string>(parts[0]?.id || "")

  return (
    <div className="@container w-full min-h-full bg-[#FAF7F2] text-[#22211E]">
      {/* 1:1 Frontend Hero Banner */}
      <section className="relative w-full overflow-hidden bg-[#182D09] px-6 py-12 text-center text-[#FFF8F2] md:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFF8F2]/20 bg-[#FFF8F2]/10 px-3 py-1 text-[11px] font-medium tracking-widest text-[#E6E0D5] uppercase">
            MIRA ARCHIVE
          </div>
          
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#FFF8F2] md:text-4xl lg:text-5xl">
            Terms &amp; Conditions
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#E6E0D5] md:text-base">
            Please review the legal terms, booking requirements, and mutual commitments that govern
            our bespoke expeditions, private concierge services, and regional itineraries.
          </p>

          <div className="text-xs text-[#E6E0D5]/70 pt-2">
            Last updated: {lastUpdated || "August 1, 2025"}
          </div>
        </div>
      </section>

      {/* 1:1 Frontend Main Body Layout */}
      <div className="w-full bg-[#FAF7F2] p-4 sm:p-6 md:p-8 lg:p-10">
        {parts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white/60 py-16 text-center">
            <p className="text-sm font-medium text-neutral-500">
              No Terms &amp; Conditions sections available to preview.
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Add sections in the editor above to view live changes here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left Column: Quick Navigation Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-6 rounded-xl border border-[#E8E2D8] bg-white p-4 shadow-sm md:p-5">
                <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-[#182D09]">
                  Quick Navigation
                </h2>
                <nav className="flex flex-col gap-1.5">
                  {parts.map((part, idx) => {
                    const isActive = activeSectionId === part.id || (!activeSectionId && idx === 0)
                    return (
                      <button
                        key={part.id}
                        type="button"
                        onClick={() => {
                          setActiveSectionId(part.id)
                          const el = document.getElementById(`preview-section-${part.id}`)
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-[#182D09] text-[#FFF8F2] shadow-xs"
                            : "text-[#5C5549] hover:bg-[#F5F0E8] hover:text-[#182D09]"
                        }`}
                      >
                        {getSectionIcon(idx)}
                        <span className="truncate">{part.tabTitle || `Part ${idx + 1}`}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Right Column: Dynamic Terms Content Card */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="rounded-xl border border-[#E8E2D8] bg-white p-6 shadow-sm md:p-8 lg:p-10">
                {parts.map((part, idx) => {
                  return (
                    <React.Fragment key={part.id}>
                      <section
                        id={`preview-section-${part.id}`}
                        className="scroll-mt-6 transition-all"
                      >
                        <div className="mb-4 flex items-center gap-3">
                          {getSectionIcon(idx)}
                          <h2 className="font-serif text-xl font-semibold text-[#182D09] md:text-2xl">
                            {part.fullTitle}
                          </h2>
                        </div>

                        <div
                          className="prose prose-neutral max-w-none text-sm leading-relaxed text-[#4A4337] md:text-[15px] [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-[#182D09] [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-[#E8E2D8] [&_th]:bg-[#F7F4EE] [&_th]:p-2.5 [&_th]:text-left [&_th]:text-xs [&_td]:border [&_td]:border-[#E8E2D8] [&_td]:p-2.5 [&_td]:text-xs"
                          dangerouslySetInnerHTML={{
                            __html: part.content || "<p class='italic text-neutral-400'>[Section content empty]</p>",
                          }}
                        />
                      </section>

                      {idx < parts.length - 1 && (
                        <hr className="my-8 border-t border-[#E8E2D8]/80" />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
