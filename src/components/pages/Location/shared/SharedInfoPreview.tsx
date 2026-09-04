/* =====================================================
   SHARED INFO — PREVIEW COMPONENT
   Reusable preview matching frontend `Info` layout.
===================================================== */

import type { LocationData } from "../locationTypes"
import { getLocationBasics } from "./previewBasics"
import { cn } from "@/lib/utils"

export type SharedInfoPreviewProps = {
  draft: LocationData | null
  id?: string
}

export function SharedInfoPreview({ draft, id = "destination-info" }: SharedInfoPreviewProps) {
  const { data } = getLocationBasics(draft)
  const text = data?.sharedInfo?.text || "Add shared info details here."
  const style = data?.sharedInfo?.style

  if (!text) return null

  return (
    <section
      id={id}
      className="w-full py-10"
      style={{ backgroundColor: style?.backgroundColor || undefined }}
    >
      <div className="container mx-auto px-6">
        <div className="flex w-full justify-center">
          <p
            className={cn(
              "w-full max-w-331.5 text-center font-roboto-serif text-[22px] leading-9 sm:text-[26px] sm:leading-10.5 md:text-[30px] md:leading-11.5 lg:text-[36px] lg:leading-13 font-medium tracking-[1px] sm:tracking-[1.5px] lg:tracking-[2px]",
              !style?.textColor && "text-gradient-2"
            )}
            style={{ color: style?.textColor || undefined }}
          >
            {text}
          </p>
        </div>
      </div>
    </section>
  )
}

export default SharedInfoPreview
