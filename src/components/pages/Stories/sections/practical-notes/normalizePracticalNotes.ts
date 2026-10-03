export function normalizePracticalNotes(notesData: any) {
  if (!notesData) return null;
  return JSON.parse(JSON.stringify(notesData));
}
