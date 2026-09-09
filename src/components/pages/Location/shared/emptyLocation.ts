/* =====================================================
   LOCATION — EMPTY / DEFAULT DRAFT
   Full default skeleton covering every structured
   `data` section plus geoData/metadata. Ensures all
   multimedia and style fields are explicitly declared as
   `null` so no fields are dropped during JSON serialization.
===================================================== */

import type { LocationData } from "../locationTypes"

export const emptyLocation: LocationData = {
  name: "",
  slug: "",
  type: "PLACE",
  parentId: null,

  geoData: {
    area: {
      unit: "km²",
      value: 0,
    },
    mapZoom: 6,
    latitude: 0,
    longitude: 0,
    timezone: "",
  },

  metadata: {
    seo: {
      title: "",
      keywords: [],
      description: "",
      canonicalUrl: "",
      robots: {
        index: true,
        follow: true,
      },
    },
  },

  data: {
    name: "",
    title: "",
    subtitle: "",
    description: "",
    shortDescription: "",

    hero: {
      title: "",
      description: "",
      breadcrumb: "",
      background_image: "",
      video: "",
      showVideo: false,
      button: {
        name: "Explore Journey",
        url: "",
      },
      buttons: [],
      titleStyle: null,
      breadcrumbStyle: null,
      descriptionStyle: null,
      backgroundMultimedia: null,
    },

    card: {
      title: "",
      subtitle: "",
      background_image: "",
      button: {
        label: "EXPLORE",
        url: "",
      },
      titleStyle: null,
      subtitleStyle: null,
      backgroundMultimedia: null,
    },

    why: {
      subtitle: "",
      title: "",
      description_paragraphs: [],
      image: "",
      tags: [],
      subtitleStyle: null,
      imageMultimedia: null,
      backgroundMultimedia: null,
    },

    info: {
      headline: "",
      description: "",
      headlineStyle: null,
      descriptionStyle: null,
      backgroundMultimedia: null,
    },

    sharedInfo: {
      text: "",
      style: null,
      textStyle: null,
      backgroundMultimedia: null,
    },

    regionGlance: {
      label: "",
      title: "",
      description: "",
      style: null,
      labelStyle: null,
      descriptionStyle: null,
      backgroundMultimedia: null,
    },

    regionCharacter: {
      label: "",
      title: "",
      items: [],
      style: null,
      backgroundMultimedia: null,
    },

    essence: {
      label: "",
      title: "",
      paragraphs: [],
      paragraphStyles: [],
      quote: "",
      imageSrc: "",
      imageAlt: "",
      statValue: "",
      statLabel: "",
      facts: [],
      style: null,
      labelStyle: null,
      quoteStyle: null,
      titleStyle: null,
      imageMultimedia: null,
      backgroundMultimedia: null,
    },

    statistics: {
      facts: [],
      area: {
        value: 0,
        unit: "km²",
      },
      elevation: {
        value: 0,
        unit: "m",
      },
      population: {
        value: 0,
        year: 2026,
      },
      style: null,
      backgroundMultimedia: null,
    },

    climate: {
      types: [],
      description: "",
    },

    culture: {
      cuisine: [],
      description: "",
      majorLanguages: [],
      majorReligions: [],
      famousFestivals: [],
      style: null,
    },

    safety: {
      description: "",
      emergencyNumber: "",
    },

    geography: {
      highestPoint: {
        name: "",
        unit: "m",
        elevation: 0,
      },
      majorLandscapes: [],
    },

    travelInfo: {
      beforeTravel: {
        label: "",
        title: "",
        image: "",
        imageAlt: "",
        items: [],
        style: null,
        imageMultimedia: null,
        backgroundMultimedia: null,
      },
      visa: {
        description: "",
      },
      currency: {
        description: "",
        majorCurrency: "",
      },
      bestTimeToVisit: {
        summer: "",
        winter: "",
        general: "",
      },
      popularTransportation: [],
    },

    experiences: {
      title: "",
      location: "",
      description: "",
      load_more_button: "Load More",
      loadMoreButtonStyle: null,
      titleStyle: null,
      locationStyle: null,
      descriptionStyle: null,
      seasonInfo: "",
      seasonLocation: "",
      featured_experience: {
        image: "",
        title: "",
        category: "",
        duration: "",
        subtitle: "",
        action_text: "More info",
        button: null,
        buttons: [],
        imageMultimedia: null,
      },
      cards: [],
      footer: {
        note: "",
        region: "",
      },
    },

    signature_experiences: {
      label: "Signature Experiences",
      labelStyle: null,
      title: "Signature Experiences",
      titleStyle: null,
      description: "",
      descriptionStyle: null,
      backgroundMultimedia: null,
      style: null,
      experiences: [
        {
          id: "exp-01",
          number: "01",
          numberStyle: null,
          title: "",
          titleStyle: null,
          description: "",
          descriptionStyle: null,
          href: "#",
          linkText: "Explore this experience",
        },
        {
          id: "exp-02",
          number: "02",
          numberStyle: null,
          title: "",
          titleStyle: null,
          description: "",
          descriptionStyle: null,
          href: "#",
          linkText: "Explore this experience",
        },
        {
          id: "exp-03",
          number: "03",
          numberStyle: null,
          title: "",
          titleStyle: null,
          description: "",
          descriptionStyle: null,
          href: "#",
          linkText: "Explore this experience",
        },
      ],
    },

    practical_information: {
      title: "",
      sub_heading: "",
      side_image: "",
      accordion_items: [],
      sideImageMultimedia: null,
      backgroundMultimedia: null,
    },

    faq_section: {
      image: "",
      title: "",
      questions: [],
      imageMultimedia: null,
      backgroundMultimedia: null,
    },

    imageGalary: [],

    local_guide: {
      title: "",
      sub_heading: "",
      main_image: "",
      articles: [],
    },

    travel_insights: {
      title: "",
      sub_heading: "",
      main_image: "",
      articles: [],
      mainImageMultimedia: null,
    },

    accommodation_stays: {
      badge: "",
      badgeStyle: null,
      title: "",
      titleStyle: null,
      description: "",
      descriptionStyle: null,
      stays: [],
      backgroundMultimedia: null,
    },

    videoGalary: {
      alt: "",
      url: "",
      thumbnail: "",
      multimedia: null,
    },
  },
}
