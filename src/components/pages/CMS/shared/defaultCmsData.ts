import { DEFAULT_CONTACT_SECTIONS } from "../Contact/contactTypes"

export function getDefaultCmsPageData(slug: string, name: string) {
  const normalizedSlug = slug.toLowerCase()

  if (normalizedSlug === "home") {
    return {
      name: "Home",
      slug: "home",
      metadata: {
        title: "Home - Mira",
        description: "Welcome to Mira",
      },
      data: {
        sections: [
          {
            key: "hero",
            enabled: true,
            title: "Hero",
            subtitle: "Discover extraordinary travel experiences",
            content: {
              title: "Discover extraordinary travel experiences",
              subtitle: "Curated journeys to the world's most captivating destinations.",
            },
          },
          {
            key: "explore_journeys",
            enabled: true,
            title: "Explore Journeys",
            subtitle: "Handcrafted travel itineraries",
            content: {
              title: "Explore Handcrafted Journeys",
              subtitle: "Select from our signature curated travel routes.",
            },
          },
          {
            key: "destinations",
            enabled: true,
            title: "Destinations",
            subtitle: "Top destinations",
            content: {
              title: "Top Travel Destinations",
              subtitle: "Immerse yourself in vibrant cultures and breathtaking landscapes.",
            },
          },
          {
            key: "mira_stories",
            enabled: true,
            title: "Mira Stories",
            subtitle: "Traveler experiences & tales",
            content: {
              eyebrow: "The Editorial",
              title: "Mira Stories",
              description:
                "A collection of personal, cultural and inspiring stories. Each piece offers a deeper view of the Balkans and its people beyond the expected.",
            },
            items: [
              {
                index: "01",
                title: "Decoding the Stećci",
                subtitle: "Mythology of the medieval tombstones",
                url: "/stories/decoding-the-stecci",
              },
              {
                index: "02",
                title: "The Salt Merchants of Ston",
                subtitle: "Tracking the white gold of the Adriatic",
                url: "/stories/salt-merchants-of-ston",
              },
            ],
            buttons: [
              {
                label: "View All Stories",
                url: "/stories",
              },
            ],
          },
          {
            key: "why_mira",
            enabled: true,
            title: "Why Mira",
            subtitle: "Our commitment to quality",
            content: {
              eyebrow: "Why MIRA",
              title: "Travel, shaped by insight. Refined through experience.",
              paragraphs: [
                "MIRA exists as a quiet force behind the region's most curated journeys. We are rooted in the authentic Balkan heritage, believing that true exploration requires a deep, editorial understanding of the land's silent narratives. Every expedition is a private monograph, meticulously designed to bridge the gap between contemporary luxury and the raw, untethered spirit of the frontier.",
                "MIRA exists as a quiet force behind the region's most curated journeys. We are rooted in the authentic Balkan heritage, believing that true exploration requires a deep, editorial understanding of the land's silent narratives. Every expedition is a private monograph, meticulously designed to bridge the gap between contemporary luxury and the raw, untethered spirit of the frontier.",
              ],
              signature: "— MIRA",
            },
          },
          {
            key: "travel_insights",
            enabled: true,
            title: "Travel Insights",
            subtitle: "Tips and guides",
            content: {
              eyebrow: "THE EDITORIAL",
              title: "Travel Insights",
              description:
                "A collection of personal, cultural and inspiring stories. Each piece offers a deeper view of the Balkans and its people beyond the expected.",
            },
            items: [
              {
                tag: "HERITAGE",
                title: "Explore UNESCO Towns: A Journey Through Time",
                description:
                  "Discover the architectural marvels and hidden histories of the Balkans' most preserved medieval settlements.",
                url: "/stories/explore-unesco-towns",
                image:
                  "https://images.unsplash.com/photo-1548625361-18da857bbf08?auto=format&fit=crop&w=800&q=80",
              },
              {
                tag: "STAYS",
                title: "The Art of Balkan Hospitality",
                description:
                  "Curated accommodations that define luxury through authenticity.",
                url: "/stories/the-art-of-balkan-hospitality",
                image:
                  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
              },
              {
                tag: "CULTURE",
                title: "Decoding the Stećci",
                description:
                  "Mythology of the medieval tombstones and silent narratives.",
                url: "/stories/decoding-the-stecci",
                image:
                  "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80",
              },
            ],
            buttons: [
              {
                label: "View All Stories",
                url: "/stories",
              },
            ],
          },
          {
            key: "custom_journey_cta",
            enabled: true,
            title: "Custom Journey CTA",
            subtitle: "Design your dream trip",
            content: {
              title: "Design Your Custom Journey",
              subtitle: "Let our travel experts craft a bespoke itinerary tailored to you.",
            },
          },
        ],
      },
    }
  }

  if (normalizedSlug === "navbar") {
    return {
      name: "Navbar",
      slug: "navbar",
      metadata: {
        title: "Navbar",
        description: "Site header navigation",
      },
      data: {
        page: "navbar",
        theme: {
          backgroundColor: "#ffffff",
          textColor: "#171717",
          activeColor: "#2563eb",
        },
        content: {
          brand: {
            name: "Mira",
            logo: "",
            alt: "Mira Logo",
            url: "/",
          },
        },
      },
    }
  }

  if (normalizedSlug === "footer") {
    return {
      name: "Footer",
      slug: "footer",
      metadata: {
        title: "Footer",
        description: "Site footer",
      },
      data: {
        page: "footer",
        theme: {
          backgroundColor: "#09090b",
          textColor: "#a1a1aa",
          headingColor: "#ffffff",
          accentColor: "#2563eb",
        },
        content: {
          brand: {
            name: "Mira",
            description: "Crafting luxury travel experiences worldwide.",
          },
          columns: [],
          socialLinks: [],
          copyright: `© ${new Date().getFullYear()} Mira. All rights reserved.`,
        },
      },
    }
  }

  if (normalizedSlug === "contact" || normalizedSlug === "contact-us") {
    return {
      name: "Contact",
      slug: "contact-us",
      metadata: {
        title: "Contact Us - Mira",
        description: "Get in touch with the Mira team",
      },
      data: {
        page: "contact",
        title: "Contact Us",
        description: "We'd love to hear from you. Send us a message and we'll respond promptly.",
        theme: {},
        sections: DEFAULT_CONTACT_SECTIONS,
        content: {
          email: "support@mira.com",
          phone: "+1 (800) 123-4567",
          address: "123 Travel Way, San Francisco, CA 94105",
        },
      },
    }
  }

  if (normalizedSlug === "cta") {
    return {
      name: "CTA",
      slug: "cta",
      metadata: {
        title: "Call To Action",
        description: "Site Call To Action",
      },
      data: {
        title: "Ready for your next adventure?",
        subtitle: "Contact our team to plan your personalized itinerary today.",
        buttonText: "Get Started",
        buttonUrl: "/contact",
      },
    }
  }

  if (normalizedSlug === "faq") {
    return {
      name: "FAQ",
      slug: "faq",
      metadata: {
        title: "Frequently Asked Questions",
        description: "Find answers to common travel questions",
      },
      data: {
        title: "Frequently Asked Questions",
        subtitle: "Everything you need to know about booking with Mira",
        bgColor: "#FBF6EE",
        faqs: [],
        styles: {
          page: {
            backgroundColor: "#FBF6EE",
            textColor: "#171717",
          },
          header: {
            backgroundColor: "transparent",
            eyebrowColor: "#737373",
            titleColor: "#171717",
            subtitleColor: "#737373",
            descriptionColor: "#737373",
          },
          faq: {
            itemBackgroundColor: "#FFFFFF",
            itemBorderColor: "#E5E5E5",
            questionColor: "#171717",
            answerColor: "#737373",
            iconColor: "#737373",
            openBackgroundColor: "#F5F5F5",
            openQuestionColor: "#111111",
            openAnswerColor: "#555555",
          },
        },
      },
    }
  }

  return {
    name,
    slug,
    metadata: {
      title: name,
      description: `Manage ${name} page content`,
    },
    data: {},
  }
}
