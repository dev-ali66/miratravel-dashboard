import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TermsOfServiceMetadataProps {
    effectiveDate: string;
    setEffectiveDate: (val: string) => void;
    lastUpdated: string;
    setLastUpdated: (val: string) => void;
}

export function TermsOfServiceMetadata({
    effectiveDate,
    setEffectiveDate,
    lastUpdated,
    setLastUpdated
}: TermsOfServiceMetadataProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-5 rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xl shadow-sm">
            <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Effective Date</Label>
                <Input 
                    value={effectiveDate} 
                    onChange={(e) => setEffectiveDate(e.target.value)} 
                    placeholder="e.g. 22.07.2026"
                    className="bg-background/50 font-medium"
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Updated</Label>
                <Input 
                    value={lastUpdated} 
                    onChange={(e) => setLastUpdated(e.target.value)} 
                    placeholder="e.g. 22.07.2026"
                    className="bg-background/50 font-medium"
                />
            </div>
        </div>
    );
}
