export interface NavbarTheme {
  backgroundColor: string
  textColor: string
  activeColor: string
}

export interface NavbarBrand {
  name: string
  logo: string
  alt: string
  url: string
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