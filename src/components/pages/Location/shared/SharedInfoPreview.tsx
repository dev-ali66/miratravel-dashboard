/* =====================================================
   SHARED INFO — PREVIEW COMPONENT
   Reusable preview matching frontend `Info` layout.
===================================================== */

import type { LocationData } from "../locationTypes"
import { getLocationBasics } from "./previewBasics"
import { cn } from "@/lib/utils"
import { UniversalMultimediaPreview } from "../../CMS/Home/shared/preview/UniversalMultimediaPreview"
import { fieldCssStyle } from "../../CMS/shared/fieldStyle"

export type SharedInfoPreviewProps = {
  draft: LocationData | null
  id?: string
}

export function SharedInfoPreview({
  draft,
  id = "destination-info",
}: SharedInfoPreviewProps) {
  const { data } = getLocationBasics(draft)
  const sharedInfo = data?.sharedInfo
  const text = sharedInfo?.text || "Add shared info details here."
  const style = sharedInfo?.style
  const background = (sharedInfo as any)?.backgroundMultimedia

  if (!text) return null

  return (
    <section
      id={id}
      className="relative w-full overflow-hidden py-10"
      style={{ backgroundColor: style?.backgroundColor || undefined }}
    >
      <UniversalMultimediaPreview
        multimedia={background}
        fallbackColor={style?.backgroundColor || "#F7F6F2"}
        mode="background"
        className="h-full w-full object-cover"
        containerClassName="absolute inset-0 z-0 pointer-events-none"
      />
      <div className="relative z-10 container mx-auto px-6">
        <div className="flex w-full justify-center">
          <p
            className={cn(
              "font-roboto-serif w-full max-w-331.5 text-center text-[22px] leading-9 font-medium tracking-[1px] sm:text-[26px] sm:leading-10.5 sm:tracking-[1.5px] md:text-[30px] md:leading-11.5 lg:text-[36px] lg:leading-13 lg:tracking-[2px]",
              !style?.textColor &&
                !sharedInfo?.textStyle?.textColor &&
                "text-gradient-2"
            )}
            style={{
              color: style?.textColor || undefined,
              ...fieldCssStyle(sharedInfo?.textStyle ?? undefined),
            }}
          >
            {text}
          </p>
        </div>
      </div>
    </section>
  )
}

export default SharedInfoPreview
