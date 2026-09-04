import { ColorField } from "../../../shared/FormControls"
import { RepeaterList } from "../../../shared/RepeaterList"

import type {
  FooterColumn,
  FooterColumnLink,
} from "../../footerTypes"
import type { FooterFormSectionProps } from "./sectionTypes"

export const LinkColumnsFormSection = ({
  context,
}: FooterFormSectionProps) => {
  const {
    theme,
    content,
    updateContent,
    TextField,
  } = context

  const columns = content.columns ?? []

  return (
    <div className="rounded-lg border border-border/60 p-3">
      <p className="mb-3 text-xs font-semibold text-foreground">
        Link Columns
      </p>

      <RepeaterList<FooterColumn>
        items={columns}
        onChange={(newColumns) =>
          updateContent({
            columns: newColumns,
          })
        }
        addLabel="Add column"
        emptyLabel="No columns."
        itemLabel={(column) =>
          column.title || "Untitled column"
        }
        newItem={() => ({
          title: "",
          titleColor:
            theme.headingColor ??
            "#FFFFFF",
          links: [],
        })}
        renderItem={(
          column,
          updateColumn
        ) => (
          <div className="flex flex-col gap-3">
            <TextField
              label="Column title"
              value={column.title ?? ""}
              onChange={(value) =>
                updateColumn({
                  ...column,
                  title: value,
                })
              }
            />

            <ColorField
              label="Column title color"
              value={
                column.titleColor ??
                theme.headingColor ??
                "#FFFFFF"
              }
              onChange={(value) =>
                updateColumn({
                  ...column,
                  titleColor: value,
                })
              }
            />

            <RepeaterList<FooterColumnLink>
              items={column.links ?? []}
              onChange={(links) =>
                updateColumn({
                  ...column,
                  links,
                })
              }
              addLabel="Add link"
              emptyLabel="No links."
              itemLabel={(link) =>
                link.label ||
                "Untitled link"
              }
              newItem={() => ({
                label: "",
                url: "",
              })}
              renderItem={(
                link,
                updateLink
              ) => (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <TextField
                    label="Label"
                    value={link.label ?? ""}
                    onChange={(value) =>
                      updateLink({
                        ...link,
                        label: value,
                      })
                    }
                  />

                  <TextField
                    label="Link URL"
                    value={link.url ?? ""}
                    onChange={(value) =>
                      updateLink({
                        ...link,
                        url: value,
                      })
                    }
                  />
                </div>
              )}
            />
          </div>
        )}
      />
    </div>
  )
}
