/* =====================================================
   SHARED INFO — PREVIEW COMPONENT
   Reusable preview matching frontend `Info` layout.
===================================================== */

import type { LocationData } from "../locationTypes"
import { getLocationBasics, FALLBACK_TEXT } from "./previewBasics"

export type SharedInfoPreviewProps = {
  draft: LocationData | null
  id?: string
}

export function SharedInfoPreview({ draft, id = 'destination-info' }: SharedInfoPreviewProps) {
  const { data } = getLocationBasics(draft)
  const text = data?.sharedInfo?.text ?? data?.description ?? FALLBACK_TEXT

  if (!text) return null

  return (
    <section id={id} className="w-full">
      <div className="container mx-auto px-6">
        <div className="flex w-full justify-center">
          <p className="w-full max-w-[1326px] text-center text-gradient-2 font-roboto-serif text-[22px] leading-[36px] sm:text-[26px] sm:leading-[42px] md:text-[30px] md:leading-[46px] lg:text-[36px] lg:leading-[52px] font-medium tracking-[1px] sm:tracking-[1.5px] lg:tracking-[2px]">
            {text}
          </p>
        </div>
      </div>
    </section>
  )
}

export default SharedInfoPreview
