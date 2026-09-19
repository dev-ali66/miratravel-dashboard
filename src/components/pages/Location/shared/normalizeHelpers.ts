import { LOCATION_THEME_COLORS } from "./locationTheme"
export { LOCATION_THEME_COLORS }

/**
 * Normalizes a multimedia object so that no subfield is omitted.
 * If media is undefined or null, returns `null` so the field is
 * explicitly serialized as `"key": null` instead of being dropped.
 */
export function normalizeMultimedia(media: any, defaultShow?: "image" | "video" | "color" | string | any): any {
  const safeMedia = media && typeof media === "object" ? media : {}

  const hasVideoConfig = Boolean(safeMedia.video?.url || (safeMedia.video && Object.keys(safeMedia.video).length > 0))
  const rawDefaultShow = typeof defaultShow === "object" ? (defaultShow as any)?.show : defaultShow
  const rawShow = safeMedia.show ?? safeMedia.type ?? rawDefaultShow ?? (hasVideoConfig ? "video" : "image")
  const show = typeof rawShow === "object" ? (rawShow?.show ?? rawShow?.type ?? "color") : (rawShow || "color")

  const imageObj = safeMedia.image ?? safeMedia.imageData ?? {}
  const videoObj = safeMedia.video ?? safeMedia.videoData ?? {}
  const colorObj =
    typeof safeMedia.color === "object"
      ? safeMedia.color
      : {
          color: typeof safeMedia.color === "string" ? safeMedia.color : "#FFFFFF",
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
      color: colorObj.color ?? "#FFFFFF",
      opacity: colorObj.opacity ?? 100,
      width: colorObj.width || "100%",
      height: colorObj.height || "100%",
      aspectRatio: colorObj.aspectRatio || "auto",
    },
    image: {
      url: imageObj.url || (show === "image" ? resolvedUrl : null) || null,
      alt: imageObj.alt || resolvedAlt || null,
      opacity: imageObj.opacity ?? 100,
      overlayColor: imageObj.overlayColor || "#000000",
      overlayOpacity: imageObj.overlayOpacity ?? 0,
      width: imageObj.width || "100%",
      height: imageObj.height || "auto",
      aspectRatio: imageObj.aspectRatio || "auto",
      fit: imageObj.fit || "cover",
    },
    video: {
      url: videoObj.url || (show === "video" ? resolvedUrl : null) || null,
      alt: videoObj.alt || resolvedAlt || null,
      opacity: videoObj.opacity ?? 100,
      overlayColor: videoObj.overlayColor || "#000000",
      overlayOpacity: videoObj.overlayOpacity ?? 0,
      autoplay: videoObj.autoplay ?? true,
      loop: videoObj.loop ?? true,
      muted: videoObj.muted ?? true,
      width: videoObj.width || "100%",
      height: videoObj.height || "auto",
      aspectRatio: videoObj.aspectRatio || "auto",
      fit: videoObj.fit || "cover",
    },
  }
}

/**
 * Safely extracts a primitive string value from raw inputs,
 * handling nested { value: ... } objects gracefully.
 */
export function getSafeStringValue(val: any, defaultVal: string = ""): string {
  if (val === null || val === undefined) return defaultVal
  if (typeof val === "string") return val
  if (typeof val === "number" || typeof val === "boolean") return String(val)
  if (typeof val === "object" && !Array.isArray(val)) {
    return getSafeStringValue(val.value, defaultVal)
  }
  return defaultVal
}

/**
 * Normalizes any styled text/value field into the standard structured object format:
 * { value: "...", textColor: "#...", textOpacity: 1, backgroundColor: null, backgroundOpacity: 1 }
 * Prevents plain string conversion and keeps schema unified across frontend and CMS.
 */
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

/**
 * Normalizes any button object so that style settings (variant, rounded, colors, opacity, target, showIcon) are fully populated.
 */
export function normalizeButton(btn: any): any {
  if (!btn || typeof btn !== "object") return null
  const variant = btn.variant || btn.style || "primary"
  return {
    label: btn.label || btn.text || "",
    url: btn.url || btn.href || "",
    variant: variant,
    style: btn.style || variant,
    rounded: btn.rounded || "full",
    backgroundColor: btn.backgroundColor || (variant === "primary" ? "#182D09" : "#ffffff"),
    backgroundOpacity: btn.backgroundOpacity ?? (variant === "outline" ? 0 : 100),
    textColor: btn.textColor || (variant === "primary" || variant === "secondary" || variant === "dark" ? "#ffffff" : "#000000"),
    textOpacity: btn.textOpacity ?? 100,
    hoverBackgroundColor: btn.hoverBackgroundColor || "#f3f4f6",
    hoverTextColor: btn.hoverTextColor || "#000000",
    target: btn.target || "_self",
    showIcon: btn.showIcon !== false,
  }
}

/**
 * Normalizes an array of button objects.
 */
export function normalizeButtonsArray(buttons: any): any[] {
  if (!Array.isArray(buttons)) return []
  return buttons.map(normalizeButton).filter(Boolean)
}

/**
 * Traverses an object recursively and replaces any `undefined` values with `null`.
 */
export function recursivelyReplaceUndefinedWithNull(obj: any): any {
  if (obj === undefined) return null
  if (obj === null || typeof obj !== "object") return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => recursivelyReplaceUndefinedWithNull(item))
  }

  const result: Record<string, any> = {}
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    result[key] = val === undefined ? null : recursivelyReplaceUndefinedWithNull(val)
  }
  return result
}

