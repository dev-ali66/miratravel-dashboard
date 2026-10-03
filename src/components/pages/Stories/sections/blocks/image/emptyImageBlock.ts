import { createDefaultMultimedia } from "../shared/defaultMediaHelper";

export const emptyImageBlock = {
  type: "image" as const,
  title: {
    value: "",
    textColor: "#78716C",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  multimedia: createDefaultMultimedia("image"),
  items: [] as any[],
};
