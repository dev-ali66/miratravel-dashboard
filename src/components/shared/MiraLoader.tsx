import { cn } from "@/lib/utils";

interface MiraLoaderProps {
  size?: "xs" | "sm" | "md" | "lg" | "fullScreen";
  text?: string;
  className?: string;
  showBg?: boolean;
}

const EXACT_VIDEO_PATH = "/videos/loading-animation.mp4";

export default function MiraLoader({
  size = "md",
  text,
  className,
  showBg = true,
}: MiraLoaderProps) {
  if (size === "fullScreen") {
    return (
      <div
        role="status"
        aria-label="Loading page"
        aria-live="polite"
        className={cn(
          "fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#F2E9E3] select-none transition-opacity duration-300 ease-out",
          className
        )}
      >
        <div className="relative flex items-center justify-center w-full max-w-xs sm:max-w-md md:max-w-xl aspect-video">
          <video
            src={EXACT_VIDEO_PATH}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
        {text && (
          <p className="mt-4 text-xs tracking-widest uppercase font-mono text-[#8C7A6B] animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (size === "xs") {
    return (
      <span className={cn("inline-flex items-center justify-center size-4 overflow-hidden rounded-full bg-[#F2E9E3]", className)}>
        <video
          src={EXACT_VIDEO_PATH}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover pointer-events-none scale-125"
        />
      </span>
    );
  }

  if (size === "sm") {
    return (
      <span className={cn("inline-flex items-center justify-center size-7 overflow-hidden rounded-full bg-[#F2E9E3] shadow-xs border border-[#E8DCD5]", className)}>
        <video
          src={EXACT_VIDEO_PATH}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover pointer-events-none scale-125"
        />
      </span>
    );
  }

  // "md" or "lg" sizes for sections, cards, page areas, table loading fallbacks
  const containerSizeClasses = {
    md: "w-36 max-w-full aspect-video",
    lg: "w-64 max-w-full aspect-video",
  }[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-6 text-center select-none",
        showBg && "bg-[#F2E9E3]/60 backdrop-blur-xs rounded-xl border border-[#E8DCD5]/60",
        className
      )}
    >
      <div className={cn("relative flex items-center justify-center overflow-hidden rounded-lg", containerSizeClasses)}>
        <video
          src={EXACT_VIDEO_PATH}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
      {text && (
        <p className="mt-3 text-xs tracking-widest uppercase font-mono text-[#8C7A6B] animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
