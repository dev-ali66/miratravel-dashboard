/**
 * Shared Normalization Helpers for Stories (Location & CMS Parity Architecture)
 */

export function getSafeStringValue(val: any, defaultVal: string = ""): string {
  if (val === null || val === undefined) return defaultVal
  if (typeof val === "string") return val
  if (typeof val === "number" || typeof val === "boolean") return String(val)
  if (typeof val === "object" && !Array.isArray(val)) {
    return getSafeStringValue((val as any).value, defaultVal)
  }
  return defaultVal
}

export function normalizeStyledField(
  raw: any,
  defaultVal: string = "",
  defaultTextColor: string | null = null,
  defaultBgColor: string | null = null
) {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    return {
      value: getSafeStringValue(raw.value, defaultVal),
      textColor: raw.textColor !== undefined ? raw.textColor : defaultTextColor,
      textOpacity: raw.textOpacity !== undefined ? Number(raw.textOpacity) : 1,
      backgroundColor: raw.backgroundColor !== undefined ? raw.backgroundColor : defaultBgColor,
      backgroundOpacity: raw.backgroundOpacity !== undefined ? Number(raw.backgroundOpacity) : 1,
    }
  }

  return {
    value: getSafeStringValue(raw, defaultVal),
    textColor: defaultTextColor,
    textOpacity: 1,
    backgroundColor: defaultBgColor,
    backgroundOpacity: 1,
  }
}

export function normalizeMultimedia(media: any, defaultShow?: string): any {
  const safeMedia = media && typeof media === "object" ? media : {}

  const hasVideoConfig = Boolean(safeMedia.video?.url || (safeMedia.video && Object.keys(safeMedia.video).length > 0))
  const rawShow = safeMedia.show ?? safeMedia.type ?? defaultShow ?? (hasVideoConfig ? "video" : "image")
  const show = typeof rawShow === "object" ? (rawShow?.show ?? rawShow?.type ?? "color") : (rawShow || "color")

  const imageObj = safeMedia.image ?? safeMedia.imageData ?? {}
  const videoObj = safeMedia.video ?? safeMedia.videoData ?? {}
  const colorObj =
    typeof safeMedia.color === "object"
      ? safeMedia.color
      : {
          color: typeof safeMedia.color === "string" ? safeMedia.color : "#171717",
          opacity: 100,
          width: "100%",
          height: "100%",
          aspectRatio: "auto",
        }

  const resolvedUrl =
    safeMedia.url ||
    (show === "video" ? videoObj.url : imageObj.url) ||
    videoObj.url ||
    imageObj.url ||
    null

  const resolvedAlt =
    safeMedia.alt ||
    (show === "video" ? videoObj.alt : imageObj.alt) ||
    videoObj.alt ||
    imageObj.alt ||
    null

  return {
    show,
    color: {
      color: colorObj.color ?? "#171717",
      opacity: colorObj.opacity ?? 100,
      width: colorObj.width || "100%",
      height: colorObj.height || "100%",
      aspectRatio: colorObj.aspectRatio || "auto",
    },
    image: {
      url: imageObj.url || (show === "image" ? resolvedUrl : null) || null,
      alt: imageObj.alt || resolvedAlt || "mira hero",
      opacity: imageObj.opacity ?? 100,
      overlayColor: imageObj.overlayColor || "#000000",
      overlayOpacity: imageObj.overlayOpacity ?? 45,
      width: imageObj.width || "100%",
      height: imageObj.height || "auto",
      aspectRatio: imageObj.aspectRatio || "auto",
      fit: imageObj.fit || "cover",
    },
    video: {
      url: videoObj.url || (show === "video" ? resolvedUrl : null) || null,
      alt: videoObj.alt || resolvedAlt || "Cinematic Aerial View",
      opacity: videoObj.opacity ?? 100,
      overlayColor: videoObj.overlayColor || "#000000",
      overlayOpacity: videoObj.overlayOpacity ?? 45,
      autoplay: videoObj.autoplay ?? true,
      loop: videoObj.loop ?? true,
      muted: videoObj.muted ?? true,
      width: videoObj.width || "100%",
      height: videoObj.height || "auto",
      aspectRatio: videoObj.aspectRatio || "auto",
      fit: videoObj.fit || "cover",
    },
    url: resolvedUrl,
    alt: resolvedAlt,
  }
}

export function normalizeButton(btn: any): any {
  if (!btn || typeof btn !== "object") return null
  const variant = (btn.variant || btn.style || "PRIMARY").toUpperCase()
  return {
    label: btn.label || btn.text || "",
    url: btn.url || btn.href || "",
    variant: variant,
    style: btn.style || variant.toLowerCase(),
    rounded: btn.rounded || "none",
    backgroundColor: btn.backgroundColor || (variant === "PRIMARY" ? "#ffffff" : "#000000"),
    backgroundOpacity: btn.backgroundOpacity ?? 100,
    textColor: btn.textColor || (variant === "PRIMARY" ? "#000000" : "#ffffff"),
    textOpacity: btn.textOpacity ?? 100,
    hoverBackgroundColor: btn.hoverBackgroundColor || "#f3f4f6",
    hoverTextColor: btn.hoverTextColor || "#000000",
    target: btn.target || "_self",
    showIcon: btn.showIcon ?? true,
  }
}

export function normalizeButtonsArray(btns: any): any[] {
  if (!Array.isArray(btns)) return []
  return btns.map(normalizeButton).filter(Boolean)
}
