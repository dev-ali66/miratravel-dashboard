/* =====================================================
   JOURNEYS — ROUTE & STOPS FORM SECTION
===================================================== */

import { Plus, Trash2 } from "lucide-react"
import { FormSection, JourneyInputField } from "../../shared/fields"
import type { Journey } from "../../journeyTypes"

export type RouteStopsFormProps = {
  draft: Journey
  updateField: (path: string, value: unknown) => void
  openSections: Record<string, boolean>
  toggleSection: (section: string) => void
}

export function RouteStopsForm({
  draft,
  updateField,
  openSections,
  toggleSection,
}: RouteStopsFormProps) {
  const routeData = draft.data?.route || {
    mapOverviewImage: "",
    stops: [],
  }

  const stops = routeData.stops || []

  const handleAddStop = () => {
    const next = [
      ...stops,
      {
        order: stops.length + 1,
        destination: "",
        nights: 1,
        coordinates: { lat: 42.0, lng: 19.5 },
        highlights: "",
        summary: "",
      },
    ]
    updateField("data.route.stops", next)
  }

  const handleUpdateStop = (index: number, field: string, val: any) => {
    const next = [...stops]
    next[index] = { ...next[index], [field]: val }
    updateField("data.route.stops", next)
  }

  const handleRemoveStop = (index: number) => {
    const next = stops
      .filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, order: i + 1 }))
    updateField("data.route.stops", next)
  }

  return (
    <FormSection
      title="Route & Key Stops"
      active={!!openSections["route"]}
      onClick={() => toggleSection("route")}
      badge={stops.length}
    >
      <div className="space-y-4">
        <JourneyInputField
          label="Route Map Visual / Image (Optional)"
          value={routeData.mapOverviewImage ?? ""}
          onChange={(val) => updateField("data.route.mapOverviewImage", val)}
          placeholder="https://res.cloudinary.com/.../route-map.jpg"
          description="Map diagram or geographic path illustration."
        />

        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              Waypoints & Stops ({stops.length})
            </label>
            <button
              type="button"
              onClick={handleAddStop}
              className="flex items-center gap-1 rounded bg-secondary px-2 py-1 text-[11px] font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              <Plus className="h-3 w-3" /> Add Stop
            </button>
          </div>

          <div className="space-y-3">
            {stops.map((stop, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-border/70 bg-background p-3 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {stop.destination || `Stop #${idx + 1}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveStop(idx)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <JourneyInputField
                    label="Destination Name"
                    value={stop.destination ?? ""}
                    onChange={(val) => handleUpdateStop(idx, "destination", val)}
                    placeholder="e.g. Theth Valley"
                  />
                  <JourneyInputField
                    label="Nights"
                    type="number"
                    value={stop.nights ?? 1}
                    onChange={(val) => handleUpdateStop(idx, "nights", val)}
                    min={0}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <JourneyInputField
                    label="Latitude"
                    type="number"
                    value={stop.coordinates?.lat ?? 42.0}
                    onChange={(val) =>
                      handleUpdateStop(idx, "coordinates", {
                        ...stop.coordinates,
                        lat: val,
                      })
                    }
                    step={0.0001}
                  />
                  <JourneyInputField
                    label="Longitude"
                    type="number"
                    value={stop.coordinates?.lng ?? 19.5}
                    onChange={(val) =>
                      handleUpdateStop(idx, "coordinates", {
                        ...stop.coordinates,
                        lng: val,
                      })
                    }
                    step={0.0001}
                  />
                </div>

                <JourneyInputField
                  label="Short Summary"
                  value={stop.summary ?? ""}
                  onChange={(val) => handleUpdateStop(idx, "summary", val)}
                  placeholder="Alpine meadows, stone tower kulla and Grunas canyon"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  )
}
