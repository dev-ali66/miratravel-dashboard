import { Save, Loader2 } from "lucide-react"

interface PrivacyPolicyHeaderProps {
    onSave: () => void;
    isSaving: boolean;
}

export function PrivacyPolicyHeader({ onSave, isSaving }: PrivacyPolicyHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">GETSURF PRIVACY POLICY</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Manage document dates and navigate sections using the document tabs below.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={onSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-primary/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
