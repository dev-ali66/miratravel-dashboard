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
        { href: "/bookings", label: "Bookings", icon: "bookings" as any },
        { href: "/requests", label: "Journey Requests", icon: "requests" as any },
        { href: "/concierge", label: "Concierge Inquiries", icon: "concierge" as any },
        { href: "/user", label: "Travelers & Users", icon: "user" },
        { href: "/reviews", label: "Reviews & Ratings", icon: "reviews" as any },
      ],
    },
    {
      title: "Content & Editorial",
      items: [
        { href: "/cms", label: "CMS Pages", icon: "cms" },
        { href: "/journeys", label: "Journeys", icon: "journeys" as any },
        { href: "/location", label: "Locations", icon: "locations" },
        { href: "/stories", label: "Stories", icon: "cms" as any },
      ],
    },
    {
      title: "Marketing & Growth",
      items: [
        { href: "/promotions", label: "Promotions & Vouchers", icon: "promotions" as any },
        { href: "/newsletter", label: "Newsletter Subscribers", icon: "newsletter" as any },
        { href: "/notifications", label: "Notification Triggers", icon: "notifications" as any },
      ],
    },
    {
      title: "System & Governance",
      items: [
        { href: "/system-health", label: "System Health", icon: "health" as any },
        { href: "/audit-logs", label: "Audit Logs", icon: "audit" as any },
        { href: "/payment-config", label: "Payment Rules & Config", icon: "paymentConfig" as any },
        { href: "/settings", label: "Site Settings", icon: "settings" as any },
        { href: "/iam", label: "IAM Roles & Access", icon: "iam" as any },
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
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar 
          sections={sections} 
          isMobileOpen={isMobileMenuOpen} 
          onMobileClose={() => setIsMobileMenuOpen(false)} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full md:pl-[280px]">
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


