export function shouldSyncActiveDay(
    prevActiveDay: number | null,
    activeDay: number | null
): 'act' | 'skip' {
    if (activeDay == null || activeDay === prevActiveDay) {
        return 'skip';
    }
    return 'act';
}
