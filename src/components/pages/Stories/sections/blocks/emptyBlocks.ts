export { createDefaultMultimedia } from "./shared/defaultMediaHelper"
export { emptyParagraphBlock as emptyParagraph } from "./paragraph/emptyParagraph"
export { emptyQuoteBlock as emptyQuote } from "./quote/emptyQuote"
export { emptyImageBlock } from "./image/emptyImageBlock"
export { emptyVideoBlock } from "./video/emptyVideoBlock"
export { emptySpotlightCard } from "./spotlight/emptySpotlightCard"
export { emptyGuidanceBlock } from "./guidance/emptyGuidance"
export { emptyNotesBlock } from "./notes/emptyNotes"

export const emptyBlocksBackgroundMultimedia = {
  show: "color" as const,
  color: { color: "#FFFFFF", opacity: 100, width: "100%", height: "auto", aspectRatio: "auto" },
  image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const },
  video: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const, autoplay: true, loop: true, muted: true },
}

export const emptyBlockItem = {
  type: "paragraph" as const,
  title: {
    value: "",
    textColor: "#171717",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  content: {
    value: "",
    textColor: "#4A4A4A",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  author: {
    value: "",
    textColor: "#B3884D",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  multimedia: {
    show: "image" as const,
    color: { color: "#171717", opacity: 100, width: "100%", height: "auto", aspectRatio: "auto" },
    image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const },
    video: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const, autoplay: true, loop: true, muted: true },
  },
  items: [] as any[],
}

export const emptyBlocks: any[] = []
