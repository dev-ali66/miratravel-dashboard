import { THEME_COLORS } from "@/config/theme"
import type { ExperienceData } from "../experienceTypes"

export const emptyCanonicalMultimedia = {
  show: "color" as const,
  image: {
    url: "",
    alt: "",
    opacity: 100,
    overlayColor: THEME_COLORS.overlayBlack,
    overlayOpacity: 0,
    width: "100%",
    height: "auto",
    aspectRatio: "auto",
    fit: "cover",
  },
  video: {
    url: "",
    alt: "",
    autoplay: true,
    loop: true,
    muted: true,
    opacity: 100,
    overlayColor: THEME_COLORS.overlayBlack,
    overlayOpacity: 0,
    width: "100%",
    height: "auto",
    aspectRatio: "auto",
    fit: "cover",
  },
  color: {
    color: THEME_COLORS.bgHeroDark,
    opacity: 100,
    width: "100%",
    height: "100%",
    aspectRatio: "auto",
  },
}

export const emptyHero = {
  breadcrumb: {
    value: "EXPERIENCES",
    textColor: THEME_COLORS.accentLight,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "",
    textColor: THEME_COLORS.white,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  subtitle: {
    value: "",
    textColor: THEME_COLORS.mediaPlaceholder,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "",
    textColor: THEME_COLORS.lightText,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  isCenter: false,
  buttons: [],
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "video" as const,
    color: {
      color: THEME_COLORS.bgHeroDark,
      opacity: 100,
      width: "100%",
      height: "100%",
      aspectRatio: "auto",
    },
  },
}

export const emptyTheExperience = {
  label: {
    value: "THE EXPERIENCE",
    textColor: THEME_COLORS.accent,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  summary: {
    value: "",
    textColor: THEME_COLORS.muted,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  narrative: {
    value: "",
    textColor: THEME_COLORS.body,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  quote: {
    value: "",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  imageMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "image" as const,
    image: {
      ...emptyCanonicalMultimedia.image,
      url: "",
      alt: "The Experience",
    },
  },
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "color" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: THEME_COLORS.white,
    },
  },
}

export const emptyHighlights = {
  label: {
    value: "KEY HIGHLIGHTS",
    textColor: THEME_COLORS.accent,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "What makes this unforgettable",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  items: [
    {
      id: "h1",
      badge: "Highlight 01",
      title: {
        value: "",
        textColor: THEME_COLORS.primary,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: THEME_COLORS.muted,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
    {
      id: "h2",
      badge: "Highlight 02",
      title: {
        value: "",
        textColor: THEME_COLORS.primary,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: THEME_COLORS.muted,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
    {
      id: "h3",
      badge: "Highlight 03",
      title: {
        value: "",
        textColor: THEME_COLORS.primary,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "",
        textColor: THEME_COLORS.muted,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
  ],
}

export const emptyPracticalInfo = {
  duration: {
    value: "Half Day (~4 hours)",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  season: {
    value: "May – October",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  activityLevel: {
    value: "Moderate — comfortable walking pace",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  groupSize: {
    value: "Private (2-8 guests)",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  locationNotes: {
    value: "Direct pick-up from your accommodation or dedicated rendezvous point.",
    textColor: THEME_COLORS.muted,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
}

export const emptyMiraTouch = {
  label: {
    value: "THE MIRA TOUCH",
    textColor: THEME_COLORS.accent,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "Distinction, Privacy & Insider Access",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "Every MIRA experience is curated with private access, master hosts, and bespoke comfort designed around your journey rhythm.",
    textColor: THEME_COLORS.muted,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  items: [
    {
      title: {
        value: "Private Insider Access",
        textColor: THEME_COLORS.primary,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "Behind-the-scenes access unavailable to general visitors.",
        textColor: THEME_COLORS.muted,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
    {
      title: {
        value: "Local Master Guide",
        textColor: THEME_COLORS.primary,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
      description: {
        value: "Accompanied by dedicated specialists and respected local storytellers.",
        textColor: THEME_COLORS.muted,
        textOpacity: 1,
        backgroundColor: null,
        backgroundOpacity: 1,
      },
    },
  ],
  imageMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "image" as const,
    image: {
      ...emptyCanonicalMultimedia.image,
      url: "",
      alt: "The MIRA Touch",
    },
  },
}

export const emptyEnquiryCta = {
  title: {
    value: "Include This Experience in Your Journey",
    textColor: THEME_COLORS.white,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  subtitle: {
    value: "Our travel architects will seamlessly integrate this into your bespoke itinerary.",
    textColor: THEME_COLORS.mediaPlaceholder,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  badgeText: "EXPERIENCE RESERVATION",
  primaryButtonText: "Include in My Journey",
  secondaryButtonText: "Enquire About This Experience",
  note: {
    value: "Available exclusively for MIRA bespoke journeys.",
    textColor: THEME_COLORS.lightMuted,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "color" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: THEME_COLORS.primary,
    },
  },
}

export const emptyEssence = {
  label: {
    value: "EXPERIENCE ESSENCE",
    textColor: THEME_COLORS.accent,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  title: {
    value: "",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  paragraphs: {
    value: "",
    textColor: THEME_COLORS.muted,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  quote: {
    value: "",
    textColor: THEME_COLORS.quote,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  stat: {
    statValue: {
      value: "",
      textColor: THEME_COLORS.white,
      textOpacity: 1,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    statLabel: {
      value: "",
      textColor: THEME_COLORS.white,
      textOpacity: 0.75,
      backgroundColor: null,
      backgroundOpacity: 1,
    },
    statBadgeBg: THEME_COLORS.accentMuted,
  },
  imageMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "image" as const,
    image: {
      ...emptyCanonicalMultimedia.image,
      url: "",
      alt: "Featured Experience",
      height: "100%",
    },
    color: {
      ...emptyCanonicalMultimedia.color,
      color: THEME_COLORS.bgSubdued,
    },
  },
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "color" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: THEME_COLORS.bgIvory,
    },
  },
}

export const emptyFaq = {
  title: {
    value: "Frequently Asked Questions",
    textColor: THEME_COLORS.primary,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  imageMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "image" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: THEME_COLORS.bgSubdued,
    },
  },
  backgroundMultimedia: {
    ...emptyCanonicalMultimedia,
    show: "color" as const,
    color: {
      ...emptyCanonicalMultimedia.color,
      color: THEME_COLORS.bgSand,
    },
  },
  items: [],
}

export const emptySeo = {
  seo: {
    title: "",
    description: "",
    keywords: [] as string[],
    canonicalUrl: "",
    robots: {
      index: true,
      follow: true,
    },
  },
}

export const emptyExperience: ExperienceData = {
  name: "",
  status: "PUBLISHED",
  featured: false,
  primaryType: "CULTURE_HERITAGE",
  secondaryTypes: [],
  attributes: ["PRIVATE"],
  price: 0,
  currency: "EUR",
  priceType: "PER_PERSON",
  countries: [],
  regions: [],
  places: [],
  subtitle: "",
  summary: "",
  theExperience: emptyTheExperience,
  highlights: emptyHighlights,
  practicalInfo: emptyPracticalInfo,
  miraTouch: emptyMiraTouch,
  enquiryCta: emptyEnquiryCta,
  journeys: [],
  stories: [],
  hero: emptyHero,
  essence: emptyEssence,
  faq: emptyFaq,
  metadata: emptySeo,
  geoData: null,
}
