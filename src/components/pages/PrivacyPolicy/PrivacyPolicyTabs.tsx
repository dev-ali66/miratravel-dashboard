import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { PolicyPart } from "./types"

interface PrivacyPolicyTabsProps {
    parts: PolicyPart[];
    activeTab: string;
    setActiveTab: (id: string) => void;
}

export function PrivacyPolicyTabs({ parts, activeTab, setActiveTab }: PrivacyPolicyTabsProps) {
    return (
        <div className="mb-6 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <Label className="text-xs font-bold text-foreground uppercase tracking-wider">Document Structure</Label>
                <span className="text-xs text-muted-foreground italic">Click a document tab to view and edit that specific section</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-muted/20 p-2 rounded-2xl border border-border/40">
                {parts.map((part) => {
                    const isActive = activeTab === part.id;
                    return (
                        <button
                            key={part.id}
                            type="button"
                            onClick={() => setActiveTab(part.id)}
                            className={cn(
                                "flex flex-col text-left p-3.5 rounded-xl transition-all relative overflow-hidden group cursor-pointer",
                                isActive 
                                    ? "bg-background text-foreground shadow-sm ring-1 ring-border font-medium" 
                                    : "hover:bg-background/50 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider mb-1 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                            )}>
                                {part.tabTitle}
                            </span>
                            <span className="text-xs line-clamp-2 leading-snug font-medium">
                                {part.fullTitle.replace(/^Part \d+ — /, "")}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
