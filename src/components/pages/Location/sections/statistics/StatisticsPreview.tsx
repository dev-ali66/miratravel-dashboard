/* =====================================================
   STATISTICS — PREVIEW SECTION
   Auto-migrated from the legacy LocationPreview.tsx monolith.===================================================== */

import type { LocationData } from "../../locationTypes"
import { getLocationBasics } from "../../shared/previewBasics"
import { Compass, MapPin, Mountain, Users } from "lucide-react"
import { StatItem } from "../../shared/previewPrimitives"

export type StatisticsPreviewProps = {
    draft: LocationData | null
}

export function StatisticsPreview({
    draft,
}: StatisticsPreviewProps) {
    const { data } = getLocationBasics(draft)


    const statistics =
        data.statistics ?? {}

    const area =
        statistics.area ?? {}

    const elevation =
        statistics.elevation ?? {}

    const population: { value?: number; year?: number } =
        statistics.population ?? {}


    const highestPoint =
        data.geography?.highestPoint ?? {}

    return (
        <>

            <section className="border-y border-neutral-200 bg-white">

                <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">

                    <StatItem
                        icon={MapPin}
                        label="AREA"
                        value={
                            area.value != null
                                ? `${area.value} ${area.unit || ""}`
                                : "—"
                        }
                    />

                    <StatItem
                        icon={Mountain}
                        label="ELEVATION"
                        value={
                            elevation.value != null
                                ? `${elevation.value} m`
                                : "—"
                        }
                    />

                    <StatItem
                        icon={Compass}
                        label="HIGHEST POINT"
                        value={
                            highestPoint.name ||
                            "—"
                        }
                    />

                    <StatItem
                        icon={Users}
                        label={
                            population.year
                                ? `POPULATION ${population.year}`
                                : "POPULATION"
                        }
                        value={
                            population.value != null
                                ? population.value.toLocaleString()
                                : "—"
                        }
                    />

                </div>
            </section>

        </>
    )
}
