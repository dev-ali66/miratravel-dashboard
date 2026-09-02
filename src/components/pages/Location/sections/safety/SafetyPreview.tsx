/* =====================================================
   SAFETY — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"
import { ShieldCheck } from "lucide-react"

export type SafetyPreviewProps = {
    draft: LocationData | null
}

export function SafetyPreview({
    draft,
}: SafetyPreviewProps) {
    const { data } = getLocationBasics(draft)


    const safety =
        data.safety ?? {}


    return (
        <>

            <section className="bg-[#deddd5]">

                <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 px-6 py-12 md:flex-row md:items-center md:px-10 md:py-16">

                    <div className="flex items-start gap-5">

                        <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-neutral-500" />

                        <div>

                            <p className="text-[10px] tracking-[0.2em] text-neutral-400">
                                TRAVEL SAFETY
                            </p>

                            <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">
                                {
                                    safety.description ||
                                    "Follow local safety guidance while travelling."
                                }
                            </p>

                        </div>

                    </div>

                    {safety.emergencyNumber && (
                        <div className="shrink-0">

                            <p className="text-[9px] tracking-[0.2em] text-neutral-400">
                                EMERGENCY
                            </p>

                            <p className="mt-1 text-2xl font-light">
                                {
                                    safety.emergencyNumber
                                }
                            </p>

                        </div>
                    )}

                </div>
            </section>

        </>
    )
}
