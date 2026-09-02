import { RichTextEditor } from "@/components/shared/RichTextEditor"
import type { PolicyPart } from "./types"

interface PrivacyPolicyEditorProps {
    currentPart: PolicyPart;
    activeTab: string;
    onContentChange: (newContent: string) => void;
}

export function PrivacyPolicyEditor({
    currentPart,
    activeTab,
    onContentChange
}: PrivacyPolicyEditorProps) {
    return (
        <div className="rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xl overflow-hidden p-6 shadow-sm space-y-4">
            <div className="border-b border-border/40 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                    <h2 className="text-lg font-bold text-foreground">{currentPart.fullTitle}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Edit the rich text content for {currentPart.tabTitle.toLowerCase()} below.</p>
                </div>
                <div className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full self-start sm:self-center">
                    Active Tab: {currentPart.tabTitle}
                </div>
            </div>
            
            <RichTextEditor 
                key={activeTab}
                value={currentPart.content} 
                onChange={onContentChange} 
                className="min-h-100"
                canvasClassName="max-h-[65vh]"
            />
        </div>
    );
}
