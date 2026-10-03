export const emptyHero = {
  title: {
    value: "",
    textColor: "#FFFFFF",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1
  },
  subtitle: {
    value: "",
    textColor: "#E5E7EB",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1
  },
  description: {
    value: "",
    textColor: "#F3F4F6",
    textOpacity: 1,
    backgroundColor: null,
    backgroundOpacity: 1
  },
  backgroundMultimedia: {
    show: "video", // Default for hero
    color: { color: "#171717", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
    image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 45, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
    video: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 45, autoplay: true, loop: true, muted: true, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" }
  },
  isCenter: false,
};
