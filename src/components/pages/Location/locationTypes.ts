export type ExperienceCard = {
  id: number
  image: string
  imageMultimedia?: Record<string, any>
  price: string
  title: string
  category: string
  subtitle: string
  action_text: string
  button?: {
    label?: string
    url?: string
    style?: string
    backgroundColor?: string
    textColor?: string
  }
  buttons?: Array<{
    label: string
    url: string
    style?: string
    backgroundColor?: string
    textColor?: string
  }>
  description: string
}

export type AccommodationStayItem = {
  id: string | number
  image?: string
  imageMultimedia?: Record<string, any>
  step?: string
  stepStyle?: Record<string, any>
  day?: number
  duration?: string
  durationStyle?: Record<string, any>
  city?: string
  cityStyle?: Record<string, any>
  location?: string
  locationStyle?: Record<string, any>
  subtitle?: string
  subtitleStyle?: Record<string, any>
  stayType?: string
  stayTypeStyle?: Record<string, any>
  confirmedBy?: string
  confirmationBadge?: string
  confirmedStyle?: Record<string, any>
  description?: string
  descriptionStyle?: Record<string, any>
  nights?: number
  button?: {
    label?: string
    url?: string
    style?: string
    backgroundColor?: string
    textColor?: string
  }
  buttons?: Array<{
    label: string
    url: string
    style?: string
    backgroundColor?: string
    textColor?: string
  }>
}

export type PracticalItem = {
  id: string
  title: string
  titleStyle?: Record<string, any>
  content: string
  contentStyle?: Record<string, any>
  is_expanded: boolean
}

export type FAQItem = {
  id: number
  question: string
  answer: string
}

export type GalleryItem = {
  alt: string
  url: string
  imageMultimedia?: Record<string, any>
}

export type GuideArticle = {
  id: string
  number?: string
  numberStyle?: Record<string, any>
  category?: string
  categoryStyle?: Record<string, any>
  title: string
  titleStyle?: Record<string, any>
  description?: string
  descriptionStyle?: Record<string, any>
  href?: string
  button?: {
    label?: string
    url?: string
    style?: string
    backgroundColor?: string
    textColor?: string
  }
  buttons?: Array<{
    label: string
    url: string
    style?: string
    backgroundColor?: string
    textColor?: string
  }>
  thumbnail: string
  thumbnailMultimedia?: Record<string, any>
}

export const LOCATION_TYPES = [
  "CONTINENT",
  "SUBCONTINENT",
  "REGION",
  "COUNTRY",
  "ADMINISTRATIVE_AREA",
  "CITY",
  "TOWN",
  "VILLAGE",
  "DESTINATION",
  "PLACE",
  "LANDMARK",
] as const

export type LocationType = (typeof LOCATION_TYPES)[number]

export type LocationData = {
  id?: string

  name: string
  slug: string
  type: string
  parentId?: string | null

  /**
   * Included by the backend on every GET /locations response
   * (Prisma `include: { parent: true, children: true }`), so
   * edit-mode can resolve/display the current parent's name
   * without an extra request.
   */
  parent?: {
    id: string
    name: string
    type: string
  } | null

  children?: {
    id: string
    name: string
    type: string
  }[]

  createdAt?: string
  updatedAt?: string

  geoData: {
    area: {
      unit: string
      value: number
    }
    mapZoom: number
    latitude: number
    longitude: number
    timezone: string
  }

  metadata: {
    seo: {
      title: string
      keywords: string[]
      description: string
      canonicalUrl: string
      robots?: {
        index?: boolean
        follow?: boolean
      }
    }
  }

  data: {
    name: string
    title: string
    subtitle: string
    description: string
    shortDescription: string

    hero: {
      title: string
      description: string
      breadcrumb: string
      background_image: string
      video?: string
      showVideo?: boolean
      titleStyle?: Record<string, any> | null
      breadcrumbStyle?: Record<string, any> | null
      descriptionStyle?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
      button: {
        name: string
        url: string
      }
      buttons?: Array<{
        label: string
        url: string
        style?: string
        backgroundColor?: string
        textColor?: string
      }>
    }

    card: {
      title: string
      subtitle: string
      background_image: string
      titleStyle?: Record<string, any> | null
      subtitleStyle?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
      button: {
        label: string
        url: string
      }
    }

    why: {
      subtitle: string
      title: string
      description_paragraphs: string[]
      image: string
      imageMultimedia?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
      subtitleStyle?: Record<string, any> | null
      tags: string[]
    }

    info: {
      headline: string
      description: string
      headlineStyle?: Record<string, any> | null
      descriptionStyle?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
    }

    sharedInfo?: {
      text?: string
      textStyle?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
      style?: Record<string, any> | null
    }

    regionGlance?: {
      label: string
      title: string
      description: string
      labelStyle?: Record<string, any> | null
      descriptionStyle?: Record<string, any> | null
      style?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
    }

    regionCharacter?: {
      label: string
      title: string
      items: Array<{
        id: string
        icon: string
        iconImage?: string
        multimedia?: Record<string, any> | null
        iconMultimedia?: Record<string, any> | null
        title: string
        description: string
        href: string
        linkText: string
        titleStyle?: Record<string, any> | null
        descriptionStyle?: Record<string, any> | null
      }>
      style?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
    }

    /**
     * Mirrors the real frontend `<Essence />` and
     * `<RegionEssence />` component props (label/title/
     * paragraphs/quote/imageSrc/imageAlt/statValue/statLabel
     * and optional facts). `style` is CMS-only: per-element
     * color/font-size overrides, editable in EssenceForm and
     * rendered by EssencePreview.
     */
    essence: {
      label: string
      labelStyle?: Record<string, any> | null
      title: string
      titleStyle?: Record<string, any> | null
      paragraphs: string[]
      paragraphStyles?: Array<Record<string, any> | null>
      quote: string
      quoteStyle?: Record<string, any> | null
      imageSrc: string
      imageAlt: string
      imageMultimedia?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
      statValue: string
      statLabel: string
      facts?: Array<{
        label: string
        value: string
        description: string
      }>

      style?: {
        sectionBackgroundColor?: string
        label?: {
          textColor?: string
          fontSize?: string
        }
        title?: {
          textColor?: string
          fontSize?: string
        }
        paragraph?: {
          textColor?: string
          fontSize?: string
        }
        quote?: {
          textColor?: string
          fontSize?: string
        }
        statBadge?: {
          backgroundColor?: string
          textColor?: string
        }
      } | null
    }

    statistics: {
      facts?: Array<{
        label: string
        labelStyle?: Record<string, any> | null
        value: string
        valueStyle?: Record<string, any> | null
        description: string
        descriptionStyle?: Record<string, any> | null
        media?: Record<string, any> | null
        image?: string
        icon?: string
      }>
      area: {
        value: number
        unit: string
      }
      elevation: {
        value: number
        unit: string
      }
      population?: {
        value: number
        year: number
      }
      style?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
    }

    climate: {
      types: string[]
      description: string
    }

    culture: {
      cuisine: string[]
      description: string
      majorLanguages: string[]
      majorReligions: string[]
      famousFestivals: string[]
      style?: Record<string, any> | null
    }

    safety: {
      description: string
      emergencyNumber: string
    }

    geography: {
      highestPoint: {
        name: string
        unit: string
        elevation: number
      }
      majorLandscapes: string[]
    }

    travelInfo: {
      beforeTravel?: {
        label: string
        title: string
        image: string
        imageAlt: string
        imageMultimedia?: Record<string, any> | null
        backgroundMultimedia?: Record<string, any> | null
        items: Array<{
          id: string
          title: string
          content: string
          titleStyle?: Record<string, any> | null
        }>
        style?: Record<string, any> | null
      }

      visa: {
        description: string
      }

      currency: {
        description: string
        majorCurrency: string
      }

      bestTimeToVisit: {
        summer: string
        winter: string
        general: string
      }

      popularTransportation: string[]
    }

    experiences: {
      title: string
      location: string
      description: string
      load_more_button: string
      loadMoreButton?: {
        label?: string
        url?: string
        style?: string
        backgroundColor?: string
        textColor?: string
      } | null
      loadMoreButtonStyle?: Record<string, any> | null
      titleStyle?: Record<string, any> | null
      locationStyle?: Record<string, any> | null
      descriptionStyle?: Record<string, any> | null
      buttons?: Array<{
        label: string
        url: string
        style?: string
        backgroundColor?: string
        textColor?: string
      }>
      seasonInfo?: string
      seasonLocation?: string

      featured_experience: {
        image: string
        imageMultimedia?: Record<string, any> | null
        title: string
        category: string
        duration?: string
        subtitle: string
        action_text: string
        button?: {
          label?: string
          url?: string
          style?: string
          backgroundColor?: string
          textColor?: string
        } | null
        buttons?: Array<{
          label: string
          url: string
          style?: string
          backgroundColor?: string
          textColor?: string
        }>
      }

      cards: ExperienceCard[]

      footer?: {
        note: string
        region: string
      }
    }

    practical_information: {
      title: string
      sub_heading: string
      side_image: string
      sideImageMultimedia?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
      accordion_items: PracticalItem[]
    }

    faq_section: {
      image: string
      imageMultimedia?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
      title: string
      questions: FAQItem[]
    }

    imageGalary: GalleryItem[]

    local_guide: {
      title: string
      sub_heading: string
      main_image: string
      mainImageMultimedia?: Record<string, any> | null
      articles: GuideArticle[]
    }

    travel_insights: {
      title: string
      sub_heading: string
      main_image: string
      mainImageMultimedia?: Record<string, any> | null
      articles: GuideArticle[]
    }

    accommodation_stays?: {
      badge?: string
      badgeStyle?: Record<string, any> | null
      title?: string
      titleStyle?: Record<string, any> | null
      description?: string
      descriptionStyle?: Record<string, any> | null
      backgroundMultimedia?: Record<string, any> | null
      stays?: AccommodationStayItem[]
    }

    videoGalary: {
      alt: string
      url: string
      thumbnail: string
      multimedia?: Record<string, any> | null
    }
  }
}
