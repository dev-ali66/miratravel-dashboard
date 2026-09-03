import * as React from "react" 
 
import { cn } from "@/lib/utils" 
import { 
  DESIGN_HEIGHT, 
  DESIGN_WIDTH, 
  useViewportScale, 
} from "./useViewportScale" 
 
interface ScaledWorkspaceProps { 
  children: React.ReactNode 
  className?: string 
  designWidth?: number 
  designHeight?: number 
} 
 
export function ScaledWorkspace({ 
  children, 
  className, 
  designWidth = DESIGN_WIDTH, 
  designHeight = DESIGN_HEIGHT, 
}: ScaledWorkspaceProps) { 
  const scale = useViewportScale(designWidth, designHeight) 
 
  return ( 
    <div 
      className={cn( 
        "relative h-screen w-screen overflow-x-hidden overflow-y-auto bg-background", 
        className, 
      )} 
    > 
      <div 
        style={{ 
          width: designWidth, 
          height: designHeight, 
          transform: `scale(${scale})`, 
          transformOrigin: "top left", 
          willChange: "transform", 
        }} 
      > 
        {children} 
      </div> 
    </div> 
  ) 
}
