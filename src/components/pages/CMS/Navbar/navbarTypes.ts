import type { FieldStyle } from "../shared/FormControls"

export interface NavbarTheme {
  backgroundColor: string
  textColor: string
  activeColor: string
}

export interface NavbarBrandMultimedia {
  type?: "image" | "video" | "color"
  color?: string
  imageData?: NavbarBrandMultimedia
  videoData?: NavbarBrandMultimedia
  url?: string
  alt?: string
  opacity?: number
  overlayColor?: string
  overlayOpacity?: number
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

export interface NavbarBrand {
  name: string
  navbarBrandNameStyle?: FieldStyle
  logo: string
  alt: string
  navbarBrandLogoAltStyle?: FieldStyle
  url: string
  navbarBrandUrlStyle?: FieldStyle
  navbarBrandMultimedia?: NavbarBrandMultimedia
}

export interface NavbarContent {
  brand: NavbarBrand
}

export interface NavbarPageData {
  name: string
  slug?: string
  metadata: {
    title: string
    description: string
  }
  data: {
    page: "navbar"
    theme: NavbarTheme
    content: NavbarContent
  }
}
