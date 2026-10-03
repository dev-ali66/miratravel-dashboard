export function normalizeIntro(introData: any) {
  if (!introData) return null;
  const copy = JSON.parse(JSON.stringify(introData));
  if (copy.backgroundMultimedia) {
    if (copy.backgroundMultimedia.image?.url === "") copy.backgroundMultimedia.image.url = null;
    if (copy.backgroundMultimedia.video?.url === "") copy.backgroundMultimedia.video.url = null;
  }
  return copy;
}
