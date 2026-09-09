import { useState } from "react"
import { Link } from "react-router-dom"
import { useMe } from "@/hooks/auth/useMe"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { UniversalMultimediaPreview } from "../pages/CMS/Home/shared/preview/UniversalMultimediaPreview"
import { ThemeToggle } from "@/components/ThemeToggle"
import { LogoutModal } from "./LogoutModal"
import { LogOut, Menu } from "lucide-react"

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
  const { data: user } = useMe()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const profileName = user?.userPersonalInfo?.firstName
    ? `${user.userPersonalInfo.firstName} ${user.userPersonalInfo.lastName || ""}`.trim()
    : user?.email?.split("@")[0] || "Admin User"

  const profileEmail = user?.email || "admin@example.com"
  const profileImage = user?.userPersonalInfo?.photoUrl?.[0] || defaultAvatar

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
          
          {/* Right: Theme Toggle + User Info + Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />
            
            <div className="h-6 w-px bg-border/60" />

            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background shadow-2xs">
                <img
                  src={profileImage}
                  alt={profileName}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Name & Email */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-bold text-foreground leading-tight">
                  {profileName}
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  {profileEmail}
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                type="button"
                onClick={() => setIsLogoutOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground transition-all hover:bg-destructive hover:text-destructive-foreground hover:scale-105 active:scale-95 shadow-2xs cursor-pointer ml-1"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <LogoutModal open={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </>
  )
}
