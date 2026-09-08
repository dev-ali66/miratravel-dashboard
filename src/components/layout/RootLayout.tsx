import { Outlet } from "react-router-dom"
import Sidebar, { type SectionProps } from "./Sidebar"

export function RootLayout() {
  const sections: SectionProps[] = [
    {
      title: "Operations & Bookings",
      items: [
        { href: "/", label: "Dashboard", icon: "dashboard" },
        { href: "/bookings", label: "Bookings", icon: "bookings" as any },
        { href: "/concierge", label: "Concierge Inquiries", icon: "concierge" as any },
        { href: "/user", label: "Travelers & Users", icon: "user" },
        { href: "/reviews", label: "Reviews & Ratings", icon: "reviews" as any },
      ],
    },
    {
      title: "Content & Editorial",
      items: [
        { href: "/cms", label: "CMS Pages", icon: "cms" },
        { href: "/location", label: "Locations", icon: "locations" },
        { href: "/journeys", label: "Journeys", icon: "journeys" as any },
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
    {
      title: "Account",
      items: [{ href: "/logout", label: "Logout", icon: "logout" }],
    },
  ]
  return (
    <div className="flex min-h-svh">
      <div className="flex-1">
        <Sidebar sections={sections} />
      </div>
      <main className="flex w-full flex-col p-8">
        <Outlet />
      </main>
    </div>
  )
}
