import { Outlet } from "react-router-dom"
import Sidebar, { type SectionProps } from "./Sidebar"

export function RootLayout() {
  const sections: SectionProps[] = [
    {
      title: "Menu Principal",
      items: [
        { href: "/", label: "Dashboard", icon: "dashboard" },
        { href: "/user", label: "User", icon: "user" },
        { href: "/requests", label: "Requests", icon: "requests" as any },
        { href: "/cms", label: "CMS", icon: "cms" },
        { href: "/location", label: "Locations", icon: "locations" },
        { href: "/journeys", label: "Journeys", icon: "journeys" as any },
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
