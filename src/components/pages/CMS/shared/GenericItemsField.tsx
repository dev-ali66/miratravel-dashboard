import { RepeaterList } from "./RepeaterList"
import {
  TextField,
  TextAreaField,
  NumberField,
  SwitchField,
} from "./FormControls"
import { ImageUploadField } from "@/components/shared/ImageUploadField"

export type ItemFieldType =
  | "text"
  | "textarea"
  | "number"
  | "image"
  | "tags"
  | "boolean"

export interface ItemFieldConfig {
  key: string
  label: string
  type: ItemFieldType
  placeholder?: string
}

interface GenericItemsFieldProps {
  label?: string
  fields: ItemFieldConfig[]
  items: Record<string, any>[]
  onChange: (items: Record<string, any>[]) => void
  titleKey?: string
  newItem: () => Record<string, any>
}

export function GenericItemsField({
  label = "Items",
  fields,
  items,
  onChange,
  titleKey = "title",
  newItem,
}: GenericItemsFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <RepeaterList<Record<string, any>>
        items={items ?? []}
        onChange={onChange}
        addLabel="Add item"
        emptyLabel="No items added."
        itemLabel={(item) => item[titleKey] || "Untitled item"}
        newItem={newItem}
        renderItem={(item, update) => (
          <div className="flex flex-col gap-2.5">
            {fields.map((field) => {
              const value = item[field.key]

              if (field.type === "image") {
                return (
                  <div key={field.key} className="flex flex-col gap-2">
                    <ImageUploadField
                      label={field.label}
                      value={value?.url ?? ""}
                      onChange={(url) =>
                        update({
                          ...item,
                          [field.key]: { ...(value ?? {}), url },
                        })
                      }
                    />
                    <TextField
                      label={`${field.label} alt text`}
                      value={value?.alt ?? ""}
                      onChange={(alt) =>
                        update({
                          ...item,
                          [field.key]: { ...(value ?? {}), alt },
                        })
                      }
                    />
                  </div>
                )
              }

              if (field.type === "textarea") {
                return (
                  <TextAreaField
                    key={field.key}
                    label={field.label}
                    value={value ?? ""}
                    placeholder={field.placeholder}
                    onChange={(v) => update({ ...item, [field.key]: v })}
                  />
                )
              }

              if (field.type === "number") {
                return (
                  <NumberField
                    key={field.key}
                    label={field.label}
                    value={value}
                    placeholder={field.placeholder}
                    onChange={(v) => update({ ...item, [field.key]: v })}
                  />
                )
              }

              if (field.type === "boolean") {
                return (
                  <SwitchField
                    key={field.key}
                    label={field.label}
                    checked={Boolean(value)}
                    onChange={(v) => update({ ...item, [field.key]: v })}
                  />
                )
              }

              if (field.type === "tags") {
                return (
                  <TextField
                    key={field.key}
                    label={field.label}
                    value={Array.isArray(value) ? value.join(", ") : ""}
                    placeholder={
                      field.placeholder ??
                      "Comma separated, e.g. NATURE, CULTURE"
                    }
                    onChange={(v) =>
                      update({
                        ...item,
                        [field.key]: String(v)
                          .split(",")
                          .map((t: string) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                )
              }

              return (
                <TextField
                  key={field.key}
                  label={field.label}
                  value={value ?? ""}
                  placeholder={field.placeholder}
                  onChange={(v) => update({ ...item, [field.key]: v })}
                />
              )
            })}
          </div>
        )}
      />
    </div>
  )
}
