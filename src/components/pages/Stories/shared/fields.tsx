import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormSection({
  title,
  sectionNumber,
  active,
  onClick,
  children,
}: {
  title: string;
  sectionNumber?: string | number;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const rawTitle = title.replace(/^\d+[a-z]?\.\s*/i, "");
  const displayTitle = sectionNumber ? `${sectionNumber}. ${rawTitle}` : title;

  return (
    <div
      className={cn(
        "border-b border-border/60 bg-card transition-colors",
        !active && "overflow-hidden"
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-muted/40 cursor-pointer"
      >
        <span className="text-sm font-semibold text-foreground">{displayTitle}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            active && "rotate-180"
          )}
        />
      </button>
      {active && (
        <div className="animate-in slide-in-from-top-2 fade-in-50">
          {children}
        </div>
      )}
    </div>
  );
}
