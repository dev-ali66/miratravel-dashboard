export const emptyBasicInfo = {
  title: "",
  slug: "",
  type: "short_story" as const,
  categories: [],
  authorName: "",
  authorRole: "",
  readTime: "",
  authorAvatar: {
    show: "image",
    color: { color: "#171717", opacity: 100, width: "100%", height: "100%", aspectRatio: "auto" },
    image: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 45, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" },
    video: { url: "", alt: "", opacity: 100, overlayColor: "#000000", overlayOpacity: 45, autoplay: true, loop: true, muted: true, width: "100%", height: "auto", aspectRatio: "auto", fit: "cover" }
  },
};
