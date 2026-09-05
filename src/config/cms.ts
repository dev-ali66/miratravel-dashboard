import {
  Home,
  Menu,
  PanelBottom,
  CircleHelp,
  Mail,
  Megaphone,
} from "lucide-react"

export const CMS_ITEMS = [
  {
    label: "Home",
    slug: "home",
    icon: Home,
  },
  {
    label: "Navbar",
    slug: "navbar",
    icon: Menu,
  },
  {
    label: "Footer",
    slug: "footer",
    icon: PanelBottom,
  },
  {
    label: "FAQ",
    slug: "faq",
    icon: CircleHelp,
  },
  {
    label: "Contact Us",
    slug: "contact-us",
    icon: Mail,
  },
  {
    label: "CTA",
    slug: "cta",
    icon: Megaphone,
  },
] as const
