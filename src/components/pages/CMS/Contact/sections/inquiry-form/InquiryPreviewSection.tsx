import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { Calendar } from "lucide-react"
import { emptyInquiryForm } from "./emptyInquiryForm"

const JOURNEY_TYPES = [
  "CULTURAL",
  "ADVENTURE",
  "COASTAL",
  "RELAXED",
  "PRIVATE",
  "SLOW TRAVEL",
  "FOOD & WINE",
]

export function InquiryPreviewSection({ section }: { section?: any }) {
  const inquiry = section || emptyInquiryForm
  const multimedia = inquiry.rightSideMultimedia || emptyInquiryForm.rightSideMultimedia
  const backgroundMultimedia =
    inquiry.backgroundMultimedia || emptyInquiryForm.backgroundMultimedia

  return (
    <div
      data-section="inquiry-form"
      className="relative w-full overflow-hidden bg-[#FAF6F0] py-12 md:py-16 px-4 md:px-12"
    >
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        mode="background"
      />
      <div className="relative z-10 mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
        {/* Left Column: Form Mockup */}
        <div className="lg:col-span-7 flex flex-col justify-start gap-5">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[2px] text-[#E5A84B] font-semibold">
              <DynamicStyledTextPreview as="span" data={inquiry.eyebrow} />
            </span>
            <h2 className="font-serif text-3xl md:text-[38px] leading-tight font-normal text-neutral-900">
              <DynamicStyledTextPreview as="span" data={inquiry.title} />
            </h2>
          </div>

          {/* Input Fields Grid */}
          <div className="flex flex-col gap-3.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="h-11 rounded border border-neutral-200/80 bg-white/70 px-3.5 flex items-center text-xs text-neutral-400">
                Full Name *
              </div>
              <div className="h-11 rounded border border-neutral-200/80 bg-white/70 px-3.5 flex items-center text-xs text-neutral-400">
                Email Address *
              </div>
            </div>

            <div className="h-11 rounded border border-neutral-200/80 bg-white/70 px-3.5 flex items-center text-xs text-neutral-400">
              Phone Number (optional)
            </div>

            <div className="h-11 rounded border border-neutral-200/80 bg-white/70 px-3.5 flex items-center text-xs text-neutral-400">
              Destination
            </div>

            <div className="h-11 rounded border border-neutral-200/80 bg-white/70 px-3.5 flex items-center justify-between text-xs text-neutral-400">
              <span>Approximate Travel Date</span>
              <Calendar className="h-4 w-4 text-neutral-400" />
            </div>

            <div className="h-11 rounded border border-neutral-200/80 bg-white/70 px-3.5 flex items-center text-xs text-neutral-400">
              Number of Travelers
            </div>

            {/* Journey Types Selector */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="text-[10px] md:text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">
                WHAT KIND OF JOURNEY ARE YOU LOOKING FOR?
              </span>
              <div className="flex flex-wrap gap-2">
                {JOURNEY_TYPES.map((type) => {
                  const isActive = type === "SLOW TRAVEL"
                  return (
                    <span
                      key={type}
                      className={
                        isActive
                          ? "rounded-full bg-[#182D09] border border-[#182D09] px-3.5 py-1 text-[10px] md:text-[11px] font-semibold text-white tracking-wider uppercase shadow-2xs"
                          : "rounded-full bg-white/80 border border-neutral-200/90 px-3.5 py-1 text-[10px] md:text-[11px] font-medium text-neutral-600 tracking-wider uppercase"
                      }
                    >
                      {type}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Vision Textarea */}
            <div className="min-h-[100px] rounded border border-neutral-200/80 bg-white/70 p-3.5 text-xs text-neutral-400">
              Describe your vision for this journey...
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <div className="h-11 px-8 rounded-none bg-[#182D09] text-white font-semibold text-xs tracking-[2px] uppercase inline-flex items-center justify-center cursor-default">
                SEND INQUIRY
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Multimedia */}
        <div className="lg:col-span-5 relative flex flex-col min-h-[460px] h-full w-full rounded-md overflow-hidden shadow-sm bg-neutral-200">
          <UniversalMultimediaPreview
            multimedia={multimedia}
            className="h-full w-full object-cover"
            containerClassName="h-full w-full flex-1 flex flex-col"
          />
        </div>
      </div>
    </div>
  )
}

export default InquiryPreviewSection

