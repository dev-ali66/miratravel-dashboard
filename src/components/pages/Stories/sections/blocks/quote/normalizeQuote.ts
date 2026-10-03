export function normalizeQuoteBlock(b: any) {
  const hasValue = (field: any) => field && typeof field.value === "string" && field.value.trim() !== "";
  const cleaned: any = { type: "quote" };
  if (hasValue(b.content)) cleaned.content = b.content;
  if (hasValue(b.author)) cleaned.author = b.author;
  return cleaned;
}
