/* =====================================================
   LOCATION — ARRAY ITEM UPDATE HELPER
   Generic replacement for the old per-section update*()
   closures (updateFAQ, updateExperience, updatePractical,
   updateGallery, updateGuideArticle) that used to live
   centrally in the LocationForm monolith. Each repeater
   section now calls this directly with its own array +
   updateField path, instead of a bespoke closure.
===================================================== */

export function updateArrayItem<T>(
    array: T[],
    index: number,
    field: keyof T,
    value: unknown,
    onChange: (next: T[]) => void
) {
    const next = [...array]

    next[index] = {
        ...next[index],
        [field]: value,
    } as T

    onChange(next)
}
