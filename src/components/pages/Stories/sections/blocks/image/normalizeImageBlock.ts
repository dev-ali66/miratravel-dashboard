export function normalizeImageBlock(b: any, normalizeMultimediaFn: (m: any) => any) {
  const hasValue = (field: any) => field && typeof field.value === "string" && field.value.trim() !== "";
  const cleaned: any = { type: "image" };
  if (hasValue(b.title)) cleaned.title = b.title;

  if (Array.isArray(b.items) && b.items.length > 0) {
    cleaned.items = b.items.map((m: any) => normalizeMultimediaFn(m));
  } else if (b.multimedia) {
    cleaned.multimedia = normalizeMultimediaFn(b.multimedia);
  }
  return cleaned;
}
