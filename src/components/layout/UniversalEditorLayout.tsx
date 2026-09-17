import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  ZoomIn,
  RotateCw,
  Laptop,
  GripVertical,
  Edit3,
  Eye,
  PanelLeftClose,
  PanelLeftOpen,
  Code2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ScaledWorkspace } from "@/components/shared/AutoScale"
import { useSyncScroll } from "@/hooks/useSyncScroll"
import { useDevMode } from "@/context/DevModeContext"

export interface DevicePreset {
  id: string
  name: string
  shortLabel: string
  category: "responsive" | "mobile" | "tablet" | "laptop" | "desktop" | "custom"
  width: number | "100%"
  height?: number
  frameType?: "phone" | "tablet" | "screen" | "none"
}

export const DEVICE_PRESETS: DevicePreset[] = [
  // 1. Fluid (Responsive)
  {
    id: "responsive",
    name: "Responsive (100% Fluid)",
    shortLabel: "Fluid",
    category: "responsive",
    width: "100%",
    frameType: "none",
  },

  // 2. Full HD (1920px)
  {
    id: "desktop-fhd-1080p",
    name: "Desktop Full HD 1080p (1920 × 1080)",
    shortLabel: "Full HD (1920px)",
    category: "desktop",
    width: 1920,
    height: 1080,
    frameType: "screen",
  },

  // 3. Desktop (Default 1440px)
  {
    id: "macbook-pro-14",
    name: "Desktop / MacBook Pro 14\" (1440 × 900) [Default]",
    shortLabel: "Desktop (1440px)",
    category: "desktop",
    width: 1440,
    height: 900,
    frameType: "screen",
  },

  // 4. Laptop (1280px)
  {
    id: "macbook-air-13",
    name: "Laptop / MacBook Air 13\" (1280 × 832)",
    shortLabel: "Laptop (1280px)",
    category: "laptop",
    width: 1280,
    height: 832,
    frameType: "screen",
  },
  {
    id: "desktop-standard",
    name: "Desktop Standard (1280 × 800)",
    shortLabel: "Desktop (1280px)",
    category: "laptop",
    width: 1280,
    height: 800,
    frameType: "screen",
  },

  // 5. Tablets
  {
    id: "ipad-pro-12-9",
    name: "Apple iPad Pro 12.9\" (1024 × 1366)",
    shortLabel: "iPad Pro 12.9\"",
    category: "tablet",
    width: 1024,
    height: 1366,
    frameType: "tablet",
  },
  {
    id: "ipad-air-10",
    name: "Apple iPad Air / 10th Gen (820 × 1180)",
    shortLabel: "iPad Air 10.9\"",
    category: "tablet",
    width: 820,
    height: 1180,
    frameType: "tablet",
  },
  {
    id: "ipad-mini",
    name: "Apple iPad Mini (768 × 1024)",
    shortLabel: "iPad Mini",
    category: "tablet",
    width: 768,
    height: 1024,
    frameType: "tablet",
  },
  {
    id: "samsung-tab-s9",
    name: "Samsung Galaxy Tab S9 (800 × 1280)",
    shortLabel: "Galaxy Tab S9",
    category: "tablet",
    width: 800,
    height: 1280,
    frameType: "tablet",
  },

  // 6. Mobile Phones (Apple, Samsung, Pixel)
  {
    id: "iphone-16-pro-max",
    name: "Apple iPhone 16 Pro Max (430 × 932)",
    shortLabel: "iPhone 16 Pro Max",
    category: "mobile",
    width: 430,
    height: 932,
    frameType: "phone",
  },
  {
    id: "iphone-15-pro",
    name: "Apple iPhone 15 / 14 Pro (393 × 852)",
    shortLabel: "iPhone 15 Pro",
    category: "mobile",
    width: 393,
    height: 852,
    frameType: "phone",
  },
  {
    id: "iphone-13-12",
    name: "Apple iPhone 13 / 12 (390 × 844)",
    shortLabel: "iPhone 13 / 12",
    category: "mobile",
    width: 390,
    height: 844,
    frameType: "phone",
  },
  {
    id: "iphone-se",
    name: "Apple iPhone SE / 8 (375 × 667)",
    shortLabel: "iPhone SE",
    category: "mobile",
    width: 375,
    height: 667,
    frameType: "phone",
  },
  {
    id: "samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra (412 × 915)",
    shortLabel: "Galaxy S24 Ultra",
    category: "mobile",
    width: 412,
    height: 915,
    frameType: "phone",
  },
  {
    id: "google-pixel-8-pro",
    name: "Google Pixel 8 Pro (412 × 892)",
    shortLabel: "Pixel 8 Pro",
    category: "mobile",
    width: 412,
    height: 892,
    frameType: "phone",
  },
]

export interface UniversalEditorLayoutProps {
  backToUrl: string
  backToLabel?: string
  icon?: React.ComponentType<{ className?: string }>
  iconColor?: string
  title: string
  headerActions?: React.ReactNode
  sidebarContent?: React.ReactNode
  previewContent?: React.ReactNode
  useWorkspaceScale?: boolean
  children?: React.ReactNode
}

export function UniversalEditorLayout({
  backToUrl,
  backToLabel,
  icon: Icon,
  iconColor = "text-primary",
  title,
  headerActions,
  sidebarContent,
  previewContent,
  useWorkspaceScale = false,
  children,
}: UniversalEditorLayoutProps) {
  const navigate = useNavigate()
  const { formRef, previewRef } = useSyncScroll()
  const { isDevMode, toggleDevMode } = useDevMode()

  // Viewport state (Default: 1440px Desktop / Laptop)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("macbook-pro-14")
  const [isFluid, setIsFluid] = useState<boolean>(false)
  const [customWidth, setCustomWidth] = useState<number>(1440)
  const [customHeight, setCustomHeight] = useState<number>(900)
  const [isLandscape, setIsLandscape] = useState<boolean>(false)
  const [zoomScale, setZoomScale] = useState<number>(100)

  // Get active device info
  const activeDevice = DEVICE_PRESETS.find((d) => d.id === selectedDeviceId)

  // Calculate actual render width & height
  const renderWidth = isFluid
    ? "100%"
    : isLandscape
      ? Math.max(customWidth, customHeight)
      : customWidth

  const renderHeight = isFluid
    ? "auto"
    : isLandscape
      ? Math.min(customWidth, customHeight)
      : customHeight

  // Mobile View Toggle & Sidebar Collapse state
  const [mobileViewMode, setMobileViewMode] = useState<"form" | "preview">("form")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const lastScrollRatioRef = useRef<number>(0)

  // Stage measurement for auto-scaling desktop preview on smaller/mobile screens
  const stageRef = useRef<HTMLDivElement>(null)
  const [stageWidth, setStageWidth] = useState<number>(0)

  useEffect(() => {
    if (!stageRef.current) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStageWidth(entry.contentRect.width)
      }
    })
    ro.observe(stageRef.current)
    return () => ro.disconnect()
  }, [])

  // Auto Scale: If container is narrower than selected device (e.g. 1440px desktop on 390px mobile screen)
  const autoScale = useMemo(() => {
    if (isFluid || !stageWidth || typeof renderWidth !== "number") return 1
    const availableWidth = stageWidth - 12
    if (availableWidth > 0 && availableWidth < renderWidth) {
      return Math.max(0.15, availableWidth / renderWidth)
    }
    return 1
  }, [isFluid, stageWidth, renderWidth])

  const effectiveScale = (zoomScale / 100) * autoScale

  // Switch mobile tab while keeping scroll position in sync
  const handleMobileTabSwitch = (newTab: "form" | "preview") => {
    if (newTab === mobileViewMode) return

    if (mobileViewMode === "form" && formRef.current) {
      const f = formRef.current
      const scrollable = f.scrollHeight - f.clientHeight
      if (scrollable > 0) {
        lastScrollRatioRef.current = f.scrollTop / scrollable
      }
    } else if (mobileViewMode === "preview" && previewRef.current) {
      const p = previewRef.current
      const scrollable = p.scrollHeight - p.clientHeight
      if (scrollable > 0) {
        lastScrollRatioRef.current = p.scrollTop / scrollable
      }
    }

    setMobileViewMode(newTab)

    setTimeout(() => {
      if (newTab === "form" && formRef.current) {
        const f = formRef.current
        const scrollable = f.scrollHeight - f.clientHeight
        if (scrollable > 0) {
          f.scrollTop = lastScrollRatioRef.current * scrollable
        }
      } else if (newTab === "preview" && previewRef.current) {
        const p = previewRef.current
        const scrollable = p.scrollHeight - p.clientHeight
        if (scrollable > 0) {
          p.scrollTop = lastScrollRatioRef.current * scrollable
        }
      }
    }, 60)
  }

  // Drag-to-resize state
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const dragStartXRef = useRef<number>(0)
  const dragStartWidthRef = useRef<number>(1440)
  const frameContainerRef = useRef<HTMLDivElement>(null)

  // Quick mode handler
  const setQuickMode = (mode: "responsive" | "fullhd" | "desktop" | "laptop" | "tablet" | "mobile") => {
    if (mode === "responsive") {
      setSelectedDeviceId("responsive")
      setIsFluid(true)
      setIsLandscape(false)
      setZoomScale(100)
    } else if (mode === "fullhd") {
      setSelectedDeviceId("desktop-fhd-1080p")
      setIsFluid(false)
      setCustomWidth(1920)
      setCustomHeight(1080)
    } else if (mode === "desktop") {
      setSelectedDeviceId("macbook-pro-14")
      setIsFluid(false)
      setCustomWidth(1440)
      setCustomHeight(900)
    } else if (mode === "laptop") {
      setSelectedDeviceId("macbook-air-13")
      setIsFluid(false)
      setCustomWidth(1280)
      setCustomHeight(832)
    } else if (mode === "tablet") {
      setSelectedDeviceId("ipad-mini")
      setIsFluid(false)
      setCustomWidth(768)
      setCustomHeight(1024)
    } else if (mode === "mobile") {
      setSelectedDeviceId("iphone-13-12")
      setIsFluid(false)
      setCustomWidth(390)
      setCustomHeight(844)
    }
  }

  // Handle Preset Selection
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId)
    if (deviceId === "responsive") {
      setIsFluid(true)
      setIsLandscape(false)
      setZoomScale(100)
      return
    }

    const preset = DEVICE_PRESETS.find((d) => d.id === deviceId)
    if (preset && typeof preset.width === "number") {
      setIsFluid(false)
      setCustomWidth(preset.width)
      setCustomHeight(preset.height || 800)
    }
  }

  // Handle Manual Input
  const handleWidthInputChange = (val: string) => {
    const num = parseInt(val, 10)
    if (!isNaN(num) && num > 0) {
      setIsFluid(false)
      setCustomWidth(Math.min(3840, Math.max(280, num)))
      setSelectedDeviceId("custom")
    }
  }

  const handleHeightInputChange = (val: string) => {
    const num = parseInt(val, 10)
    if (!isNaN(num) && num > 0) {
      setIsFluid(false)
      setCustomHeight(Math.min(2160, Math.max(280, num)))
      setSelectedDeviceId("custom")
    }
  }

  // Drag Resizing Logic
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setIsFluid(false)
    dragStartXRef.current = e.clientX

    const currentW = frameContainerRef.current?.offsetWidth || customWidth
    dragStartWidthRef.current = currentW
    setSelectedDeviceId("custom")
  }, [customWidth])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - dragStartXRef.current) * (100 / zoomScale)
      const newWidth = Math.round(Math.max(320, Math.min(2560, dragStartWidthRef.current + deltaX * 2)))
      setCustomWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, zoomScale])

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background select-none">
      {/* =========================
          Universal Top Header
      ========================== */}
      <header className="z-20 flex h-14 flex-none items-center justify-between border-b border-border/60 bg-card px-3 shadow-xs">
        {/* Left Section: Back Button & Title */}
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate(backToUrl)}
            className="shrink-0 rounded-full p-2 transition-colors hover:bg-muted cursor-pointer"
            title={backToLabel || "Back"}
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="h-6 w-px shrink-0 bg-border/60" />

          <div className="flex items-center gap-2 min-w-0">
            {Icon && <Icon className={cn("h-4 w-4 shrink-0", iconColor)} />}
            <h1 className="truncate text-sm font-semibold text-foreground capitalize">
              {title}
            </h1>
          </div>

          {/* Desktop Sidebar Collapse Toggle Button */}
          {sidebarContent && previewContent && (
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              className="hidden md:flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer border border-border/50"
              title={isSidebarCollapsed ? "Show Form Sidebar" : "Hide Form Sidebar (Expand Preview)"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Center Section: Full Chrome DevTools Style Viewport Bar (Desktop) */}
        {sidebarContent && previewContent && (
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 p-1">
            {/* 1. Quick Category Buttons Side-by-Side in Strict Order: Fluid, Full HD, Desktop (Default), Laptop, Tablet, Mobile */}
            <div className="flex items-center gap-0.5 rounded-md border border-border/50 bg-background/80 p-0.5 shadow-2xs">
              {/* Fluid */}
              <button
                type="button"
                onClick={() => setQuickMode("responsive")}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition-all cursor-pointer",
                  isFluid
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Responsive (100% Fluid)"
              >
                <Maximize2 className="h-3 w-3" />
                <span className="hidden xl:inline">Fluid</span>
              </button>

              {/* Full HD */}
              <button
                type="button"
                onClick={() => setQuickMode("fullhd")}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition-all cursor-pointer",
                  !isFluid && (selectedDeviceId === "desktop-fhd-1080p" || customWidth === 1920)
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Full HD (1920 × 1080)"
              >
                <Monitor className="h-3 w-3" />
                <span className="hidden xl:inline">Full HD</span>
              </button>

              {/* Desktop (Default 1440px) */}
              <button
                type="button"
                onClick={() => setQuickMode("desktop")}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition-all cursor-pointer",
                  !isFluid && (selectedDeviceId === "macbook-pro-14" || (customWidth === 1440 && selectedDeviceId !== "desktop-fhd-1080p"))
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Desktop (1440px - Default)"
              >
                <Monitor className="h-3 w-3" />
                <span className="hidden xl:inline">Desktop</span>
              </button>

              {/* Laptop */}
              <button
                type="button"
                onClick={() => setQuickMode("laptop")}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition-all cursor-pointer",
                  !isFluid && (selectedDeviceId === "macbook-air-13" || selectedDeviceId === "desktop-standard" || (customWidth === 1280 && selectedDeviceId !== "desktop-fhd-1080p"))
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Laptop (1280px)"
              >
                <Laptop className="h-3 w-3" />
                <span className="hidden xl:inline">Laptop</span>
              </button>

              {/* Tablet */}
              <button
                type="button"
                onClick={() => setQuickMode("tablet")}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition-all cursor-pointer",
                  !isFluid && (selectedDeviceId.includes("ipad") || selectedDeviceId.includes("tab") || (customWidth >= 768 && customWidth <= 1024 && selectedDeviceId !== "macbook-air-13"))
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Tablet (768px)"
              >
                <Tablet className="h-3 w-3" />
                <span className="hidden xl:inline">Tablet</span>
              </button>

              {/* Mobile */}
              <button
                type="button"
                onClick={() => setQuickMode("mobile")}
                className={cn(
                  "flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition-all cursor-pointer",
                  !isFluid && (selectedDeviceId.includes("iphone") || selectedDeviceId.includes("samsung-s24") || selectedDeviceId.includes("pixel") || customWidth <= 430)
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Mobile (390px)"
              >
                <Smartphone className="h-3 w-3" />
                <span className="hidden xl:inline">Mobile</span>
              </button>
            </div>

            {/* 2. Specific Device Models Dropdown in Matching Strict Order */}
            <div className="flex items-center gap-1 rounded-md border border-border/60 bg-background px-2 py-1 shadow-2xs">
              <select
                value={selectedDeviceId}
                onChange={(e) => handleDeviceChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-foreground outline-none cursor-pointer pr-1 max-w-[150px] truncate"
              >
                <option value="responsive">🌐 Fluid (Responsive)</option>
                <option value="desktop-fhd-1080p">🖥️ Full HD (1920 × 1080)</option>
                <option value="macbook-pro-14">🖥️ Desktop (1440 × 900) [Default]</option>

                <optgroup label="💻 Laptops">
                  <option value="macbook-air-13">MacBook Air 13" (1280 × 832)</option>
                  <option value="desktop-standard">Desktop Standard (1280 × 800)</option>
                </optgroup>

                <optgroup label="📟 Tablets">
                  <option value="ipad-pro-12-9">iPad Pro 12.9" (1024 × 1366)</option>
                  <option value="ipad-air-10">iPad Air 10.9" (820 × 1180)</option>
                  <option value="ipad-mini">iPad Mini (768 × 1024)</option>
                  <option value="samsung-tab-s9">Galaxy Tab S9 (800 × 1280)</option>
                </optgroup>

                <optgroup label="📱 Mobile Phones">
                  <option value="iphone-16-pro-max">iPhone 16 Pro Max (430 × 932)</option>
                  <option value="iphone-15-pro">iPhone 15 / 14 Pro (393 × 852)</option>
                  <option value="iphone-13-12">iPhone 13 / 12 (390 × 844)</option>
                  <option value="iphone-se">iPhone SE / 8 (375 × 667)</option>
                  <option value="samsung-s24-ultra">Galaxy S24 Ultra (412 × 915)</option>
                  <option value="google-pixel-8-pro">Pixel 8 Pro (412 × 892)</option>
                </optgroup>

                {selectedDeviceId === "custom" && <option value="custom">✏️ Custom Size</option>}
              </select>
            </div>

            {/* 3. Manual Resolution Input Boxes (Width × Height) */}
            <div className="flex items-center gap-1 rounded-md border border-border/60 bg-background px-1.5 py-0.5 shadow-2xs">
              <span className="text-[10px] font-bold text-muted-foreground">W:</span>
              <input
                type="text"
                value={isFluid ? "100%" : renderWidth}
                onChange={(e) => handleWidthInputChange(e.target.value)}
                className="w-12 bg-transparent text-center text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-primary rounded"
                title="Manual Width (px or %)"
              />
              <span className="text-muted-foreground/60 text-xs">×</span>
              <span className="text-[10px] font-bold text-muted-foreground">H:</span>
              <input
                type="text"
                disabled={isFluid}
                value={isFluid ? "Auto" : renderHeight}
                onChange={(e) => handleHeightInputChange(e.target.value)}
                className={cn(
                  "w-12 bg-transparent text-center text-xs font-mono font-bold text-foreground outline-none focus:ring-1 focus:ring-primary rounded",
                  isFluid && "opacity-50 cursor-not-allowed"
                )}
                title="Manual Height (px)"
              />
              <span className="text-[10px] font-medium text-muted-foreground">px</span>
            </div>

            {/* 4. Rotate Orientation Toggle */}
            {!isFluid && (
              <button
                type="button"
                onClick={() => setIsLandscape((prev) => !prev)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all cursor-pointer",
                  isLandscape
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                )}
                title={`Rotate orientation (Current: ${isLandscape ? "Landscape" : "Portrait"})`}
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span className="text-[11px] hidden xl:inline">{isLandscape ? "Landscape" : "Portrait"}</span>
              </button>
            )}

            <div className="h-4 w-px bg-border/60 mx-0.5" />

            {/* 5. Zoom Selector */}
            <div className="flex items-center gap-1">
              <ZoomIn className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={zoomScale}
                onChange={(e) => setZoomScale(Number(e.target.value))}
                className="rounded border border-border/60 bg-background px-1.5 py-0.5 text-xs font-semibold text-foreground outline-none cursor-pointer"
              >
                <option value={125}>125%</option>
                <option value={100}>100%</option>
                <option value={90}>90%</option>
                <option value={85}>85%</option>
                <option value={75}>75%</option>
                <option value={67}>67%</option>
                <option value={50}>50%</option>
              </select>
            </div>

            <div className="h-4 w-px bg-border/60 mx-0.5" />

            {/* Dev Mode Toggle Pill next to responsive controls */}
            <button
              type="button"
              onClick={toggleDevMode}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-all cursor-pointer border select-none shrink-0",
                isDevMode
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40"
                  : "bg-background text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
              )}
              title={
                isDevMode
                  ? "Dev Mode ON: All styling & multimedia controls visible"
                  : "Dev Mode OFF: Simple editor mode (Default styles applied)"
              }
            >
              <Code2 className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden xl:inline">Dev Mode</span>
              <span
                className={cn(
                  "h-2 w-2 rounded-full shrink-0 transition-colors",
                  isDevMode ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/40"
                )}
              />
            </button>
          </div>
        )}

        {/* Center Section: Mobile Form / Preview Toggle Switcher */}
        {sidebarContent && previewContent && (
          <div className="flex md:hidden items-center rounded-lg border border-border/70 bg-muted/60 p-0.5">
            <button
              type="button"
              onClick={() => handleMobileTabSwitch("form")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                mobileViewMode === "form"
                  ? "bg-background text-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Form</span>
            </button>
            <button
              type="button"
              onClick={() => handleMobileTabSwitch("preview")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                mobileViewMode === "preview"
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
          </div>
        )}

        {/* Right Section: Header Actions, Dev Mode Toggle, Theme Toggle & Live Preview Badge */}
        <div className="flex shrink-0 items-center gap-2.5">
          {headerActions}

          {/* Dev Mode Toggle Pill Button */}
          <button
            type="button"
            onClick={toggleDevMode}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer shadow-2xs border select-none",
              isDevMode
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40"
                : "bg-muted/60 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
            )}
            title={
              isDevMode
                ? "Dev Mode ON: All styling & multimedia controls visible"
                : "Dev Mode OFF: Simple editor mode (Default styles applied)"
            }
          >
            <Code2 className="h-3.5 w-3.5 shrink-0" />
            <span className="hidden sm:inline">Dev Mode</span>
            <span
              className={cn(
                "h-2 w-2 rounded-full shrink-0 transition-colors",
                isDevMode ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/40"
              )}
            />
          </button>

          <ThemeToggle />

          <div className="hidden sm:flex shrink-0 items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span>Live Preview</span>
          </div>
        </div>
      </header>

      {/* =========================
          Universal Main Split Content
          30% Form Sidebar / 70% Live Preview Area
      ========================== */}
      <main className="relative flex flex-1 overflow-hidden">
        {sidebarContent && previewContent ? (
          <>
            {/* Left: Form Sidebar */}
            <aside
              className={cn(
                "relative z-10 flex flex-col overflow-hidden border-r border-border/60 bg-card/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-200",
                mobileViewMode === "form" ? "flex w-full" : "hidden",
                "md:flex",
                isSidebarCollapsed
                  ? "md:hidden"
                  : "md:w-[32%] md:basis-[32%] lg:w-[28%] lg:basis-[28%] xl:w-[26%] xl:basis-[26%] flex-none"
              )}
            >
              <div ref={formRef} className="custom-scrollbar flex-1 overflow-y-auto">
                {sidebarContent}
              </div>
            </aside>

            {/* Right: Live Preview Area */}
            <section
              className={cn(
                "relative min-w-0 flex-1 flex-col items-center justify-start overflow-hidden bg-muted/40 p-2 md:p-3",
                mobileViewMode === "preview" ? "flex w-full" : "hidden",
                "md:flex"
              )}
            >
              {/* Responsive Mini-Screen Device Presets Bar (Visible on < lg screens) */}
              <div className="flex lg:hidden w-full items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/95 px-2.5 py-1.5 mb-2 shadow-2xs shrink-0 overflow-x-auto">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:inline">Device:</span>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => handleDeviceChange(e.target.value)}
                    className="bg-background text-xs font-semibold text-foreground outline-none cursor-pointer px-2 py-1 rounded border border-border/70 max-w-[170px] truncate"
                  >
                    <option value="responsive">🌐 Fluid (Responsive)</option>
                    <option value="desktop-fhd-1080p">🖥️ Full HD (1920 × 1080)</option>
                    <option value="macbook-pro-14">🖥️ Desktop (1440 × 900) [Default]</option>

                    <optgroup label="💻 Laptops">
                      <option value="macbook-air-13">MacBook Air 13" (1280 × 832)</option>
                      <option value="desktop-standard">Desktop Standard (1280 × 800)</option>
                    </optgroup>

                    <optgroup label="📟 Tablets">
                      <option value="ipad-pro-12-9">iPad Pro 12.9" (1024 × 1366)</option>
                      <option value="ipad-air-10">iPad Air 10.9" (820 × 1180)</option>
                      <option value="ipad-mini">iPad Mini (768 × 1024)</option>
                      <option value="samsung-tab-s9">Galaxy Tab S9 (800 × 1280)</option>
                    </optgroup>

                    <optgroup label="📱 Mobile Phones">
                      <option value="iphone-16-pro-max">iPhone 16 Pro Max (430 × 932)</option>
                      <option value="iphone-15-pro">iPhone 15 / 14 Pro (393 × 852)</option>
                      <option value="iphone-13-12">iPhone 13 / 12 (390 × 844)</option>
                      <option value="iphone-se">iPhone SE / 8 (375 × 667)</option>
                      <option value="samsung-s24-ultra">Galaxy S24 Ultra (412 × 915)</option>
                      <option value="google-pixel-8-pro">Pixel 8 Pro (412 × 892)</option>
                    </optgroup>

                    {selectedDeviceId === "custom" && <option value="custom">✏️ Custom Size</option>}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-muted-foreground bg-muted/60 px-2 py-1 rounded border border-border/50">
                    <span>{isFluid ? "Fluid" : `${renderWidth}×${renderHeight}px`}</span>
                  </div>

                  {!isFluid && (
                    <button
                      type="button"
                      onClick={() => setIsLandscape((prev) => !prev)}
                      className="p-1 rounded border border-border/60 bg-background text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Rotate orientation"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <div className="flex items-center gap-1">
                    <select
                      value={zoomScale}
                      onChange={(e) => setZoomScale(Number(e.target.value))}
                      className="rounded border border-border/60 bg-background px-1.5 py-1 text-xs font-semibold text-foreground outline-none cursor-pointer"
                    >
                      <option value={100}>100%</option>
                      <option value={85}>85%</option>
                      <option value={75}>75%</option>
                      <option value={50}>50%</option>
                    </select>
                  </div>

                  {/* Dev Mode Toggle for Mini Screen Device Bar */}
                  <button
                    type="button"
                    onClick={toggleDevMode}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold transition-all cursor-pointer border select-none shrink-0",
                      isDevMode
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40"
                        : "bg-background text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground"
                    )}
                    title={
                      isDevMode
                        ? "Dev Mode ON: All styling & multimedia controls visible"
                        : "Dev Mode OFF: Simple editor mode (Default styles applied)"
                    }
                  >
                    <Code2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="hidden sm:inline">Dev Mode</span>
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full shrink-0 transition-colors",
                        isDevMode ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/40"
                      )}
                    />
                  </button>
                </div>
              </div>

              {/* Scrollable Viewport Stage Container */}
              <div
                ref={stageRef}
                className="relative flex h-full w-full flex-1 items-start justify-center overflow-x-auto overflow-y-hidden custom-scrollbar p-1"
              >
                <div
                  className="relative flex h-full items-start justify-center"
                  style={{
                    width: isFluid
                      ? "100%"
                      : `${(typeof renderWidth === "number" ? renderWidth : 1440) * (effectiveScale < 1 ? effectiveScale : 1)}px`,
                    maxWidth: "100%",
                  }}
                >
                  {/* The Preview Frame Container */}
                  <div
                    ref={(node) => {
                      (frameContainerRef as any).current = node
                      if (previewRef) {
                        (previewRef as any).current = node
                      }
                    }}
                    style={{
                      width: isFluid ? "100%" : `${renderWidth}px`,
                      maxWidth: isFluid ? "100%" : undefined,
                      height: effectiveScale < 1 ? `${100 / effectiveScale}%` : "100%",
                      maxHeight: effectiveScale < 1 ? `${100 / effectiveScale}%` : "100%",
                      transform: effectiveScale !== 1 ? `scale(${effectiveScale})` : undefined,
                      transformOrigin: "top center",
                      transition: isDragging ? "none" : "width 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease",
                    }}
                    className={cn(
                      "bg-background shadow-xl custom-scrollbar overflow-y-auto overflow-x-hidden block",
                      isFluid && "w-full h-full rounded-xl border border-border/60",
                      !isFluid && activeDevice?.frameType === "phone" && "shrink-0 rounded-[44px] border-[10px] border-slate-900 dark:border-slate-800 shadow-2xl ring-1 ring-slate-950/30",
                      !isFluid && activeDevice?.frameType === "tablet" && "shrink-0 rounded-[28px] border-[8px] border-slate-900 dark:border-slate-800 shadow-2xl ring-1 ring-slate-950/30",
                      !isFluid && (activeDevice?.frameType === "screen" || selectedDeviceId === "custom") && "shrink-0 rounded-xl border border-border/80 shadow-2xl"
                    )}
                  >
                    {useWorkspaceScale ? (
                      <ScaledWorkspace>{previewContent}</ScaledWorkspace>
                    ) : (
                      <div className="@container w-full">{previewContent}</div>
                    )}
                  </div>

                  {/* Right Border Draggable Resizing Handle (Chrome DevTools style) */}
                  {!isFluid && (
                    <div
                      onMouseDown={handleMouseDown}
                      className={cn(
                        "group absolute -right-3.5 top-1/2 -translate-y-1/2 z-50 flex h-20 w-5 cursor-ew-resize items-center justify-center rounded-full bg-border/80 hover:bg-primary hover:text-primary-foreground border border-border transition-all shadow-md",
                        isDragging && "bg-primary text-primary-foreground scale-110 ring-2 ring-primary/40"
                      )}
                      title="Drag to resize viewport width"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
