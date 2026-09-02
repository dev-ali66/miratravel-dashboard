import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useMe } from "@/hooks/auth/useMe";
import { cn } from "@/lib/utils";
import { SlideLeft } from "@/components/animation";

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
} from "lucide-react";

import { LogoutModal } from "./LogoutModal";

const images = {
  logo_black: "/logo_black.png",
  logo: "/logo.png",
};

const defaultAvatar = "https://i.pravatar.cc/150?u=default";

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
  faq: HelpCircle,
  requests: Inbox,
  privacy: Shield,
  terms: ScrollText,
};

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
];

/* =========================================================
   Types
========================================================= */

export interface NavItemProps {
  href: string;
  icon: keyof typeof iconMap;
  label: string;
  isActive?: boolean;
}

export interface SectionProps {
  title: string;
  items: NavItemProps[];
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
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const Icon = iconMap[icon];

  const className = cn(
    "flex items-center gap-3 px-4 py-4 rounded-lg transition-all duration-200 group relative w-full text-left",
    isActive
      ? "text-primary font-semibold"
      : "text-muted-foreground hover:bg-muted/50"
  );

  const content = (
    <>
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-[oklch(0.588_0.158_241.966/0.08)] rounded-lg z-0"
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.6,
          }}
        />
      )}

      <Icon
        className={cn(
          "w-5 h-5 relative z-10",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground"
        )}
      />

      <span
        className={cn(
          "text-sm font-medium transition-colors relative z-10",
          isActive
            ? "text-primary"
            : "group-hover:text-foreground"
        )}
      >
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={className}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={href}
      className={className}
    >
      {content}
    </Link>
  );
};

/* =========================================================
   CMS Dropdown
========================================================= */

const CMSDropdown = ({
  isOpen,
  setIsOpen,
  pathname,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pathname: string;
}) => {
  const isCMSActive = pathname.startsWith("/cms");

  return (
    <div className="flex flex-col">

      {/* CMS Parent */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex items-center justify-between w-full px-4 py-4 rounded-lg transition-all duration-200 group relative text-left",
          isCMSActive
            ? "text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted/50"
        )}
      >
        {/* Left side */}
        <div className="flex items-center gap-3">

          {isCMSActive && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-[oklch(0.588_0.158_241.966/0.08)] rounded-lg z-0"
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.6,
              }}
            />
          )}

          <FileText
            className={cn(
              "w-5 h-5 relative z-10",
              isCMSActive
                ? "text-primary"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />

          <span
            className={cn(
              "text-sm font-medium relative z-10",
              isCMSActive
                ? "text-primary"
                : "group-hover:text-foreground"
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
            isCMSActive
              ? "text-primary"
              : "text-muted-foreground"
          )}
        />
      </button>

      {/* CMS Children */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">

          <div className="ml-6 pl-4 mt-1 border-l border-border/70 flex flex-col gap-1">

            {cmsItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200 group",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
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

                  <span>
                    {item.label}
                  </span>
                </Link>
              );
            })}

          </div>

        </div>
      </div>
    </div>
  );
};

/* =========================================================
   Sidebar
========================================================= */

export default function Sidebar({
  sections = [],
}: {
  sections?: SectionProps[];
}) {
  const location = useLocation();
  const pathname = location.pathname;

  const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  /*
   * CMS automatically opens when current route
   * starts with /cms
   */
  const isCMSRoute = pathname.startsWith("/cms");

  const [cmsOpen, setCmsOpen] =
    useState(isCMSRoute);

  /*
   * If user navigates directly to /cms/*
   * keep dropdown open.
   */
  useEffect(() => {
    if (isCMSRoute) {
      setCmsOpen(true);
    }
  }, [isCMSRoute]);

  const { data: user } = useMe();

  /* =========================================================
     User Profile
  ========================================================= */

  const profileName = user?.userPersonalInfo?.firstName
    ? `${user.userPersonalInfo.firstName} ${user.userPersonalInfo.lastName || ""
    }`
    : user?.email?.split("@")[0] || "Guest";

  const profileEmail = user?.email || "No email";

  const profileImage =
    user?.userPersonalInfo?.photoUrl?.[0] ||
    defaultAvatar;

  return (
    <>
      {/* Logout Modal */}
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />

      <aside
        className="
          flex-2
          border-r
          border-dashed
          border-border
          flex
          flex-col
          px-4
          py-8
          sticky
          top-0
          h-screen
          overflow-y-auto
          shrink-0
          bg-background/50
          backdrop-blur-xl
          min-w-70
        "
      >

        {/* =====================================================
            Logo
        ===================================================== */}

        <SlideLeft
          delay={0.1}
          className="px-4 mb-10"
        >
          <Link to="/">
            {/* Light mode */}
            <img
              src={images.logo_black}
              alt="Logo"
              width={140}
              height={40}
              className="
                w-auto
                h-8
                object-contain
                dark:hidden
                block
              "
            />

            {/* Dark mode */}
            <img
              src={images.logo}
              alt="Logo"
              width={140}
              height={40}
              className="
                w-auto
                h-8
                object-contain
                dark:block
                hidden
              "
            />
          </Link>
        </SlideLeft>


        {/* =====================================================
            Navigation Sections
        ===================================================== */}

        <div className="flex flex-col justify-between h-full gap-10">

          {sections?.map((section, sIdx) => (

            <div
              key={section.title}
              className="flex flex-col gap-2"
            >

              {/* Section Title */}
              <SlideLeft
                delay={0.3 + sIdx * 0.1}
              >
                <h3 className="
                  px-4
                  text-xs
                  font-bold
                  text-foreground
                  tracking-wider
                ">
                  {section.title}
                </h3>
              </SlideLeft>


              {/* Navigation */}
              <nav className="flex flex-col gap-1">

                {section.items.map((item, iIdx) => {

                  const isCMSItem =
                    item.href === "/cms";

                  /*
                   * CMS gets special dropdown treatment
                   */
                  if (isCMSItem) {
                    return (
                      <SlideLeft
                        key={item.href}
                        delay={
                          0.4 +
                          sIdx * 0.1 +
                          iIdx * 0.05
                        }
                      >
                        <CMSDropdown
                          isOpen={cmsOpen}
                          setIsOpen={setCmsOpen}
                          pathname={pathname}
                        />
                      </SlideLeft>
                    );
                  }


                  /* =================================================
                     Normal Navigation Item
                  ================================================= */

                  return (
                    <SlideLeft
                      key={item.href}
                      delay={
                        0.4 +
                        sIdx * 0.1 +
                        iIdx * 0.05
                      }
                    >
                      <NavLink
                        {...item}
                        isActive={
                          pathname === item.href ||
                          pathname.startsWith(
                            item.href + "/"
                          )
                        }
                        onClick={
                          item.href === "/logout"
                            ? (e) => {
                              e.preventDefault();

                              setShowLogoutModal(
                                true
                              );
                            }
                            : undefined
                        }
                      />
                    </SlideLeft>
                  );
                })}

              </nav>

            </div>
          ))}

        </div>


        {/* =====================================================
            User Profile Card
        ===================================================== */}

        <SlideLeft delay={0.2}>
          <div
            className="
              mx-2
              mt-8
              p-4
              bg-muted/30
              rounded-2xl
              flex
              items-center
              gap-4
              transition-all
              hover:bg-muted/40
              cursor-default
              border
              border-muted/50
            "
          >

            {/* Avatar */}
            <div
              className="
                relative
                w-10
                h-10
                overflow-hidden
                rounded-full
                ring-2
                ring-primary/10
                ring-offset-2
                ring-offset-background
                shrink-0
              "
            >
              <img
                src={profileImage}
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            </div>


            {/* User Info */}
            <div className="
              flex
              flex-col
              overflow-hidden
            ">
              <span
                className="
                  text-sm
                  font-bold
                  text-foreground
                  truncate
                "
              >
                {profileName}
              </span>

              <span
                className="
                  text-sm
                  text-muted-foreground
                  truncate
                "
              >
                {profileEmail}
              </span>
            </div>

          </div>
        </SlideLeft>

      </aside>
    </>
  );
}