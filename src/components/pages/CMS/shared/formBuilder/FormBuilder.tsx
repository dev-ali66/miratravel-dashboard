import { DynamicStyledField } from "../FormControls"
import { BuilderButtonField } from "./ButtonField"
import type { FormBuilderField, FormBuilderProps } from "./fieldTypes"
import { uploadFile } from "@/services/fileUpload"

const typeOptions = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "textarea", label: "Textarea" },
  { value: "checkbox", label: "Checkbox" },
  { value: "radio", label: "Radio button" },
  { value: "select", label: "Select dropdown" },
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "file", label: "File" },
]

export const FormBuilder = ({
  fields,
  onChange,
  onAdd,
  onRemove,
}: FormBuilderProps) => (
  <div className="flex flex-col gap-3">
    <BuilderButtonField label="Add form field" onClick={onAdd} />
    {fields.map((field, index) => (
      <details
        key={field.id}
        className="group rounded-md border border-border/50 p-3"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-semibold">
          <span>{field.label || `Field ${index + 1}`}</span>
          <button
            type="button"
            className="text-destructive"
            onClick={(event) => {
              event.preventDefault()
              onRemove(index)
            }}
          >
            Delete
          </button>
        </summary>
        <div className="mt-3 flex flex-col gap-3">
          <DynamicStyledField
            type="text"
            label="Label"
            value={field.label}
            onChange={(value) => onChange(index, { label: value })}
            enableStyle
            style={field.labelStyle}
            onStyleChange={(style) => onChange(index, { labelStyle: style })}
          />
          <DynamicStyledField
            type="text"
            label="Field name"
            value={field.name ?? field.id}
            onChange={(value) => onChange(index, { name: value })}
            enableStyle
            style={field.nameStyle}
            onStyleChange={(style) => onChange(index, { nameStyle: style })}
          />
          <DynamicStyledField
            type="text"
            label="Placeholder"
            value={field.placeholder ?? ""}
            onChange={(value) => onChange(index, { placeholder: value })}
            enableStyle
            style={field.placeholderStyle}
            onStyleChange={(style) =>
              onChange(index, { placeholderStyle: style })
            }
          />
          <DynamicStyledField
            type="select"
            label="Field type"
            value={field.type}
            options={typeOptions}
            onChange={(value) => onChange(index, { type: value })}
          />
          {["image", "video", "file"].includes(field.type) && (
            <>
              <DynamicStyledField
                type="select"
                label="Multimedia type"
                value={field.mediaType ?? field.type}
                options={[
                  { value: "image", label: "Image" },
                  { value: "video", label: "Video" },
                  { value: "file", label: "File" },
                  { value: "multimedia", label: "Multimedia" },
                ]}
                onChange={(value) =>
                  onChange(index, {
                    mediaType: value as FormBuilderField["mediaType"],
                  })
                }
              />
              <DynamicStyledField
                type="text"
                label="Allowed extensions"
                value={field.allowedExtensions ?? ""}
                placeholder="jpg, png, mp4, pdf"
                onChange={(value) =>
                  onChange(index, { allowedExtensions: value })
                }
              />
            </>
          )}
          <DynamicStyledField
            type="switch"
            label="Required"
            checked={field.required ?? false}
            onChange={(checked) => onChange(index, { required: checked })}
          />
          <DynamicStyledField
            type="text"
            label="Required error message"
            value={field.requiredErrorMessage ?? "This field is required"}
            onChange={(value) =>
              onChange(index, { requiredErrorMessage: value })
            }
            enableStyle
            style={field.requiredErrorStyle}
            onStyleChange={(style) =>
              onChange(index, { requiredErrorStyle: style })
            }
          />
          {field.type === "image" || field.type === "video" ? (
            <DynamicStyledField
              type={field.type}
              label={`Upload ${field.mediaType ?? field.type}`}
              value={field.mediaUrl ?? ""}
              fieldName={`contactFormBuilder_${field.name ?? field.id}`}
              onChange={(value) => onChange(index, { mediaUrl: value })}
            />
          ) : field.type === "file" ? (
            <label className="flex flex-col gap-1.5 text-xs font-semibold text-foreground">
              Upload file
              <input
                type="file"
                accept={field.allowedExtensions
                  ?.split(",")
                  .map((extension) => extension.trim())
                  .filter(Boolean)
                  .map((extension) =>
                    extension.startsWith(".") ? extension : `.${extension}`
                  )
                  .join(",")}
                onChange={async (event) => {
                  const file = event.target.files?.[0]
                  if (!file) return
                  const url = await uploadFile(
                    file,
                    `contactFormBuilder_${field.name ?? field.id}`
                  )
                  onChange(index, { mediaUrl: url })
                  event.target.value = ""
                }}
                className="rounded border border-input p-2 text-xs font-normal"
              />
            </label>
          ) : null}
          <DynamicStyledField
            type="text"
            label="Regex pattern"
            value={field.pattern ?? ""}
            onChange={(value) => onChange(index, { pattern: value })}
          />
          <DynamicStyledField
            type="text"
            label="Custom error message"
            value={field.errorMessage ?? ""}
            onChange={(value) => onChange(index, { errorMessage: value })}
            enableStyle
            style={field.errorStyle}
            onStyleChange={(style) => onChange(index, { errorStyle: style })}
          />
          <DynamicStyledField
            type="color"
            label="Field box background color"
            value={field.fieldStyle?.backgroundColor ?? "#FFFFFF"}
            onChange={(value) =>
              onChange(index, {
                fieldStyle: {
                  ...(field.fieldStyle ?? {}),
                  backgroundColor: value,
                },
              })
            }
          />
          <DynamicStyledField
            type="image"
            label="Field icon/file"
            value={field.icon ?? ""}
            fieldName="contactFormBuilderFile"
            onChange={(value) => onChange(index, { icon: value })}
          />
          {(field.type === "select" ||
            field.type === "radio" ||
            field.type === "checkbox" ||
            field.type === "chipSelect") && (
            <BuilderButtonField
              label="Add option"
              onClick={() =>
                onChange(index, {
                  options: [
                    ...(field.options ?? []),
                    { value: `option-${Date.now()}`, label: "New option" },
                  ],
                })
              }
            />
          )}
          {(field.options ?? []).map((option, optionIndex) => (
            <div
              key={optionIndex}
              className="rounded-md border border-border/40 p-2"
            >
              <DynamicStyledField
                type="text"
                label="Option label"
                value={option.label}
                onChange={(value) => {
                  const options = [...(field.options ?? [])]
                  options[optionIndex] = {
                    ...options[optionIndex],
                    label: value,
                  }
                  onChange(index, { options })
                }}
              />
              <DynamicStyledField
                type="text"
                label="Option value"
                value={option.value}
                onChange={(value) => {
                  const options = [...(field.options ?? [])]
                  options[optionIndex] = { ...options[optionIndex], value }
                  onChange(index, { options })
                }}
              />
              <button
                type="button"
                className="self-start text-[11px] text-destructive"
                onClick={() => {
                  const options = (field.options ?? []).filter(
                    (_, currentIndex) => currentIndex !== optionIndex
                  )
                  onChange(index, { options })
                }}
              >
                Delete option
              </button>
            </div>
          ))}
        </div>
      </details>
    ))}
  </div>
)
