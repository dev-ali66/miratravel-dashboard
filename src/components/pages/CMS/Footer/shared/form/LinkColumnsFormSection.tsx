import { ColorField, DynamicStyledField } from "../../../shared/FormControls"
import { RepeaterList } from "../../../shared/RepeaterList"
import type { FooterColumn, FooterColumnLink } from "../../footerTypes"
import type { FooterFormSectionProps } from "./sectionTypes"

export const LinkColumnsFormSection = ({ context }: FooterFormSectionProps) => {
  const { theme, content, updateContent } = context
  const columns = content.columns ?? []

  return (
    <div className="space-y-6">
      <RepeaterList<FooterColumn>
        items={columns}
        onChange={(newColumns) => updateContent({ columns: newColumns })}
        addLabel="Add Navigation Column"
        emptyLabel="No navigation columns added."
        itemLabel={(column) => column.title || "Untitled Column"}
        newItem={() => ({
          title: "",
          titleColor: theme.headingColor ?? "#FFFFFF",
          links: [],
        })}
        renderItem={(column, updateColumn) => (
          <div className="space-y-4 p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DynamicStyledField
                label="Column Title"
                type="text"
                value={column.title ?? ""}
                onChange={(value) =>
                  updateColumn({
                    ...column,
                    title: typeof value === "object" ? value.value : value,
                  })
                }
              />

              <ColorField
                label="Column Title Color"
                value={column.titleColor ?? theme.headingColor ?? "#FFFFFF"}
                onChange={(value) =>
                  updateColumn({
                    ...column,
                    titleColor: value,
                  })
                }
              />
            </div>

            <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Column Links
              </span>
              <RepeaterList<FooterColumnLink>
                items={column.links ?? []}
                onChange={(links) => updateColumn({ ...column, links })}
                addLabel="Add Link"
                emptyLabel="No links in this column."
                itemLabel={(link) => link.label || "Untitled Link"}
                newItem={() => ({ label: "", url: "" })}
                renderItem={(link, updateLink) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1">
                    <DynamicStyledField
                      label="Link Label"
                      type="text"
                      value={link.label ?? ""}
                      onChange={(value) =>
                        updateLink({
                          ...link,
                          label: typeof value === "object" ? value.value : value,
                        })
                      }
                    />

                    <DynamicStyledField
                      label="Link URL"
                      type="text"
                      value={link.url ?? ""}
                      onChange={(value) =>
                        updateLink({
                          ...link,
                          url: typeof value === "object" ? value.value : value,
                        })
                      }
                    />
                  </div>
                )}
              />
            </div>
          </div>
        )}
      />
    </div>
  )
}

