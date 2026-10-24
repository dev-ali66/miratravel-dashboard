import { THEME_COLORS } from "@/config/theme"
import { createDefaultMultimedia } from "../shared/defaultMediaHelper"

export const emptyGuidanceBlock = {
  type: "guidance",
  title: {
    value: "The Dalmatian Hinterland & Karst Canyons",
    textColor: THEME_COLORS.bgHeroDark,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  content: {
    value: "Rising sharply behind the Adriatic coast, the rugged karst plateau of the Dalmatian hinterland is a terrain of stark beauty. Sweeping limestone valleys, dramatic gorges, and fortified towns stand as sentinel outposts over centuries of Venetian-Ottoman frontier history.",
    textColor: THEME_COLORS.body,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  mediaPosition: "left" as "left" | "right",
  multimedia: createDefaultMultimedia("image"),
  items: [] as any[],
  experiencesTitle: {
    value: "ESSENTIAL EXPERIENCES",
    textColor: THEME_COLORS.gold,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  experiences: [
    "Traverse the historic bridges spanning turquoise river mouths",
    "Sample cured pršut aged naturally under the fierce coastal Bura wind",
    "Explore tranquil river springs and hidden travertine waterfalls",
    "Visit remote stone hamlets where dry-stone walling remains an art form",
  ],
  knowledgeTitle: {
    value: "LOCAL KNOWLEDGE",
    textColor: THEME_COLORS.quote,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  knowledgeContent: {
    value: "Visit the canyon viewpoints during the late afternoon golden hour when the limestone cliffs turn warm terracotta and the water reflects the amber Balkan sky.",
    textColor: THEME_COLORS.sub,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  routeInfo: {
    value: "Route: Easily accessed via the scenic coastal highway or inland mountain corridors connecting Zadar and Split.",
    textColor: THEME_COLORS.navText,
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
}
