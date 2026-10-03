import { createDefaultMultimedia } from "../shared/defaultMediaHelper"

export const emptyVideoBlock = {
  type: "video",
  title: {
    value: "",
    textColor: "#78716C",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  multimedia: createDefaultMultimedia("video"),
  items: [] as any[],
}
