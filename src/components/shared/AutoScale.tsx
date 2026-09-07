import * as React from "react"
import { cn } from "@/lib/utils"

interface ScaledWorkspaceProps {
  children: React.ReactNode
  className?: string
  designWidth?: number
  designHeight?: number
}

/**
 * ScaledWorkspace container that cleanly fits the parent preview container
 * without forcing fixed screen dimensions or top-left offset margins.
 */
export function ScaledWorkspace({
  children,
  className,
}: ScaledWorkspaceProps) {
  return (
    <div
      className={cn(
        "relative w-full min-h-full bg-background",
        className
      )}
    >
      <div className="w-full min-h-full">
        {children}
      </div>
    </div>
  )
}
