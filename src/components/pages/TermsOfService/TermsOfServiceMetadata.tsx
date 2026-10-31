import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TermsOfServiceMetadataProps {
  effectiveDate: string
  setEffectiveDate: (val: string) => void
  lastUpdated: string
  setLastUpdated: (val: string) => void
}

export function TermsOfServiceMetadata({
  effectiveDate,
  setEffectiveDate,
  lastUpdated,
  setLastUpdated,
}: TermsOfServiceMetadataProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Effective Date
        </Label>
        <Input
          value={effectiveDate}
          onChange={(e) => setEffectiveDate(e.target.value)}
          placeholder="e.g. 01.08.2025"
          className="bg-background font-medium text-xs"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Last Updated
        </Label>
        <Input
          value={lastUpdated}
          onChange={(e) => setLastUpdated(e.target.value)}
          placeholder="e.g. 01.08.2025"
          className="bg-background font-medium text-xs"
        />
      </div>
    </div>
  )
}
