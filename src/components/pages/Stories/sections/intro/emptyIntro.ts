export const emptyIntro = {
  title: {
    value: "",
    textColor: "#171717",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  subtitle: {
    value: "",
    textColor: "#B3884D",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  description: {
    value: "",
    textColor: "#4A4A4A",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1,
  },
  backgroundMultimedia: {
    show: "color" as const,
    color: { color: "#FAF7F2", opacity: 100, width: "100%", height: "auto", aspectRatio: "auto" },
    image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const },
    video: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const, autoplay: true, loop: true, muted: true },
  },
};
