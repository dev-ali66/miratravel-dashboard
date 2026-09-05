import { useState } from "react"
import { UniversalMultimediaPreview } from "../../Home/shared/preview/UniversalMultimediaPreview"
import type { FormBuilderField } from "./fieldTypes"

const styleValue = (style: any, fallback?: string) => ({
  color: style?.textColor ?? fallback,
  backgroundColor: style?.backgroundColor,
  opacity:
    style?.textOpacity === undefined ? undefined : style.textOpacity / 100,
})

const fieldStyle = (style: any, fallback?: string) =>
  ({
    ...styleValue(style, fallback),
    "--form-field-placeholder": style?.textColor ?? fallback,
  }) as React.CSSProperties

export const PreviewField = ({ field }: { field: FormBuilderField }) => {
  const [error, setError] = useState("")
  const fieldName = field.name ?? field.id
  const labelStyle = styleValue(field.labelStyle, "#24351C")
  const inputStyle = fieldStyle(field.fieldStyle, "#24351C")
  const placeholderStyle = fieldStyle(field.placeholderStyle, "#6B7280")
  const inputWithPlaceholderStyle = {
    ...inputStyle,
    color: placeholderStyle.color,
    backgroundColor: inputStyle.backgroundColor,
    opacity: placeholderStyle.opacity,
    "--form-field-placeholder": (placeholderStyle as any)[
      "--form-field-placeholder"
    ],
  } as React.CSSProperties
  const showError = (message: string) => setError(message)
  const clearError = () => setError("")
  const validationProps = {
    required: field.required,
    minLength: field.minLength,
    maxLength: field.maxLength,
    pattern: field.pattern,
    onInvalid: (
      event: React.InvalidEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      showError(
        field.required && !event.currentTarget.value
          ? (field.requiredErrorMessage ?? "This field is required")
          : (field.errorMessage ?? "Please enter a valid value")
      )
    },
    onInput: clearError,
  }

  if (["image", "video", "file"].includes(field.type)) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 text-[8px]" style={labelStyle}>
          {field.icon && (
            <UniversalMultimediaPreview
              multimedia={{ type: "image", url: field.icon }}
              className="h-4 w-4 object-contain"
              containerClassName="h-4 w-4"
            />
          )}
          {field.label}
        </div>
        <span
          className="text-[8px]"
          style={styleValue(field.nameStyle, "#737373")}
        >
          Field name: {fieldName}
        </span>
        <div
          className="rounded border border-dashed border-black/20 p-3 text-[8px]"
          style={fieldStyle(field.fieldStyle, "#FFFFFF")}
        >
          {field.type === "image" || field.mediaType === "image"
            ? "Image upload"
            : field.type === "video" || field.mediaType === "video"
              ? "Video upload"
              : "File upload"}
          {field.allowedExtensions && (
            <span className="ml-1">({field.allowedExtensions})</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-[8px]" style={labelStyle}>
        {field.icon && (
          <UniversalMultimediaPreview
            multimedia={{ type: "image", url: field.icon }}
            className="h-4 w-4 object-contain"
            containerClassName="h-4 w-4"
          />
        )}
        {field.mediaUrl &&
          (field.type === "image" || field.mediaType === "image") && (
            <UniversalMultimediaPreview
              multimedia={{ type: "image", url: field.mediaUrl }}
              className="mb-2 h-24 w-full object-contain"
              containerClassName="h-24 w-full"
            />
          )}
        {field.mediaUrl &&
          (field.type === "video" || field.mediaType === "video") && (
            <UniversalMultimediaPreview
              multimedia={{ type: "video", url: field.mediaUrl }}
              className="mb-2 h-24 w-full object-contain"
              containerClassName="h-24 w-full"
            />
          )}
        {field.mediaUrl
          ? "Uploaded media"
          : field.type === "image" || field.mediaType === "image"
            ? "Image upload"
            : field.type === "video" || field.mediaType === "video"
              ? "Video upload"
              : "File upload"}
      </div>
      {/* <span className="text-left text-[8px] font-medium" style={styleValue(field.nameStyle, "#737373")}>
        Field name: {fieldName}
      </span> */}
      {field.type === "select" ? (
        <select
          name={fieldName}
          style={inputStyle}
          {...validationProps}
          className="contact-form-preview-field h-9 w-full border border-black/10 px-3 text-[9px]"
        >
          <option value="">Select an option</option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          name={fieldName}
          placeholder={field.placeholder}
          style={inputWithPlaceholderStyle}
          {...validationProps}
          className="contact-form-preview-field min-h-[90px] w-full border border-black/10 p-3 text-[9px]"
        />
      ) : ["radio", "checkbox", "chipSelect"].includes(field.type) ? (
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-1 border border-black/10 px-3 py-2 text-[7px]"
              style={inputStyle}
            >
              <input
                type={field.type === "radio" ? "radio" : "checkbox"}
                name={fieldName}
                value={option.value}
                defaultChecked={option.default}
              />
              {option.label}
            </label>
          ))}
        </div>
      ) : (
        <input
          name={fieldName}
          type={field.type}
          placeholder={field.placeholder}
          style={inputWithPlaceholderStyle}
          {...validationProps}
          className="contact-form-preview-field h-9 w-full border border-black/10 px-3 text-[9px]"
        />
      )}
      {error && (
        <span
          className="text-[8px]"
          style={styleValue(field.errorStyle, "#B91C1C")}
        >
          {error}
        </span>
      )}
    </div>
  )
}
