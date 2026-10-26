import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar, { type SectionProps } from "./Sidebar"
import { Navbar } from "./Navbar"

export function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const sections: SectionProps[] = [
    {
      title: "Operations & Bookings",
      items: [
        { href: "/", label: "Dashboard", icon: "dashboard" },
        { href: "/user", label: "Users", icon: "user" },
        { href: "/bookings", label: "Bookings", icon: "bookings" as any },
        { href: "/inquiries", label: "Inquiries", icon: "concierge" as any },
        { href: "/requests", label: "Journey Requests", icon: "requests" as any },
        { href: "/reviews", label: "Reviews & Ratings", icon: "reviews" as any },
        { href: "/newsletter", label: "Newsletter Subscribers", icon: "newsletter" as any },
      ],
    },
    {
      title: "Content & Editorial",
      items: [
        { href: "/cms", label: "CMS Pages", icon: "cms" },
        { href: "/media-library", label: "Media Library", icon: "media" as any },
        { href: "/journeys", label: "Journeys", icon: "journeys" as any },
        { href: "/location", label: "Locations", icon: "locations" },
        { href: "/experiences", label: "Experiences", icon: "experiences" as any },
        { href: "/stories", label: "Stories", icon: "cms" as any },
      ],
    },
    // {
    //   title: "Marketing & Growth",
    //   items: [
    //     { href: "/promotions", label: "Promotions & Vouchers", icon: "promotions" as any },
    //     { href: "/notifications", label: "Notification Triggers", icon: "notifications" as any },
    //   ],
    // },
    {
      title: "System & Governance",
      items: [
        { href: "/system-health", label: "System Health", icon: "health" as any },
        { href: "/audit-logs", label: "Audit Logs", icon: "audit" as any },
        { href: "/payment-config", label: "Payment Config", icon: "paymentConfig" as any },
        { href: "/site-settings", label: "Site Settings", icon: "settings" as any },
        { href: "/iam", label: "Roles & Access", icon: "iam" as any },
      ],
    },
    {
      title: "Compliance & Legal",
      items: [
        {
          href: "/privacy-policy",
          label: "Privacy Policy",
          icon: "privacy" as any,
        },
        {
          href: "/terms-of-service",
          label: "Terms of Service",
          icon: "terms" as any,
        },
      ],
    },
  ]
  return (
    <div className="flex min-h-svh flex-col bg-muted/10">
      <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
      <div className="flex flex-1 min-w-0 pt-14">
        <Sidebar
          sections={sections}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 px-2 md:ml-[280px] pb-6 sm:pb-8">
          <Outlet />
        </main>
      </div>


      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}


