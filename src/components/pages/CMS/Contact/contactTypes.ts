import type { FieldStyle } from "../shared/FormControls"

export interface ContactMetadata {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  robots?: Record<string, any>
}

export interface ContactImage {
  url?: string
  alt?: string
  device?: "desktop" | "mobile"
}

export interface ContactButton {
  label: string
  url: string
  style?: string
  action?: string
  apiUrl?: string
}

export interface ContactVideo {
  url: string
  poster?: string
  alt?: string
  device?: "desktop" | "mobile"
}

export interface ProcessItem {
  id: string
  index: string
  title: string
  description: string
}

export interface ContactInfoItem {
  id: string
  icon?: string
  label: string
  value: string
  url?: string | null
}

export interface ContactFieldOption {
  value: string
  label: string
  default?: boolean
}

export interface ContactField {
  id: string
  name?: string
  mediaUrl?: string
  type: string
  label: string
  placeholder?: string
  required?: boolean
  row?: number
  icon?: string
  options?: ContactFieldOption[]
  pattern?: string
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  errorMessage?: string
  requiredErrorMessage?: string
  labelStyle?: FieldStyle
  nameStyle?: FieldStyle
  placeholderStyle?: FieldStyle
  requiredErrorStyle?: FieldStyle
  errorStyle?: FieldStyle
  fieldStyle?: FieldStyle
  mediaType?: "image" | "video" | "file" | "multimedia"
  allowedExtensions?: string
}

export interface ContactSectionContent {
  eyebrow?: string
  title?: string
  titleLine1?: string
  titleLine2?: string
  description?: string
  contentMultimedia?: Record<string, any>
  leftMultimedia?: Record<string, any>
  sideMultimedia?: Record<string, any>
  contactHeroEyebrowStyle?: FieldStyle
  contactHeroTitleLine1Style?: FieldStyle
  contactHeroTitleLine2Style?: FieldStyle
  contactHeroDescriptionStyle?: FieldStyle
  contactStepsTitleStyle?: FieldStyle
  contactSectionEyebrowStyle?: FieldStyle
  contactSectionTitleStyle?: FieldStyle
  contactSectionDescriptionStyle?: FieldStyle
}

export interface ContactSection {
  key: string
  type: string
  order: number
  bgColor?: string

  bgImages?: ContactImage

  bgVideos?: ContactVideo[]

  content?: ContactSectionContent

  items?: ProcessItem[] | ContactInfoItem[]

  fields?: ContactField[]

  sideImages?: ContactImage[]

  buttons?: ContactButton[]
  contactMultimedia?: Record<string, any>
}

export interface ContactPageData {
  name: string

  metadata: ContactMetadata

  data: {
    title?: string
    description?: string
    sections: ContactSection[]
  }
}

export const DEFAULT_CONTACT_SECTIONS: ContactSection[] = [
  {
    key: "contact_hero",
    type: "pageHero",
    order: 1,
    bgColor: "#24351C",
    bgImages: {
      alt: "Aerial view of Mostar and the surrounding Balkan landscape",
      url: "https://images.unsplash.com/photo-1623536167776-922ccb1ff749?auto=format&fit=crop&w=2400&q=85",
      device: "desktop",
    },
    content: {
      eyebrow: "GET IN TOUCH",
      titleLine1: "Let's plan",
      titleLine2: "your journey",
      description:
        "Tell us about your travel plans and let us help you create an unforgettable experience.",
    },
  },
  {
    key: "process_steps",
    type: "stepList",
    order: 2,
    bgColor: "#FDF8F1",
    content: {
      title: "How it works",
    },
    items: [
      {
        id: "1",
        index: "01",
        title: "Tell us your plans",
        description:
          "Share your destination, dates and what kind of experience you are looking for.",
      },
      {
        id: "2",
        index: "02",
        title: "We create your journey",
        description:
          "Our team carefully plans a personalised itinerary around your interests.",
      },
      {
        id: "3",
        index: "03",
        title: "Enjoy the experience",
        description:
          "Everything is prepared so you can simply arrive and enjoy your journey.",
      },
    ] as ProcessItem[],
  },
  {
    key: "inquiry_form",
    type: "contactForm",
    order: 3,
    bgColor: "#F5F0E8",
    content: {
      eyebrow: "START A CONVERSATION",
      title: "Tell us what you have in mind",
    },
    fields: [
      {
        id: "name",
        type: "text",
        label: "Name",
        placeholder: "Your name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        placeholder: "Your email",
        required: true,
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        placeholder: "Tell us about your journey...",
        required: true,
      },
    ],
    buttons: [
      {
        label: "Send inquiry",
        url: "#",
      },
    ],
    sideImages: [
      {
        url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=85",
        alt: "Historic architecture and landscape",
      },
    ],
  },
  {
    key: "personal_approach",
    type: "textImageFeature",
    order: 4,
    bgColor: "#FDF8F1",
    content: {
      eyebrow: "A PERSONAL APPROACH",
      title: "Travel designed around you",
      description:
        "We craft every itinerary with attention to detail and authentic local experiences.",
    },
    sideImages: [
      {
        url: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=85",
        alt: "Beautiful travel destination",
      },
    ],
  },
  {
    key: "contact_info",
    type: "infoColumns",
    order: 5,
    bgColor: "#FBF9F5",
    items: [
      {
        id: "email",
        label: "EMAIL",
        value: "hello@example.com",
        url: "mailto:hello@example.com",
      },
      {
        id: "phone",
        label: "PHONE",
        value: "+00 123 456 789",
        url: "tel:+00123456789",
      },
      {
        id: "location",
        label: "LOCATION",
        value: "Mostar, Bosnia & Herzegovina",
      },
    ] as ContactInfoItem[],
  },
  {
    key: "final_cta",
    type: "ctaBanner",
    order: 6,
    bgColor: "#FBF9F5",
    content: {
      title: "Ready to start your journey?",
      description: "Let's create something unforgettable together.",
    },
    buttons: [
      {
        label: "Start planning",
        url: "#",
      },
    ],
  },
]

