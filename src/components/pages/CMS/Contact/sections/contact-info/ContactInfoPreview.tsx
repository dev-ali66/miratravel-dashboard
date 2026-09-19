import { Mail, MessageSquare, Clock } from "lucide-react"
import { DynamicStyledTextPreview } from "@/components/pages/CMS/shared/DynamicStyledTextPreview"
import { UniversalMultimediaPreview } from "@/components/pages/CMS/shared/UniversalMultimediaPreview"
import { emptyContactInfo } from "./emptyContactInfo"

function DefaultContactIcon({ item, index }: { item: any; index: number }) {
  const labelText = (typeof item?.label === "object" ? item?.label?.value : item?.label) || ""
  const upperLabel = String(labelText).toUpperCase()

  if (upperLabel.includes("WHATSAPP") || index === 1) {
    return <MessageSquare className="h-5 w-5 md:h-6 md:w-6 text-[#6B7280]" />
  }
  if (upperLabel.includes("RESPONSE") || upperLabel.includes("TIME") || index === 2) {
    return <Clock className="h-5 w-5 md:h-6 md:w-6 text-[#6B7280]" />
  }
  return <Mail className="h-5 w-5 md:h-6 md:w-6 text-[#6B7280]" />
}

export function ContactInfoPreview({ section }: { section?: any }) {
  const contactInfo = section || emptyContactInfo
  const items = Array.isArray(contactInfo.items) ? contactInfo.items : emptyContactInfo.items
  const backgroundMultimedia =
    contactInfo.backgroundMultimedia || emptyContactInfo.backgroundMultimedia

  return (
    <section
      data-section="contact-info"
      className="relative w-full bg-[#FAF7F2] min-h-[220px] md:h-[260px] flex items-center justify-center py-10 md:py-0 overflow-hidden"
    >
      <UniversalMultimediaPreview
        multimedia={backgroundMultimedia}
        mode="background"
      />

      <div className="relative z-10 w-full container mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 w-full max-w-[1130px] mx-auto items-stretch">
          {items.map((item: any, idx: number) => {
            const itemMedia = item.multimedia || item.iconMultimedia
            const hasMediaUrl = Boolean(itemMedia?.image?.url || itemMedia?.video?.url || itemMedia?.url)

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center w-full text-center py-4 ${
                  idx === 0
                    ? "md:pr-8 md:border-r md:border-[#E5A84B]/60"
                    : idx === 1
                    ? "md:px-8 md:border-r md:border-[#E5A84B]/60"
                    : "md:pl-8"
                }`}
              >
                {/* Icon */}
                <div className="flex items-center justify-center mb-3 text-[#6B7280]">
                  {hasMediaUrl ? (
                    <div className="h-6 w-6 relative overflow-hidden flex items-center justify-center">
                      <UniversalMultimediaPreview
                        multimedia={itemMedia}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    <DefaultContactIcon item={item} index={idx} />
                  )}
                </div>

                {/* Label */}
                <h3 className="text-xs md:text-[13px] xl:text-sm font-medium uppercase tracking-[1.2px] xl:tracking-[1.5px] leading-tight text-[#6B7280] mb-2">
                  <DynamicStyledTextPreview as="span" data={item.label} />
                </h3>

                {/* Subtitle */}
                <p className="text-sm md:text-[15px] xl:text-base font-normal leading-[22px] md:leading-[24px] tracking-[0.3px] text-[#182D09]">
                  <DynamicStyledTextPreview as="span" data={item.subtitle} />
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ContactInfoPreview



