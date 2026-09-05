# CMS Reusable Page Workflow

এই document-এ CMS-এর Home, Navbar, Footer, FAQ, Contact এবং CTA page-এর reusable form ও preview architecture বর্ণনা করা হলো। লক্ষ্য হলো সব page-এ একই ধরনের component, registry এবং draft preview flow ব্যবহার করা।

## ১. Single Source Of Truth

প্রতিটি page-এর section order এবং component registry একটি config file-এ থাকবে।

```text
config/
  homeSections.ts
  navbarSections.ts
  footerSections.ts
  faqSections.ts
  contactSections.ts
  ctaSections.ts
```

প্রতিটি registry-তে থাকবে:

- Section key
- Section label
- Form component
- Preview component বা preview slot
- Section order

উদাহরণ:

```tsx
export const sectionRegistry = {
  hero: {
    label: "Hero",
    form: HeroForm,
    preview: HeroPreview,
  },
}

export const sectionOrder = ["hero"]
```

Form এবং preview দুটোই একই order/config অনুসরণ করবে। ফলে order পরিবর্তন করলে দুই জায়গাতেই একই পরিবর্তন হবে।

## ২. Shared Form Components

সব page-এর form-এ reusable shared components ব্যবহার করতে হবে।

### DynamicStyledField

Text, textarea, number, color, select, switch, image এবং video field-এর জন্য ব্যবহার হবে।

```tsx
<DynamicStyledField
  type="text"
  label="Title"
  value={value}
  onChange={setValue}
  enableStyle
  style={fieldStyle}
  onStyleChange={setFieldStyle}
/>
```

সমর্থিত type:

- `text`
- `textarea`
- `number`
- `color`
- `select`
- `switch`
- `image`
- `video`

### UniversalMultimediaForm

যেখানে image, video বা color-এর মধ্যে selection দরকার সেখানে এই component ব্যবহার করতে হবে।

```tsx
<UniversalMultimediaForm
  section={section}
  content={content}
  updateSection={updateSection}
  updateSectionContent={updateSectionContent}
  contentMediaKey="backgroundMultimedia"
  showColorPicker
  imageFieldName="pageBackgroundImage"
  videoFieldName="pageBackgroundVideo"
  showVideoSwitches
/>
```

এটি নিয়ন্ত্রণ করে:

- Image
- Video
- Color
- Background type dropdown
- Image/video upload
- Alt text
- Image/video opacity
- Overlay color
- Overlay opacity
- Autoplay
- Loop
- Muted

একই page-এর আলাদা media-এর জন্য আলাদা key ব্যবহার করতে হবে।

```text
backgroundMultimedia
contentMultimedia
leftMultimedia
rightMultimedia
brandMultimedia
footerBackgroundMultimedia
footerBrandMultimedia
```

একটি media key কখনো একাধিক আলাদা media surface-এ ব্যবহার করা যাবে না।

### UniversalMultimediaPreview

Form-এ যে media key ব্যবহার করা হবে, preview-তেও একই key ব্যবহার করতে হবে।

```tsx
<UniversalMultimediaPreview
  multimedia={content.backgroundMultimedia}
  mode="background"
  className="absolute inset-0"
  containerClassName="absolute inset-0"
/>
```

Preview support করে:

- Image
- Video
- Color
- Opacity
- Overlay
- Autoplay
- Loop
- Muted
- Nested `imageData`
- Nested `videoData`

## ৩. Shared SEO Form

সব page-এর SEO form shared universal `SeoForm` ব্যবহার করবে।

```tsx
<SeoForm
  metadata={page.metadata}
  onChange={(metadata) =>
    setPage({ ...page, metadata })
  }
/>
```

SEO fields:

- Meta title
- Meta description
- Keywords
- Canonical URL
- Robots index
- Robots follow

SEO section সাধারণত সব section-এর শেষে থাকবে। SEO form registry-এর main content section-এর অংশ হবে না, যদি Home/Navbar-এর মতো bottom section pattern ব্যবহার করা হয়।

## ৪. Shared Buttons Field

Home Hero-এর pattern অনুসারে button control-এর জন্য `ButtonsField` ব্যবহার করতে হবে।

```tsx
<ButtonsField
  value={section.buttons ?? []}
  onChange={(buttons) => updateSectionButtons(index, buttons)}
/>
```

Button-এর মধ্যে থাকতে পারে:

- Label
- URL
- Style
- Background color
- Text color
- Action
- API URL

## ৫. Draft এবং Live Preview Flow

CMS draft flow:

```text
Form field change
  -> setPage
  -> useCmsPage
  -> CmsDraftContext
  -> Live Preview
```

`useCmsPage` page state update করলে `CmsDraftContext`-এ draft publish হয়। Preview component `useCmsDraft` দিয়ে সেই draft পড়ে।

```tsx
const page = useCmsDraft<PageData>()
```

কোনো save না করেও form-এর পরিবর্তন live preview-তে দেখা যাবে।

## ৬. Payload Flow

CMS save payload-এর shape:

```json
{
  "id": "cms-page-id",
  "slug": "home",
  "metadata": {
    "title": "Page title",
    "description": "Page description",
    "keywords": [],
    "canonicalUrl": "",
    "robots": {
      "index": true,
      "follow": true
    }
  },
  "data": {
    "page": "home",
    "theme": {},
    "sections": []
  }
}
```

SEO metadata top-level `metadata`-তে যাবে। এটি `data.metadata` হিসেবে nested করা যাবে না।

## ৭. Page অনুযায়ী Workflow

## Home

Config:

```text
Home/config/homeSections.ts
```

Sections:

- Hero
- Explore Journeys
- Destinations
- Mira Stories
- Why Mira
- Travel Insights
- Custom Journey CTA

প্রতিটি section:

- `DynamicStyledField`
- `UniversalMultimediaForm`
- `ButtonsField`
- Section-specific preview

ব্যবহার করে। SEO form section order-এর শেষে universal shared `SeoForm` হিসেবে থাকে।

Hero media key-এর উদাহরণ:

```text
backgroundMultimedia
```

Hero preview একই key-এর মাধ্যমে `UniversalMultimediaPreview` ব্যবহার করে।

## Navbar

Config:

```text
Navbar/config/navbarSections.ts
```

Sections:

- Brand
- Navbar Theme

Brand section-এ:

- Brand name
- Brand URL
- Brand image/video/color
- Dynamic text style
- Universal multimedia form

Brand media এবং Navbar theme আলাদা data surface হিসেবে রাখতে হবে। SEO form bottom-এ থাকবে।

## Footer

Config:

```text
Footer/config/footerSections.ts
```

Form sections:

- Footer Appearance
- Social Appearance
- Brand
- Link Columns
- Contact
- Social Links
- Newsletter
- Certifications
- Bottom / Copyright

Footer media key আলাদা রাখতে হবে:

```text
footerBackgroundMultimedia
footerBrandMultimedia
```

Footer background এবং Footer brand একই key ব্যবহার করতে পারবে না।

Footer preview-তে:

- Background media: `UniversalMultimediaPreview`
- Brand media: `UniversalMultimediaPreview`
- Certification image: `UniversalMultimediaPreview`
- SEO: bottom shared `SeoForm`

## FAQ

Config:

```text
Faq/config/faqSections.ts
```

Sections:

- FAQ Content
- Background
- FAQ Appearance
- Questions

FAQ content-এর মধ্যে:

- Eyebrow
- Title
- Subtitle
- Description
- প্রতিটি text field-এর DynamicStyledField style
- Content multimedia

FAQ background-এর মধ্যে:

- Image
- Video
- Color
- Opacity
- Overlay
- Video switches

FAQ preview registry-driven এবং background ও content media `UniversalMultimediaPreview` ব্যবহার করে। SEO form section order-এর শেষে shared `SeoForm` হিসেবে থাকে।

## Contact

Config:

```text
Contact/config/contactSections.ts
```

৬টি আলাদা form component:

- Page Hero
- Process Steps
- Inquiry Form
- Personal Approach
- Contact Information
- Final CTA

প্রতিটি section আলাদা reusable form component ব্যবহার করবে।

### Page Hero

- Hero text fields
- Dynamic styles
- Universal hero media
- Image/video/color dropdown
- Live preview

### Process Steps

- Section title
- Steps repeater
- Step title/description
- Universal background media
- Image/video/color dropdown

### Inquiry Form

Shared `FormBuilder` ব্যবহার করে:

- Field add
- Field delete
- Custom field name
- Text
- Email
- Textarea
- Checkbox
- Radio
- Select dropdown
- Required field
- Required error message
- Regex
- Custom error message
- Field icon
- Field background color
- Placeholder color
- Allowed extensions
- Image/video/file upload

Inquiry side media এবং inquiry background media আলাদা key-তে রাখতে হবে:

```text
sideMultimedia
contentMultimedia
```

### Personal Approach

- Eyebrow
- Title
- Description
- Left media
- Background media
- Dynamic styles

Media key আলাদা:

```text
leftMultimedia
contentMultimedia
```

### Contact Information

- Contact item repeater
- Label
- Value
- URL
- Item icon media
- Background multimedia

### Final CTA

- Title
- Description
- Background multimedia
- Shared `ButtonsField`

Contact preview একই section data ব্যবহার করবে। Legacy image fallback থাকলে তা fallback হিসেবে রাখা যাবে।

## CTA

Config:

```text
Cta/config/ctaSections.ts
```

Sections:

- CTA Content
- Background
- Buttons

CTA media surface আলাদা:

```text
backgroundMultimedia
rightMultimedia
```

CTA preview-তে:

- Background media universal preview
- Right-side media universal preview
- Dynamic title/description styles
- Shared ButtonsField style

## ৮. Form Builder Workflow

Reusable FormBuilder path:

```text
CMS/shared/formBuilder/
```

Core files:

- `FormBuilder.tsx`
- `FormBuilderPreview.tsx`
- `PreviewField.tsx`
- `TextField.tsx`
- `TextAreaField.tsx`
- `SelectField.tsx`
- `RadioField.tsx`
- `FileField.tsx`
- `ButtonField.tsx`
- `fieldTypes.ts`

FormBuilder preview field structure:

```text
Label
Field name
Field icon
Field box background
Placeholder
Input/select/textarea
Required error
Custom error
```

Validation:

- Required
- Regex
- Minimum length/value
- Maximum length/value
- Custom error message
- Required error message

Media field:

- Image upload
- Video upload
- File upload
- Multimedia type
- Allowed extensions
- Uploaded media preview

## ৯. Naming Rules

প্রতিটি media surface-এর আলাদা naming থাকতে হবে।

ভালো:

```text
footerBackgroundMultimedia
footerBrandMultimedia
contactBackgroundMultimedia
contactSideMultimedia
ctaBackgroundMultimedia
ctaRightMultimedia
```

খারাপ:

```text
media
background
image
```

কারণ একই generic key ব্যবহার করলে এক section-এর media অন্য section overwrite করতে পারে।

## ১০. Preview Rules

Preview-তে direct `<img>` বা direct background string ব্যবহার না করে সম্ভব হলে:

```tsx
<UniversalMultimediaPreview />
```

ব্যবহার করতে হবে।

Preview অবশ্যই:

- Draft context থেকে data নেবে
- Form-এর একই data key পড়বে
- Image/video/color type respect করবে
- Nested media data resolve করবে
- Form-এর DynamicStyledField styles apply করবে
- Existing layout flow পরিবর্তন করবে না

## ১১. Validation Checklist

প্রতিটি নতুন page বা section শেষ করার আগে যাচাই করতে হবে:

- Form config registry-তে আছে
- Section order config থেকে আসছে
- Form component আলাদা reusable
- Preview component আলাদা reusable
- SEO shared universal form ব্যবহার করছে
- Text/textarea/number/color/switch DynamicStyledField ব্যবহার করছে
- Media UniversalMultimediaForm ব্যবহার করছে
- Preview UniversalMultimediaPreview ব্যবহার করছে
- Form এবং preview একই media key ব্যবহার করছে
- Media key অন্য section-এর সঙ্গে conflict করছে না
- Dropdown change করলে draft update হচ্ছে
- Draft update হলে live preview update হচ্ছে
- Image/video/color তিন mode preview হচ্ছে
- Button update preview-তে দেখা যাচ্ছে
- Required/regex/custom validation message কাজ করছে
- API URL থাকলে payload POST হচ্ছে
- API URL না থাকলে console fallback হচ্ছে
- `npm run build` সফল

## ১২. Build Command

```bash
npm run build
```

Build সফল হওয়া পর্যন্ত TypeScript এবং Vite error ঠিক করতে হবে। Node deprecation বা বড় chunk warning non-blocking warning হিসেবে আলাদা করে বিবেচনা করতে হবে।
