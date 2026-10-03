

export function normalizeStoryPayload(draft: any): any {
  // Deep clone to avoid mutating the original draft
  const payload = JSON.parse(JSON.stringify(draft));

  // 1. Clean url: "" defaults from multimedia objects
  const normalizeMultimedia = (media: any) => {
    if (!media) return media;
    if (media.image?.url === "") media.image.url = null;
    if (media.video?.url === "") media.video.url = null;
    return media;
  };

  if (payload.hero?.backgroundMultimedia) {
    payload.hero.backgroundMultimedia = normalizeMultimedia(payload.hero.backgroundMultimedia);
  }
  if (payload.authorAvatar) {
    payload.authorAvatar = normalizeMultimedia(payload.authorAvatar);
  }

  // 2. Format journeyIds and locationIds strictly as arrays of strings
  if (!Array.isArray(payload.journeyIds)) {
    payload.journeyIds = [];
  }
  if (!Array.isArray(payload.locationIds)) {
    payload.locationIds = [];
  }
  if (!Array.isArray(payload.manualRelatedStoryIds)) {
    payload.manualRelatedStoryIds = [];
  }
  if (!Array.isArray(payload.categories)) {
    payload.categories = [];
  }

  // 3. Strip out unnecessary nested preview-only data
  // Delete fields that are only for preview or not needed in DB
  delete payload.isLocalDraft;

  return payload;
}
