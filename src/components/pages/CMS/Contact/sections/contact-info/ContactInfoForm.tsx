import { FormSection, DynamicStyledField } from "@/components/pages/CMS/shared/FormControls"
import { RepeaterList } from "@/components/pages/CMS/shared/RepeaterList"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import { SingleButtonField } from "@/components/pages/CMS/shared/ButtonsField"
import type { ContactFormSectionProps } from "../../config/contactSections"
import { emptyContactInfo } from "./emptyContactInfo"

export function ContactInfoForm({
  section,
  index,
  updateSection,
  openSections,
  toggleSection,
  sectionNumber,
}: ContactFormSectionProps) {
  const contactInfo = section || {}
  const isOpen = Boolean(openSections["contact-info"])

  const updateContactInfoField = (fieldKey: string, value: any) => {
    updateSection(index, { [fieldKey]: value })
  }

  const items = Array.isArray(contactInfo.items) ? contactInfo.items : []

  return (
    <FormSection
      title="Contact Info Items"
      sectionNumber={String(sectionNumber)}
      active={isOpen}
      onClick={() => toggleSection("contact-info")}
    >
      <div className="flex flex-col gap-5">
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <RepeaterList
            title="Contact Info Items"
            items={items}
            collapsible
            itemLabel={(item, _idx) => {
              const labelVal = typeof item?.label === "object" ? item.label?.value : item?.label
              const subtitleVal = typeof item?.subtitle === "object" ? item.subtitle?.value : item?.subtitle
              return labelVal || subtitleVal || `Contact Item ${_idx + 1}`
            }}
            newItemTemplate={() => ({
              label: {
                value: "NEW CONTACT ITEM",
                textColor: "#6B7280",
                textOpacity: 1,
                backgroundColor: null,
                backgroundOpacity: 1,
              },
              subtitle: {
                value: "contact@example.com",
                textColor: "#182D09",
                textOpacity: 1,
                backgroundColor: null,
                backgroundOpacity: 1,
              },
              button: {
                label: "",
                url: "",
                variant: "PRIMARY",
                style: "primary",
                rounded: "none",
                backgroundColor: "#182D09",
                backgroundOpacity: 100,
                textColor: "#ffffff",
                textOpacity: 100,
                target: "_self",
                showIcon: true,
              },
              multimedia: {
                show: "image",
                color: { color: "#E5E7EB", opacity: 100 },
                image: { url: "", alt: "Contact Icon", opacity: 100 },
                video: { url: "", opacity: 100 },
              },
            })}
            onChange={(updatedItems) =>
              updateContactInfoField("items", updatedItems)
            }
            renderItem={(item, updateItem, _idx) => (
              <div className="flex flex-col gap-4">
                <UniversalMultimediaForm
                  title={`Item ${_idx + 1} Icon / Media`}
                  fieldName={`item.${_idx}.multimedia`}
                  defaultShow="image"
                  imageFieldName={`contactInfoItemImage${_idx}`}
                  videoFieldName={`contactInfoItemVideo${_idx}`}
                  value={item.multimedia}
                  onChange={(multimedia) => updateItem({ ...item, multimedia })}
                />

                <DynamicStyledField
                  type="text"
                  label="Item Label"
                  fieldName={`item.${_idx}.label`}
                  placeholder="e.g. EMAIL"
                  value={item.label}
                  onChange={(val) => updateItem({ ...item, label: val })}
                  enableStyle
                />

                <DynamicStyledField
                  type="text"
                  label="Item Subtitle"
                  fieldName={`item.${_idx}.subtitle`}
                  placeholder="e.g. hello@miratravel.com"
                  value={item.subtitle}
                  onChange={(val) => updateItem({ ...item, subtitle: val })}
                  enableStyle
                />

                <SingleButtonField
                  label={`Item ${_idx + 1} Action Button`}
                  fieldName={`item.${_idx}.button`}
                  value={item.button}
                  onChange={(btn) => updateItem({ ...item, button: btn })}
                />
              </div>
            )}
          />
        </div>

        <UniversalMultimediaForm
          title="Section Background Media"
          fieldName="contactInfo.backgroundMultimedia"
          defaultShow="color"
          imageFieldName="cmsContactInfoBackgroundImage"
          videoFieldName="cmsContactInfoBackgroundVideo"
          value={
            contactInfo.backgroundMultimedia ||
            emptyContactInfo.backgroundMultimedia
          }
          onChange={(multimedia) =>
            updateContactInfoField("backgroundMultimedia", multimedia)
          }
        />
      </div>
    </FormSection>
  )
}

export default ContactInfoForm

