import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useMe } from "@/hooks/auth/useMe"
import { useUserSessions } from "@/hooks/auth/useUserSessions"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { useGetSettings } from "@/hooks/settings/useSettings"
import { useTheme } from "@/components/ThemeProvider"
import { useDevMode } from "@/context/DevModeContext"
import { UniversalMultimediaPreview } from "../pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LogoutModal } from "./LogoutModal"
import { ActiveDevicesModal } from "./ActiveDevicesModal"
import { getOptimizedImageUrl, DASHBOARD_IMAGE_WIDTHS } from "@/lib/optimizedImage"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User,
  ShieldCheck,
  LogOut,
  Menu,
  ChevronDown,
  Code2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const defaultAvatar = "https://i.pravatar.cc/150?u=default"

const extractBrand = (cmsResponse: any) => {
  if (!cmsResponse) return null
  const pageObj = Array.isArray(cmsResponse?.data)
    ? cmsResponse.data[0]
    : cmsResponse?.data
  if (!pageObj) return null

  const innerData = pageObj?.data || pageObj
  return innerData?.content?.brand || pageObj?.content?.brand || null
}

const getMediaUrl = (obj: any): string => {
  if (!obj) return ""
  if (typeof obj === "string") return obj
  if (obj.image?.url) return obj.image.url
  if (obj.video?.url) return obj.video.url
  if (obj.url) return obj.url
  if (obj.imageData?.url) return obj.imageData.url
  return ""
}

export const NavbarBrandLogo = () => {
  const { theme } = useTheme()
  const { data: settingsData } = useGetSettings()
  const { data: navbarCms } = useGetCmsBySlug("navbar")
  const { data: footerCms } = useGetCmsBySlug("footer")

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  const navbarBrand = extractBrand(navbarCms)
  const footerBrand = extractBrand(footerCms)

  const navbarMedia = navbarBrand?.navbarBrandMultimedia
  const footerMedia = footerBrand?.footerBrandMultimedia

  // Candidates in priority order based on theme:
  // Dark mode: navbarLogoDark -> navbarLogo -> siteLogoDark -> siteLogo -> CMS navbarBrand -> CMS footerBrand
  // Light mode: navbarLogo -> siteLogoLight -> siteLogo -> navbarLogoDark -> CMS navbarBrand -> CMS footerBrand
  const candidateObjects = isDark
    ? [
        settingsData?.navbarLogoDark,
        settingsData?.navbarLogo,
        settingsData?.siteLogoDark,
        settingsData?.siteLogo,
        navbarMedia,
        navbarBrand?.logo ? { type: "image", url: navbarBrand.logo, alt: navbarBrand.alt } : null,
        footerMedia,
        footerBrand?.logo ? { type: "image", url: footerBrand.logo, alt: footerBrand.alt } : null,
      ]
    : [
        settingsData?.navbarLogo,
        settingsData?.siteLogoLight,
        settingsData?.siteLogo,
        settingsData?.navbarLogoDark,
        navbarMedia,
        navbarBrand?.logo ? { type: "image", url: navbarBrand.logo, alt: navbarBrand.alt } : null,
        footerMedia,
        footerBrand?.logo ? { type: "image", url: footerBrand.logo, alt: footerBrand.alt } : null,
      ]

  const mediaObj = candidateObjects.find((candidate) => Boolean(getMediaUrl(candidate)))
  const brandName = settingsData?.siteName || navbarBrand?.name || footerBrand?.name || "MIRA"
  const mediaUrl = getMediaUrl(mediaObj)

  if (mediaObj && mediaUrl) {
    const isVideo =
      mediaObj?.show === "video" ||
      mediaObj?.type === "video" ||
      Boolean((mediaObj as any)?.video?.url)

    if (isVideo) {
      return (
        <Link
          to="/"
          className="inline-flex items-center h-full max-h-14 py-0.5 transition-opacity hover:opacity-90 shrink-0"
        >
          <UniversalMultimediaPreview
            multimedia={mediaObj as any}
            fallbackAlt={brandName}
            className="h-full w-auto max-h-14 max-w-[320px] object-contain object-left"
            containerClassName="h-full max-h-14 max-w-[320px] flex items-center p-0"
          />
        </Link>
      )
    }

    const opacity =
      (mediaObj as any)?.image?.opacity ?? (mediaObj as any)?.opacity
    const safeOpacity =
      opacity !== undefined && opacity !== null && opacity !== ""
        ? Number(opacity) > 1
          ? Number(opacity) / 100
          : Number(opacity)
        : 1

    return (
      <Link
        to="/"
        className="inline-flex items-center h-full max-h-14 py-0.5 transition-opacity hover:opacity-90 shrink-0"
      >
        <img
          src={getOptimizedImageUrl(mediaUrl, { width: DASHBOARD_IMAGE_WIDTHS.NAVBAR_LOGO, quality: 100 })}
          alt={brandName}
          className="h-full w-auto max-h-14 max-w-[320px] object-contain object-left select-none pointer-events-none"
          style={{ opacity: isNaN(safeOpacity) ? 1 : safeOpacity }}
        />
      </Link>
    )
  }

  return (
    <Link
      to="/"
      className="inline-flex items-center h-full max-h-14 py-0.5 transition-transform hover:scale-[1.02] shrink-0"
    >
      <div className="flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-lg border border-border/80 bg-muted/60 px-3.5 shadow-2xs transition-colors hover:bg-muted">
        <span className="font-serif text-base font-bold tracking-widest text-foreground uppercase">
          {brandName}
        </span>
      </div>
    </Link>
  )
}

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate()
  const { data: user } = useMe()
  const { data: sessionStats } = useUserSessions()
  const { isDevMode, toggleDevMode } = useDevMode()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false)
  const [isProfileHovered, setIsProfileHovered] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const isProfileExpanded = isProfileHovered || isDropdownOpen

  const profileName = user?.userPersonalInfo?.firstName
    ? `${user.userPersonalInfo.firstName} ${user.userPersonalInfo.lastName || ""}`.trim()
    : user?.email?.split("@")[0] || "Admin User"

  const profileEmail = user?.email || "admin@example.com"
  const profileImage = user?.userPersonalInfo?.photoUrl?.[0] || defaultAvatar
  const userRole = user?.roles?.[0]?.name || "ADMIN"

  const activeDevicesCount = sessionStats?.totalActiveDevices ?? 1

  let sessionInfo: {
    rememberMe?: boolean
    durationFormatted?: string
    expiresInMinutes?: number
  } | null = null
  try {
    const rawSession = localStorage.getItem("sessionInfo")
    if (rawSession) {
      sessionInfo = JSON.parse(rawSession)
    }
  } catch {
    sessionInfo = null
  }

  const isRemembered =
    sessionInfo?.rememberMe !== undefined
      ? Boolean(sessionInfo.rememberMe)
      : localStorage.getItem("rememberMe") === "true" ||
      Boolean(localStorage.getItem("savedUserEmail"))

  const sessionDuration =
    sessionInfo?.durationFormatted ||
    (isRemembered ? "30d" : "30m")

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6 justify-between">
          {/* Left: Hamburger (Mobile) + Brand Logo */}
          <div className="flex items-center gap-3 md:gap-4 h-full">
            <button
              type="button"
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground hover:bg-muted cursor-pointer shrink-0"
              onClick={onMenuClick}
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <NavbarBrandLogo />
          </div>
          {/* Right: Theme Toggle + User Profile Dropdown */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />

            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onMouseEnter={() => setIsProfileHovered(true)}
                  onMouseLeave={() => setIsProfileHovered(false)}
                  className="flex items-center rounded-full border border-border/60 bg-card/70 transition-all hover:bg-muted/80 hover:border-border focus:outline-none cursor-pointer shadow-2xs group overflow-hidden"
                  title={profileName}
                >
                  {/* Clean circular profile avatar */}
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all shadow-xs">
                    <img
                      src={getOptimizedImageUrl(profileImage, { width: DASHBOARD_IMAGE_WIDTHS.NAVBAR_AVATAR, quality: 100 })}
                      alt={profileName}
                      className="h-full w-full object-cover scale-105"
                    />
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-1.5 ring-background" />
                  </div>

                  {/* Sliding Name, Role & Chevron to the Right */}
                  <AnimatePresence>
                    {isProfileExpanded && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden flex items-center pl-2.5 pr-2 gap-2 whitespace-nowrap"
                      >
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[130px]">
                            {profileName}
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground leading-tight uppercase tracking-wider">
                            {userRole}
                          </span>
                        </div>

                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 shrink-0" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-64 rounded-xl border border-border/70 bg-card/95 backdrop-blur-md p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95"
              >
                {/* Dropdown Header: Clean Profile Card */}
                <DropdownMenuLabel className="p-2.5 font-normal">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 shadow-xs">
                      <img
                        src={getOptimizedImageUrl(profileImage, { width: DASHBOARD_IMAGE_WIDTHS.NAVBAR_AVATAR, quality: 100 })}
                        alt={profileName}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate leading-tight">
                        {profileName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                        {profileEmail}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wider">
                          {userRole}
                        </span>
                        {isRemembered && (
                          <span className="inline-flex items-center rounded-md bg-muted/80 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
                            {sessionDuration} session
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="my-1 bg-border/50" />

                {/* Group: Profile & Security */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>My Profile & Security</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setIsDevicesModalOpen(true)}
                    className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <span>Security & Sessions</span>
                    </div>
                    <span className="rounded-full bg-muted/80 border border-border/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {activeDevicesCount} {activeDevicesCount > 1 ? "devices" : "device"}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1 bg-border/50" />

                {/* Developer Mode Toggle */}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    toggleDevMode()
                  }}
                  className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                >
                  <div className="flex items-center gap-2.5">
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                    <span>Developer Mode</span>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border transition-all",
                      isDevMode
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40"
                        : "bg-muted/70 text-muted-foreground border-border/50"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        isDevMode ? "bg-amber-500 animate-pulse" : "bg-muted-foreground/40"
                      )}
                    />
                    {isDevMode ? "ON" : "OFF"}
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1 bg-border/50" />

                {/* Footer: Log Out */}
                <DropdownMenuItem
                  onClick={() => setIsLogoutOpen(true)}
                  className="flex items-center justify-between px-2.5 py-2 text-xs font-semibold text-destructive rounded-lg cursor-pointer transition-colors hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
                >
                  <div className="flex items-center gap-2.5">
                    <LogOut className="h-4 w-4 text-destructive" />
                    <span>Log Out</span>
                  </div>
                  <span className="text-[10px] font-mono text-destructive/70">⌥⇧Q</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <LogoutModal open={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
      <ActiveDevicesModal
        open={isDevicesModalOpen}
        onClose={() => setIsDevicesModalOpen(false)}
        onOpenLogoutModal={() => setIsLogoutOpen(true)}
      />
    </>
  )
}
