import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMe } from "@/hooks/auth/useMe"
import { useUserSessions } from "@/hooks/auth/useUserSessions"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { UniversalMultimediaPreview } from "../pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LogoutModal } from "./LogoutModal"
import { ActiveDevicesModal } from "./ActiveDevicesModal"
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
  Settings,
  ShieldCheck,
  Bell,
  Activity,
  Command,
  HelpCircle,
  LogOut,
  Menu,
  ChevronDown,
  KeyRound,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { toast } from "sonner"

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

export const NavbarBrandLogo = () => {
  const { data: navbarCms } = useGetCmsBySlug("navbar")
  const { data: footerCms } = useGetCmsBySlug("footer")

  const navbarBrand = extractBrand(navbarCms)
  const footerBrand = extractBrand(footerCms)

  const navbarMedia = navbarBrand?.navbarBrandMultimedia
  const footerMedia = footerBrand?.footerBrandMultimedia

  const mediaObj =
    navbarMedia &&
      (navbarMedia.url ||
        (navbarMedia as any).image?.url ||
        (navbarMedia as any).imageData?.url)
      ? navbarMedia
      : navbarBrand?.logo
        ? { type: "image", url: navbarBrand.logo, alt: navbarBrand.alt }
        : footerMedia &&
          (footerMedia.url ||
            (footerMedia as any).image?.url ||
            (footerMedia as any).imageData?.url)
          ? footerMedia
          : footerBrand?.logo
            ? { type: "image", url: footerBrand.logo, alt: footerBrand.alt }
            : null

  const brandName = navbarBrand?.name || footerBrand?.name || "MIRA"
  const mediaUrl =
    mediaObj?.url ||
    (mediaObj as any)?.image?.url ||
    (mediaObj as any)?.imageData?.url

  if (mediaObj && mediaUrl) {
    return (
      <Link to="/" className="inline-flex items-center transition-opacity hover:opacity-90">
        <UniversalMultimediaPreview
          multimedia={mediaObj as any}
          fallbackAlt={brandName}
          className="h-8 max-w-[160px] w-auto object-contain object-left"
          containerClassName="h-8 max-w-[160px] flex items-center"
        />
      </Link>
    )
  }

  return (
    <Link to="/" className="inline-flex items-center transition-transform hover:scale-[1.02]">
      <div className="flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-lg border border-border/80 bg-muted/60 px-3 shadow-2xs transition-colors hover:bg-muted">
        <span className="font-serif text-sm font-bold tracking-widest text-foreground uppercase">
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
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false)

  const profileName = user?.userPersonalInfo?.firstName
    ? `${user.userPersonalInfo.firstName} ${user.userPersonalInfo.lastName || ""}`.trim()
    : user?.email?.split("@")[0] || "Admin User"

  const profileEmail = user?.email || "admin@example.com"
  const profileImage = user?.userPersonalInfo?.photoUrl?.[0] || defaultAvatar
  const userRole = user?.roles?.[0]?.name || "ADMIN"

  const activeDevicesCount = sessionStats?.totalActiveDevices ?? 1
  const onlineDevicesCount = sessionStats?.onlineDevices ?? 1

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

  const handleDummyFeature = (featureName: string) => {
    toast.info(`${featureName} is under active development and will be available in the next release!`, {
      duration: 3000,
    })
  }

  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 md:px-6 justify-between">
          {/* Left: Hamburger (Mobile) + Brand Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              type="button"
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground hover:bg-muted cursor-pointer" 
              onClick={onMenuClick}
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <NavbarBrandLogo />
          </div>
          
          {/* Right: Theme Toggle + User Profile Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            
            <div className="h-6 w-px bg-border/60" />

            {/* User Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2.5 rounded-full border border-border/60 bg-card/70 py-1 pl-1 pr-2.5 transition-all hover:bg-muted/80 hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-2xs group"
                >
                  {/* User Avatar with live status pulse */}
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                    <img
                      src={profileImage}
                      alt={profileName}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1.5 ring-background" />
                  </div>

                  {/* Name & Role (Desktop) */}
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">
                      {profileName}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground leading-tight uppercase tracking-wider">
                      {userRole}
                    </span>
                  </div>

                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-72 rounded-xl border border-border/70 bg-card p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95"
              >
                {/* Dropdown Header: Full Profile Card */}
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
                      <img
                        src={profileImage}
                        alt={profileName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {profileName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {profileEmail}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary uppercase tracking-wide">
                          {userRole}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {onlineDevicesCount > 1 ? `${onlineDevicesCount} Online` : "Online"}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                {/* Remember This Device Status Banner */}
                <div className="mx-1 my-1 rounded-lg border border-border/60 bg-muted/40 p-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                      <Laptop className="h-3.5 w-3.5" />
                      <span>Remember Device:</span>
                    </span>
                    {isRemembered ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        TRUE ({sessionDuration})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        <Clock className="h-3 w-3" />
                        FALSE ({sessionDuration})
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center justify-between border-t border-border/40 pt-1 text-[10px]">
                    <span className="text-muted-foreground">
                      Active: <strong className="font-semibold text-foreground">{activeDevicesCount} Device{activeDevicesCount > 1 ? "s" : ""}</strong>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {onlineDevicesCount} Online Now
                    </span>
                  </div>

                  <p className="mt-1 text-[9px] text-muted-foreground/80 leading-tight">
                    {isRemembered
                      ? `Persistent session active (${sessionDuration} token lifetime).`
                      : `Ephemeral session active (${sessionDuration} token lifetime).`}
                  </p>
                </div>

                <DropdownMenuSeparator className="my-1 bg-border/60" />

                {/* Group 1: Profile & Core Account */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>My Profile & Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setIsDevicesModalOpen(true)}
                    className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                      <span>Security & Sessions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                        {activeDevicesCount} Device{activeDevicesCount > 1 ? "s" : ""}
                      </span>
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {onlineDevicesCount} Online
                      </span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Site Preferences</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1 bg-border/60" />

                {/* Group 2: Productivity & System Features */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleDummyFeature("Notification Center")}
                    className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span>Notifications</span>
                    </div>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      3
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => navigate("/audit-logs")}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span>Live Audit Logs</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleDummyFeature("API Keys & Webhooks Manager")}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <span>API Keys & Integrations</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleDummyFeature("Keyboard Shortcuts Guide")}
                    className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <div className="flex items-center gap-2.5">
                      <Command className="h-4 w-4 text-muted-foreground" />
                      <span>Keyboard Shortcuts</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">⌘K</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleDummyFeature("Documentation & Help Center")}
                    className="flex items-center justify-between px-2.5 py-2 text-xs font-medium text-foreground rounded-lg cursor-pointer transition-colors hover:bg-muted focus:bg-muted"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Help & Support</span>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1 bg-border/60" />

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
