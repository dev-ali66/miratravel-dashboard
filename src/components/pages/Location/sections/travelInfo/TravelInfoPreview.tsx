/* =====================================================
   TRAVELINFO — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"
import { Clock3, Compass, Globe2, Wallet } from "lucide-react"
import { InfoItem } from "../../shared/previewPrimitives"

export type TravelInfoPreviewProps = {
    draft: LocationData | null
}

export function TravelInfoPreview({
    draft,
}: TravelInfoPreviewProps) {
    const { data } = getLocationBasics(draft)


    const travelInfo =
        data.travelInfo ?? {}

    const visa =
        travelInfo.visa ?? {}

    const currency =
        travelInfo.currency ?? {}

    const bestTime =
        travelInfo.bestTimeToVisit ?? {}

    const transportation =
        Array.isArray(
            travelInfo.popularTransportation
        )
            ? travelInfo.popularTransportation
            : []

    const bestTimeSummary = [bestTime.summer, bestTime.winter]
        .filter(Boolean)
        .join(" • ")

    return (
        <>

            <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">

                <div className="mb-12">

                    <p className="text-[10px] tracking-[0.25em] text-neutral-400">
                        TRAVEL INFORMATION
                    </p>

                    <h2 className="mt-4 text-4xl font-light md:text-6xl">
                        Before you go
                    </h2>

                </div>

                <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-neutral-200 md:grid-cols-2">

                    <InfoItem
                        icon={Clock3}
                        label="BEST TIME TO VISIT"
                        value={bestTime.general || "—"}
                        description={bestTimeSummary || undefined}
                    />

                    <InfoItem
                        icon={Wallet}
                        label="CURRENCY"
                        value={currency.majorCurrency || "—"}
                        description={currency.description}
                    />

                    <InfoItem
                        icon={Compass}
                        label="TRANSPORTATION"
                        value={
                            transportation.length
                                ? transportation.join(" · ")
                                : "—"
                        }
                    />

                    <InfoItem
                        icon={Globe2}
                        label="VISA & ENTRY"
                        value="Entry requirements"
                        description={visa.description}
                    />

                </div>
            </section>

        </>
    )
}
