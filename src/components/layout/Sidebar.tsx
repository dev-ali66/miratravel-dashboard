import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useMe } from "@/hooks/auth/useMe"
import { cn } from "@/lib/utils"
import { SlideLeft } from "@/components/animation"

import {
  LayoutDashboard,
  Inbox,
  Wallet,
  LifeBuoy,
  Settings,
  LogOut,
  User,
  FileText,
  HelpCircle,
  Shield,
  ScrollText,
  ChevronDown,
  Home,
  Menu,
  PanelBottom,
  Mail,
  Megaphone,
  LocateIcon,
  Compass,
} from "lucide-react"

import { LogoutModal } from "./LogoutModal"

const images = {
  logo_black: "/logo_black.png",
  logo: "/logo.png",
}

const defaultAvatar = "https://i.pravatar.cc/150?u=default"

/* =========================================================
   Icon Map
========================================================= */

const iconMap = {
  dashboard: LayoutDashboard,
  inbox: Inbox,
  wallet: Wallet,
  support: LifeBuoy,
  settings: Settings,
  logout: LogOut,
  user: User,
  cms: FileText,
  locations: LocateIcon,
  journeys: Compass,
  faq: HelpCircle,
  requests: Inbox,
  privacy: Shield,
  terms: ScrollText,
}

/* =========================================================
   CMS Dropdown Items
========================================================= */

const cmsItems = [
  {
    label: "Home",
    href: "/cms/home",
    icon: Home,
  },
  {
    label: "Navbar",
    href: "/cms/navbar",
    icon: Menu,
  },
  {
    label: "Footer",
    href: "/cms/footer",
    icon: PanelBottom,
  },
  {
    label: "FAQ",
    href: "/cms/faq",
    icon: HelpCircle,
  },
  {
    label: "Contact Us",
    href: "/cms/contact-us",
    icon: Mail,
  },
  {
    label: "CTA",
    href: "/cms/cta",
    icon: Megaphone,
  },
]

/* =========================================================
   Types
========================================================= */

export interface NavItemProps {
  href: string
  icon: keyof typeof iconMap
  label: string
  isActive?: boolean
}

export interface SectionProps {
  title: string
  items: NavItemProps[]
}

/* =========================================================
   Normal Nav Link
========================================================= */

const NavLink = ({
  href,
  icon,
  label,
  isActive,
  onClick,
}: NavItemProps & {
  onClick?: (e: React.MouseEvent) => void
}) => {
  const Icon = iconMap[icon]

  const className = cn(
    "group relative flex w-full items-center gap-3 rounded-lg px-4 py-4 text-left transition-all duration-200",
    isActive
      ? "font-semibold text-primary"
      : "text-muted-foreground hover:bg-muted/50"
  )

  const content = (
    <>
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 z-0 rounded-lg bg-[oklch(0.588_0.158_241.966/0.08)]"
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.6,
          }}
        />
      )}

      <Icon
        className={cn(
          "relative z-10 h-5 w-5",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground"
        )}
      />

      <span
        className={cn(
          "relative z-10 text-sm font-medium transition-colors",
          isActive ? "text-primary" : "group-hover:text-foreground"
        )}
      >
        {label}
      </span>
    </>
  )

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    )
  }

  return (
    <Link to={href} className={className}>
      {content}
    </Link>
  )
}

/* =========================================================
   CMS Dropdown
========================================================= */

const CMSDropdown = ({
  isOpen,
  setIsOpen,
  pathname,
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  pathname: string
}) => {
  const isCMSActive = pathname.startsWith("/cms")

  return (
    <div className="flex flex-col">
      {/* CMS Parent */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "group relative flex w-full items-center justify-between rounded-lg px-4 py-4 text-left transition-all duration-200",
          isCMSActive
            ? "font-semibold text-primary"
            : "text-muted-foreground hover:bg-muted/50"
        )}
      >
        {/* Left side */}
        <div className="flex items-center gap-3">
          {isCMSActive && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 z-0 rounded-lg bg-[oklch(0.588_0.158_241.966/0.08)]"
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6,
              }}
            />
          )}

          <FileText
            className={cn(
              "relative z-10 h-5 w-5",
              isCMSActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />

          <span
            className={cn(
              "relative z-10 text-sm font-medium",
              isCMSActive ? "text-primary" : "group-hover:text-foreground"
            )}
          >
            CMS
          </span>
        </div>

        {/* Arrow */}
        <ChevronDown
          size={18}
          className={cn(
            "relative z-10 transition-transform duration-200",
            isOpen && "rotate-180",
            isCMSActive ? "text-primary" : "text-muted-foreground"
          )}
        />
      </button>

      {/* CMS Children */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-1 ml-6 flex flex-col gap-1 border-l border-border/70 pl-4">
            {cmsItems.map((item) => {
              const Icon = item.icon

              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      "shrink-0",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />

                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   Sidebar
========================================================= */

export default function Sidebar({
  sections = [],
}: {
  sections?: SectionProps[]
}) {
  const location = useLocation()
  const pathname = location.pathname

  const [showLogoutModal, setShowLogoutModal] = useState(false)

  /*
   * CMS automatically opens when current route
   * starts with /cms
   */
  const isCMSRoute = pathname.startsWith("/cms")

  const [cmsOpen, setCmsOpen] = useState(isCMSRoute)

  /*
   * If user navigates directly to /cms/*
   * keep dropdown open.
   */
  useEffect(() => {
    if (isCMSRoute) {
      setCmsOpen(true)
    }
  }, [isCMSRoute])

  const { data: user } = useMe()

  /* =========================================================
     User Profile
  ========================================================= */

  const profileName = user?.userPersonalInfo?.firstName
    ? `${user.userPersonalInfo.firstName} ${
        user.userPersonalInfo.lastName || ""
      }`
    : user?.email?.split("@")[0] || "Guest"

  const profileEmail = user?.email || "No email"

  const profileImage = user?.userPersonalInfo?.photoUrl?.[0] || defaultAvatar

  return (
    <>
      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />

      <aside className="sticky top-0 flex h-screen min-w-70 flex-2 shrink-0 flex-col overflow-y-auto border-r border-dashed border-border bg-background/50 px-4 py-8 backdrop-blur-xl">
        {/* =====================================================
            Logo
        ===================================================== */}

        <SlideLeft delay={0.1} className="mb-10 px-4">
          <Link to="/">
            {/* Light mode */}
            <img
              src={images.logo_black}
              alt="Logo"
              width={140}
              height={40}
              className="block h-8 w-auto object-contain dark:hidden"
            />

            {/* Dark mode */}
            <img
              src={images.logo}
              alt="Logo"
              width={140}
              height={40}
              className="hidden h-8 w-auto object-contain dark:block"
            />
          </Link>
        </SlideLeft>

        {/* =====================================================
            Navigation Sections
        ===================================================== */}

        <div className="flex h-full flex-col justify-between gap-10">
          {sections?.map((section, sIdx) => (
            <div key={section.title} className="flex flex-col gap-2">
              {/* Section Title */}
              <SlideLeft delay={0.3 + sIdx * 0.1}>
                <h3 className="px-4 text-xs font-bold tracking-wider text-foreground">
                  {section.title}
                </h3>
              </SlideLeft>

              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                {section.items.map((item, iIdx) => {
                  const isCMSItem = item.href === "/cms"

                  /*
                   * CMS gets special dropdown treatment
                   */
                  if (isCMSItem) {
                    return (
                      <SlideLeft
                        key={item.href}
                        delay={0.4 + sIdx * 0.1 + iIdx * 0.05}
                      >
                        <CMSDropdown
                          isOpen={cmsOpen}
                          setIsOpen={setCmsOpen}
                          pathname={pathname}
                        />
                      </SlideLeft>
                    )
                  }

                  /* =================================================
                     Normal Navigation Item
                  ================================================= */

                  return (
                    <SlideLeft
                      key={item.href}
                      delay={0.4 + sIdx * 0.1 + iIdx * 0.05}
                    >
                      <NavLink
                        {...item}
                        isActive={
                          pathname === item.href ||
                          pathname.startsWith(item.href + "/")
                        }
                        onClick={
                          item.href === "/logout"
                            ? (e) => {
                                e.preventDefault()

                                setShowLogoutModal(true)
                              }
                            : undefined
                        }
                      />
                    </SlideLeft>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* =====================================================
            User Profile Card
        ===================================================== */}

        <SlideLeft delay={0.2}>
          <div className="mx-2 mt-8 flex cursor-default items-center gap-4 rounded-2xl border border-muted/50 bg-muted/30 p-4 transition-all hover:bg-muted/40">
            {/* Avatar */}
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
              <img
                src={profileImage}
                alt="User Avatar"
                className="h-full w-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold text-foreground">
                {profileName}
              </span>

              <span className="truncate text-sm text-muted-foreground">
                {profileEmail}
              </span>
            </div>
          </div>
        </SlideLeft>
      </aside>
    </>
  )
}
