import { RepeaterList } from "./RepeaterList"
import { TextField, SelectField } from "./FormControls"
import { ImageUploadField } from "@/components/shared/ImageUploadField"

export interface CmsImage {
  url: string
  alt?: string
  device?: "desktop" | "mobile"
}

interface ImageListFieldProps {
  label?: string
  value: CmsImage[]
  onChange: (value: CmsImage[]) => void
  /** Show the desktop/mobile device selector (used for hero background images). */
  withDevice?: boolean
}

const DEVICE_OPTIONS = [
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
]

export function ImageListField({
  label = "Images",
  value,
  onChange,
  withDevice = false,
}: ImageListFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <RepeaterList<CmsImage>
        items={value ?? []}
        onChange={onChange}
        addLabel="Add image"
        emptyLabel="No images added."
        itemLabel={(item) =>
          item.alt || (withDevice ? item.device : undefined) || "Image"
        }
        newItem={() => ({
          url: "",
          alt: "",
          device: withDevice ? "desktop" : undefined,
        })}
        renderItem={(item, update) => (
          <div className="flex flex-col gap-2">
            <ImageUploadField
              label="Image"
              value={item.url}
              onChange={(v) => update({ ...item, url: v })}
            />
            <TextField
              label="Alt text"
              value={item.alt ?? ""}
              onChange={(v) => update({ ...item, alt: v })}
              placeholder="Describe the image for accessibility"
            />
            {withDevice && (
              <SelectField
                label="Device"
                value={item.device ?? "desktop"}
                onChange={(v) =>
                  update({ ...item, device: v as CmsImage["device"] })
                }
                options={DEVICE_OPTIONS}
              />
            )}
          </div>
        )}
      />
    </div>
  )
}
