/* =====================================================
   JOURNEYS — INCLUSIONS TAB PREVIEW
   Matches frontend/components/journey-overview/WhatsIncludedContent.tsx
===================================================== */

import { CheckCircle2, XCircle, Info } from "lucide-react"
import type { Journey } from "../journeyTypes"

export function WhatsIncludedPreview({ draft }: { draft: Journey }) {
  const included = draft.included || []
  const notIncluded = draft.notIncluded || []
  const importantInfo = draft.data?.whatsIncluded?.importantInfo || []

  return (
    <div className="py-12 space-y-12 text-[#235347]">
      {/* Header */}
      <div className="border-b border-[#EDE7D8] pb-6">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#121816]">
          What's Included & Clear Transparency
        </h2>
        <p className="mt-2 text-sm text-[#121816]/70">
          Everything you need for an effortless, privately guided journey.
        </p>
      </div>

      {/* Grid of Included / Not Included */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Included Card */}
        <div className="rounded-2xl border border-[#235347]/20 bg-white p-6 md:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-6 text-[#235347]">
            <CheckCircle2 className="h-6 w-6 text-[#235347]" />
            <h3 className="font-serif text-xl font-normal text-[#121816]">
              What Is Included
            </h3>
          </div>

          <div className="space-y-3.5">
            {included.length > 0 ? (
              included.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#235347]/10 text-[#235347] mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs md:text-sm text-[#121816]/85 leading-relaxed">
                    {item}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No items listed yet.</p>
            )}
          </div>
        </div>

        {/* Not Included Card */}
        <div className="rounded-2xl border border-[#EDE7D8] bg-[#EDE7D8]/20 p-6 md:p-8">
          <div className="flex items-center gap-2.5 mb-6 text-[#af6348]">
            <XCircle className="h-6 w-6 text-[#af6348]" />
            <h3 className="font-serif text-xl font-normal text-[#121816]">
              What Is Not Included
            </h3>
          </div>

          <div className="space-y-3.5">
            {notIncluded.length > 0 ? (
              notIncluded.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#af6348]/10 text-[#af6348] mt-0.5">
                    <XCircle className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs md:text-sm text-[#121816]/75 leading-relaxed">
                    {item}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No items listed yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Important Information */}
      {importantInfo.length > 0 && (
        <div className="rounded-2xl border border-[#EDE7D8] bg-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2 text-[#235347]">
            <Info className="h-5 w-5 text-[#af6348]" />
            <h4 className="font-serif text-lg font-normal text-[#121816]">
              Important Trip Information
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {importantInfo.map((info, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#EDE7D8]/30 p-3.5 text-xs text-[#121816]/80 leading-relaxed"
              >
                • {info}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
