import type { Journey } from "../journeyTypes"

export const classicAlbaniaSampleJourney: Journey = {
  id: undefined,
  slug: "classic-albania-and-beyond",
  title: "Classic Albania & Beyond",
  subtitle:
    "Mountains, Riviera and UNESCO towns – the essence of Albania in one curated journey",
  price: 3195,
  currency: "EUR",
  minDays: 8,
  maxDays: 10,

  journeyHeroImage: [
    "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788215577/P/locationBackgroundImage/ar2if6xrmiqrdjdsuwui.png",
  ],
  journeyGallery: [
    "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788308975/P/locationImage/nvjkxyndffixd1gfb2ic.png",
    "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788374670/P/locationBackgroundImage/nw0pcr3ca5qsn3ksa72n.png",
    "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788215948/P/locationBackgroundImage/btuiongs4tum7u7e4nvx.png",
  ],
  highlights: [
    "Hike through the wild alpine valleys of Theth and Grunas Waterfall",
    "Sail through the fjord-like waters of Komani Lake by private boat",
    "Walk through the Ottoman cobblestone quarters of Berat and Gjirokastër",
    "Relax beside turquoise Ionian bays along the wild Albanian Riviera",
    "Savor traditional slow-food dining and artisan vineyard tastings",
  ],
  included: [
    "All private transportation including 4x4 mountain vehicles and airport transfers",
    "Boutique hotels, historic stone kullas, and mountain lodges with daily breakfast",
    "Private licensed local guides and mountain leaders throughout",
    "Ferry crossing and private boat excursion on Lake Komani",
    "All national park permits, museum entrances, and scheduled tastings",
  ],
  notIncluded: [
    "International flights to/from Tirana (TIA)",
    "Travel and medical cancellation insurance",
    "Personal expenses, unlisted alcoholic beverages, and discretionary tips",
  ],

  journeyType: ["PRIVATE_JOURNEY", "SELF_DRIVE_JOURNEY"],
  travelStyle: ["CULTURE_HERITAGE", "NATURE", "MOUNTAINS", "COASTAL_ESCAPE"],
  perfectFor: ["COUPLES", "FIRST_TIME_VISITORS", "NATURE_LOVERS", "FOOD_WINE"],
  pace: "BALANCED",
  comfortLevel: "BOUTIQUE",

  status: "PUBLISHED",
  featured: true,

  metadata: {
    seo: {
      title: "Classic Albania & Beyond | Curated Private Journey | MIRA",
      description:
        "Experience the best of Albania from the Accursed Mountains of Theth to the turquoise bays of the Riviera and UNESCO stone towns on this bespoke 8-10 day journey.",
      keywords: [
        "Albania Tour",
        "Theth Hiking",
        "Albanian Riviera",
        "Berat UNESCO",
        "Komani Lake",
        "Balkans Luxury Travel",
      ],
      canonicalUrl: "/journeys/classic-albania-and-beyond",
    },
  },

  data: {
    hero: {
      title: "Ancient Albania & Beyond",
      subtitle:
        "A private cross-country odyssey connecting northern peaks, ancient stone towns, and clear Ionian shores.",
      background_image:
        "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788215577/P/locationBackgroundImage/ar2if6xrmiqrdjdsuwui.png",
      video:
        "https://res.cloudinary.com/dscqp4wwt/video/upload/v1788326165/P/locationVideo/dlwxvxzt6xmvbtsa1nsp.webm",
      backgroundMultimedia: {
        type: "video",
        url: "https://res.cloudinary.com/dscqp4wwt/video/upload/v1788326165/P/locationVideo/dlwxvxzt6xmvbtsa1nsp.webm",
        color: "rgba(15, 42, 46, 0.98)",
        opacity: 100,
        imageData: {
          url: "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788215577/P/locationBackgroundImage/ar2if6xrmiqrdjdsuwui.png",
          alt: "Ancient Albania Mountain Landscape",
          opacity: 100,
        },
        videoData: {
          url: "https://res.cloudinary.com/dscqp4wwt/video/upload/v1788326165/P/locationVideo/dlwxvxzt6xmvbtsa1nsp.webm",
          loop: true,
          muted: true,
          autoplay: true,
          opacity: 100,
        },
      },
      tags: ["Self-drive", "Private Journey", "Culture & Nature"],
      highlightBadge:
        "Perfect for Couples • Slow Travel • First-time Albania",
      priceSuffix: "per person",
      occupancyText: "Based on double occupancy",
      taxesLabel: "Taxes & fees",
      taxesValue: "Calculated at checkout",
      ctaText: "Request This Journey",
      contactPromptText: "Questions on this journey?",
      benefits: [
        "Free cancellation up to 60 days prior to departure",
        "Flexible 30/70 payment plans available",
        "Financial protection & licensed mountain support",
        "Personal travel specialist curated by Mira",
        "24/7 dedicated local concierge support",
      ],
    },

    whyWeDesigned: {
      title: "Why we designed this journey?",
      paragraphs: [
        "Albania spent half a century behind one of the world's strictest iron curtains. What emerged was not a country broken by isolation, but one preserved by it: river valleys without dams, mountains without mass-tourism infrastructure, and highland hospitality that is genuine and unforced.",
        "We designed this itinerary for travelers who crave authentic depth over a rushed checklist. By seamlessly linking the dramatic limestone spires of Theth with the peaceful UNESCO stone alleys of Berat and private coves along the southern Riviera, you experience Albania's contrasting worlds at an unhurried, restorative pace.",
      ],
      signature: "— MIRA",
    },

    isThisForYou: {
      title: "Is this Journey for you?",
      items: [
        "You appreciate dramatic alpine scenery combined with relaxed Mediterranean coastlines.",
        "You seek boutique heritage stays, converted kullas, and locally owned mountain retreats.",
        "You enjoy authentic regional cuisine, farm-to-table dining, and family-run vineyards.",
        "You prefer a flexible private itinerary with dedicated drivers and expert local guides.",
        "You want an effortless journey that balances scenic adventure with moments of pure rest.",
      ],
    },

    overviewList: {
      title: "Journey Overview",
      titlegraphs: [
        "Begin in the vibrant, colorful capital of Tirana before heading north into the rugged Accursed Mountains. Experience the remote tranquility of Theth Valley with its stone houses and cascading waterfalls, then cruise across the spectacular limestone canyons of Lake Komani.",
        "Journey south through Central Albania to explore the Ottoman architecture of Berat and Gjirokastër. Conclude your voyage along the sparkling Ionian coast with private boat charters, secluded pebble beaches, and seaside sunset dining.",
      ],
      highlightsTitle: "Curated Highlights",
      highlights: [
        "Private guided architectural walking tour of Tirana's Blloku district",
        "Scenic 4x4 mountain drive crossing the Buni i Thores pass into Theth",
        "Guided trek to the iconic Grunas Waterfall and limestone gorge",
        "Private chartered wooden boat trip through Komani Lake's emerald canyon",
        "Exclusive wine and olive oil tasting at a historic family estate in Berat",
        "Sunset sailing along the turquoise sea caves of the southern Riviera",
      ],
    },

    route: {
      title: "Route Overview",
      description:
        "A seamless 9-day circuit connecting North, Central, and South Albania with minimal backtracking.",
      mapImage:
        "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788308975/P/locationImage/nvjkxyndffixd1gfb2ic.png",
      stops: [
        { name: "Tirana", days: "Day 1-2" },
        { name: "Theth & Lake Komani", days: "Day 2-4" },
        { name: "Shkodër", days: "Day 4-5" },
        { name: "Berat & Gjirokastër", days: "Day 5-7" },
        { name: "Albanian Riviera", days: "Day 7-9" },
      ],
    },

    accommodation: {
      philosophy: {
        badge: "ACCOMMODATION PHILOSOPHY",
        title: "Where You Will Stay",
        description:
          "We partner exclusively with independent boutique properties, sensitively restored Ottoman mansions, and secluded alpine lodges personally chosen by Mira.",
        principles: [
          {
            title: "Character & Soul",
            description:
              "Properties with genuine architectural integrity, storied histories, and warm local hosts.",
            icon: "character",
          },
          {
            title: "Spectacular Locations",
            description:
              "Positioned beneath mountain peaks or perched above turquoise coastal waters.",
            icon: "location",
          },
          {
            title: "Understated Comfort",
            description:
              "High-thread linens, artisanal breakfast spreads, and peaceful, restorative spaces.",
            icon: "comfort",
          },
        ],
      },
      destinations: {
        badge: "DESTINATION BY DESTINATION",
        title: "Selected Properties",
        description:
          "Each stay is thoughtfully aligned with the atmosphere of its surrounding landscape.",
        stays: [
          {
            step: "DAY 01 - 02",
            duration: "2 Nights",
            hotelName: "Blloku Boutique Hotel",
            location: "Tirana",
            nights: 2,
            stayType: "URBAN BOUTIQUE HOTEL",
            description:
              "A stylish boutique property in the leafy Blloku quarter with curated modern art and a tranquil garden terrace.",
            image:
              "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788339206/P/locationImage/w4ik3vrasrioknhlimsd.png",
            confirmationBadge: "Confirmed by Mira",
          },
          {
            step: "DAY 02 - 04",
            duration: "2 Nights",
            hotelName: "Theth Alpine Stone Lodge",
            location: "Theth Valley",
            nights: 2,
            stayType: "ALPINE STONE LODGE",
            description:
              "A traditional hand-carved stone kulla set against sheer limestone cliffs, offering home-cooked mountain dinners and wooden balconies.",
            image:
              "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788374670/P/locationBackgroundImage/nw0pcr3ca5qsn3ksa72n.png",
            confirmationBadge: "Confirmed by Mira",
          },
          {
            step: "DAY 05 - 07",
            duration: "2 Nights",
            hotelName: "Mangalem Heritage Residence",
            location: "Berat",
            nights: 2,
            stayType: "HERITAGE OTTOMAN MANSION",
            description:
              "An authentic 18th-century stone residence within the Mangalem quarter featuring carved wooden ceilings and castle views.",
            image:
              "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788308975/P/locationImage/nvjkxyndffixd1gfb2ic.png",
            confirmationBadge: "Confirmed by Mira",
          },
          {
            step: "DAY 07 - 09",
            duration: "2 Nights",
            hotelName: "Ionian Riviera Retreat",
            location: "Albanian Riviera",
            nights: 2,
            stayType: "COASTAL SECLUSION RETREAT",
            description:
              "A cliffside boutique hideaway overlooking the crystal Ionian Sea with private cove access and fresh seafood dining.",
            image:
              "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788215948/P/locationBackgroundImage/btuiongs4tum7u7e4nvx.png",
            confirmationBadge: "Confirmed by Mira",
          },
        ],
      },
    },

    whatsIncluded: {
      includedTitle: "What's Included",
      includedItems: [
        "All private ground transportation including 4x4 vehicles and airport transfers",
        "8 nights accommodation in boutique hotels and historic mountain kullas",
        "Daily artisanal breakfast and specially curated welcome/farewell dinners",
        "Private licensed driver and English-speaking specialist mountain guide",
        "Private boat transfer and canyon excursion across Lake Komani",
        "All national park permits, archaeological entrance tickets, and winery tastings",
        "Luggage handling and 24/7 dedicated concierge line",
      ],
      notIncludedTitle: "What's Not Included",
      notIncludedItems: [
        "International round-trip flights to Tirana International Airport (TIA)",
        "Comprehensive travel, medical, and evacuation insurance",
        "Discretionary gratuities for guides and private drivers",
        "Meals and alcoholic drinks not explicitly listed in the itinerary",
        "Personal shopping, laundry, and optional adventure equipment rentals",
      ],
      importantInfoTitle: "Important Travel Notes",
      importantInfoItems: [
        "Best Season: May to October. Mountain trails in Theth are at their finest between June and September.",
        "Fitness Level: Moderate. Involves unpaved mountain walks and cobblestone climbs in historic quarters.",
        "Luggage: Soft duffel bags are recommended for seamless mountain transfers.",
      ],
    },

    addons: {
      title: "Optional Add-on Experiences",
      subtitle:
        "Enhance your journey with tailor-made excursions and private masterclasses.",
      items: [
        {
          id: "addon-cooking",
          itemNumber: 1,
          title: "Highland Stone Hearth Cooking Class",
          price: "€85 per guest",
          dayLabel: "Day 3 (Theth)",
          detailedHeading: "Hands-on Alpine Culinary Experience",
          description:
            "Join a local mountain family inside their kulla to bake traditional flija over hot embers and craft fresh goat cheese pastry.",
          thumbnail:
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788308975/P/locationImage/nvjkxyndffixd1gfb2ic.png",
          image:
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788308975/P/locationImage/nvjkxyndffixd1gfb2ic.png",
        },
        {
          id: "addon-boat",
          itemNumber: 2,
          title: "Private Sunset Speedboat Charter",
          price: "€240 per charter",
          dayLabel: "Day 8 (Riviera)",
          detailedHeading: "Secret Coves & Sea Caves of the Ionian",
          description:
            "A private 3-hour cruise to Grama Bay and the pirate caves with snorkeling gear, prosecco, and fresh seasonal fruit.",
          thumbnail:
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788215948/P/locationBackgroundImage/btuiongs4tum7u7e4nvx.png",
          image:
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788215948/P/locationBackgroundImage/btuiongs4tum7u7e4nvx.png",
        },
      ],
    },

    itinerary: {
      title: "Day-by-Day Itinerary",
      subtitle:
        "A thoughtfully paced voyage through Albania's finest peaks, valleys, and coastlines.",
      days: [
        {
          dayNumber: 1,
          dayLabel: "DAY 01",
          title: "Arrival in Tirana & Welcome Gathering",
          location: "Tirana",
          detailedHeading: "Gateway to the New Balkans",
          description:
            "Your private driver meets you at Tirana International Airport for the transfer to your boutique hotel. Spend the afternoon exploring the vibrant Blloku district, once closed to ordinary citizens, now filled with cafes, art galleries, and colorful facades. In the evening, gather for a private welcome dinner showcasing modern interpretations of traditional Albanian flavors.",
          thumbnail:
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788339206/P/locationImage/w4ik3vrasrioknhlimsd.png",
          images: [
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788339206/P/locationImage/w4ik3vrasrioknhlimsd.png",
          ],
        },
        {
          dayNumber: 2,
          dayLabel: "DAY 02",
          title: "Over the Mountain Pass into Theth Valley",
          location: "Theth National Park",
          detailedHeading: "Into the Accursed Mountains",
          description:
            "Depart Tirana northwards toward Shkodër and the gateway to the Albanian Alps. Ascend through dramatic winding alpine roads to the Buni i Thores pass at 1,700 meters, pausing for panoramic views across limestone crags. Descend into the secluded valley of Theth and settle into your authentic stone kulla with views of Maja e Arapit.",
          thumbnail:
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788374670/P/locationBackgroundImage/nw0pcr3ca5qsn3ksa72n.png",
          images: [
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788374670/P/locationBackgroundImage/nw0pcr3ca5qsn3ksa72n.png",
          ],
        },
        {
          dayNumber: 3,
          dayLabel: "DAY 03",
          title: "Grunas Waterfall, Limestone Canyons & Highland Life",
          location: "Theth Valley",
          detailedHeading: "Waterfalls and Alpine Traditions",
          description:
            "Embark on a gentle guided morning walk along the Theth River to the roaring 30-meter Grunas Waterfall, cascading into a crystal-clear turquoise pool. Continue along the narrow Grunas Canyon carved into the limestone rock. In the afternoon, visit the iconic Theth Church and the historic Lock-in Tower (Kulla e Ngujimit) to learn about highland customary law.",
          thumbnail:
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788215577/P/locationBackgroundImage/ar2if6xrmiqrdjdsuwui.png",
          images: [
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788215577/P/locationBackgroundImage/ar2if6xrmiqrdjdsuwui.png",
          ],
        },
        {
          dayNumber: 4,
          dayLabel: "DAY 04",
          title: "Lake Komani Fjord Cruise & Rozafa Castle",
          location: "Lake Komani & Shkodër",
          detailedHeading: "Europe's Most Dramatic Lake Crossing",
          description:
            "Board a chartered boat for an unforgettable journey across Lake Komani, flanked by vertical emerald cliffs that rival Norwegian fjords. Arrive in the ancient cultural hub of Shkodër to explore the legendary ramparts of Rozafa Castle at golden hour, taking in views across Lake Shkodër and the meeting of three rivers.",
          thumbnail:
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788308975/P/locationImage/nvjkxyndffixd1gfb2ic.png",
          images: [
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788308975/P/locationImage/nvjkxyndffixd1gfb2ic.png",
          ],
        },
        {
          dayNumber: 5,
          dayLabel: "DAY 05",
          title: "The Town of a Thousand Windows",
          location: "Berat (UNESCO)",
          detailedHeading: "Ottoman Splendor & Ancient Citadel",
          description:
            "Travel south to the UNESCO World Heritage town of Berat. Cross the historic Gorica stone bridge and walk through the cobblestone alleys of Mangalem. Ascend to the fortress citadel, where locals still live in traditional stone houses, and visit the Onufri Iconographic Museum with its luminous 16th-century frescoes.",
          thumbnail:
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788308975/P/locationImage/nvjkxyndffixd1gfb2ic.png",
          images: [
            "https://res.cloudinary.com/dscqp4wwt/image/upload/v1788308975/P/locationImage/nvjkxyndffixd1gfb2ic.png",
          ],
        },
      ],
    },
  },

  itinerary: [],
  accommodations: null,
  addOns: [],
}
