export const createDefaultMultimedia = (show: "image" | "video" | "color" = "image") => ({
  show,
  color: { color: "#171717", opacity: 100, width: "100%", height: "auto", aspectRatio: "auto" },
  image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const },
  video: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 0, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" as const, autoplay: true, loop: true, muted: true },
});
