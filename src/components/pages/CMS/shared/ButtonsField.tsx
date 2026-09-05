import { RepeaterList } from "./RepeaterList"
import { ColorField, TextField, SelectField } from "./FormControls"

export interface CmsButton {
  label: string
  url: string
  style?: string
  backgroundColor?: string
  textColor?: string
}

interface ButtonsFieldProps {
  label?: string
  value: CmsButton[]
  onChange: (value: CmsButton[]) => void
}

const STYLE_OPTIONS = [
  { value: "primary", label: "Primary" },
  { value: "outline", label: "Outline" },
  { value: "secondary", label: "Secondary" },
  { value: "link", label: "Link" },
]

export function ButtonsField({
  label = "Buttons",
  value,
  onChange,
}: ButtonsFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <RepeaterList<CmsButton>
        items={value ?? []}
        onChange={onChange}
        addLabel="Add button"
        emptyLabel="No buttons added."
        itemLabel={(item) => item.label || "Untitled button"}
        newItem={() => ({ label: "", url: "", style: "primary" })}
        renderItem={(item, update) => (
          <div className="grid grid-cols-2 gap-2">
            <TextField
              label="Label"
              value={item.label}
              onChange={(v) => update({ ...item, label: v })}
              className="col-span-2"
            />
            <TextField
              label="Link URL"
              value={item.url}
              onChange={(v) => update({ ...item, url: v })}
              className="col-span-2"
            />
            <SelectField
              label="Style"
              value={item.style ?? "primary"}
              onChange={(v) =>
                update({ ...item, style: v as CmsButton["style"] })
              }
              options={STYLE_OPTIONS}
              className="col-span-2"
            />
            <ColorField
              label="Background color"
              value={item.backgroundColor ?? "#1F3A1B"}
              onChange={(v) => update({ ...item, backgroundColor: v })}
            />
            <ColorField
              label="Text color"
              value={item.textColor ?? "#FFFFFF"}
              onChange={(v) => update({ ...item, textColor: v })}
            />
          </div>
        )}
      />
    </div>
  )
}
