export function normalizeParagraphBlock(b: any) {
  const hasValue = (field: any) => field && typeof field.value === "string" && field.value.trim() !== "";
  const cleaned: any = { type: "paragraph" };
  if (hasValue(b.content)) cleaned.content = b.content;
  return cleaned;
}
