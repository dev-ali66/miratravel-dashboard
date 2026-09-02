export function PrivacyPolicySkeleton() {
    return (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pt-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="h-9 w-48 bg-muted rounded-md animate-pulse mb-2" />
                    <div className="h-5 w-64 bg-muted rounded-md animate-pulse" />
                </div>
                <div className="h-10 w-32 bg-muted rounded-xl animate-pulse" />
            </div>
            <div className="h-24 w-full bg-muted/50 rounded-2xl animate-pulse" />
            <div className="h-24 w-full bg-muted/50 rounded-2xl animate-pulse" />
            <div className="rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xl p-6">
                <div className="h-100 w-full bg-muted/50 rounded-xl animate-pulse" />
            </div>
        </div>
    );
}
