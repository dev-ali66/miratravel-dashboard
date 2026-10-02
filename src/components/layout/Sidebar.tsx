import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
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
  PanelBottom,
  Mail,
  LocateIcon,
  Compass,
  CalendarDays,
  Activity,
  History,
  Sliders,
  ShieldCheck,
  Server,
  Sparkles,
  Star,
  Tag,
  Send,
  Bell,
  Info,
} from "lucide-react"

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
  bookings: CalendarDays,
  audit: History,
  health: Activity,
  paymentConfig: Sliders,
  iam: ShieldCheck,
  server: Server,
  concierge: Sparkles,
  reviews: Star,
  promotions: Tag,
  newsletter: Send,
  notifications: Bell,
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
    label: "About Us",
    href: "/cms/about-us",
    icon: Info,
  },
  {
    label: "Journey CMS",
    href: "/cms/journey",
    icon: Compass,
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
    label: "Footer",
    href: "/cms/footer",
    icon: PanelBottom,
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
  isMobileOpen,
  onMobileClose,
}: {
  sections?: SectionProps[]
  isMobileOpen?: boolean
  onMobileClose?: () => void
}) {
  const location = useLocation()
  const pathname = location.pathname

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

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (onMobileClose) onMobileClose()
  }, [pathname, onMobileClose])

  return (
    <aside
      className={cn(
        "fixed top-16 bottom-0 left-0 z-40 w-[280px] flex-col border-r border-dashed border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 py-6 px-4 transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto hidden md:flex",
        isMobileOpen ? "translate-x-0 flex" : "-translate-x-full"
      )}
    >
      {/* Navigation Sections */}
      <div className="flex flex-col gap-8 pb-10">
        {sections?.map((section, sIdx) => (
          <div key={section.title} className="flex flex-col gap-2">
            {/* Section Title */}
            <SlideLeft delay={0.1 + sIdx * 0.05}>
              <h3 className="px-3 text-xs font-bold tracking-wider text-muted-foreground uppercase">
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
                      delay={0.15 + sIdx * 0.05 + iIdx * 0.03}
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
                    delay={0.15 + sIdx * 0.05 + iIdx * 0.03}
                  >
                    <NavLink
                      {...item}
                      isActive={
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href + "/"))
                      }
                    />
                  </SlideLeft>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}
