import { createDefaultMultimedia } from "../shared/defaultMediaHelper"

export const emptySpotlightCard = {
  type: "spotlight",
  title: {
    value: "",
    textColor: "#B3884D",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  content: {
    value: "",
    textColor: "#44403C",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  mediaPosition: "left" as "left" | "right",
  multimedia: createDefaultMultimedia("image"),
  items: [] as any[],
}
