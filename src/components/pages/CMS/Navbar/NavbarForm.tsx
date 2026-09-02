import { useCmsPage } from "../shared/useCmsPage"
import { SaveBar } from "../shared/SaveBar"
import { TextField, ColorField } from "../shared/FormControls"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import type { NavbarPageData } from "./navbarTypes"

export const NavbarForm = () => {
  const { page, setPage, isLoading, isSaving, save } =
    useCmsPage<NavbarPageData>("navbar", "Navbar")

  if (isLoading || !page) {
    return (
      <div className="flex flex-col">
        <SaveBar
          title="Navbar"
          description="Manage the site-wide navbar branding and theme."
          onSave={save}
          isSaving={isSaving}
          isLoading={isLoading}
        />

        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading navbar...
          </p>
        </div>
      </div>
    )
  }

  const updateTheme = (
    key: keyof NavbarPageData["data"]["theme"],
    value: string
  ) => {
    setPage({
      ...page,
      data: {
        ...page.data,
        theme: {
          ...page.data.theme,
          [key]: value,
        },
      },
    })
  }

  const updateBrand = (
    key: keyof NavbarPageData["data"]["content"]["brand"],
    value: string
  ) => {
    setPage({
      ...page,
      data: {
        ...page.data,
        content: {
          ...page.data.content,
          brand: {
            ...page.data.content.brand,
            [key]: value,
          },
        },
      },
    })
  }

  return (
    <div className="flex flex-col">
      <SaveBar
        title="Navbar"
        description="Manage the site-wide navbar branding and theme."
        onSave={save}
        isSaving={isSaving}
        isLoading={isLoading}
      />

      <div className="flex flex-col gap-6 p-4">

        {/* Brand */}
        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-3 text-xs font-semibold text-foreground">
            Brand
          </p>

          <div className="flex flex-col gap-3">

            <TextField
              label="Brand name"
              value={page.data.content.brand.name}
              onChange={(value) =>
                updateBrand("name", value)
              }
            />

            <ImageUploadField
              label="Logo"
              fieldName="content.brand.logo"
              value={page.data.content.brand.logo}
              onChange={(value) =>
                updateBrand("logo", value)
              }
            />

            <TextField
              label="Logo alt text"
              value={page.data.content.brand.alt}
              onChange={(value) =>
                updateBrand("alt", value)
              }
            />

            <TextField
              label="Brand URL"
              value={page.data.content.brand.url}
              onChange={(value) =>
                updateBrand("url", value)
              }
            />

          </div>
        </div>

        {/* Navbar Theme */}
        <div className="rounded-lg border border-border/60 p-3">
          <p className="mb-3 text-xs font-semibold text-foreground">
            Navbar Theme
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

            <ColorField
              label="Background color"
              value={page.data.theme.backgroundColor}
              onChange={(value) =>
                updateTheme("backgroundColor", value)
              }
            />

            <ColorField
              label="Text color"
              value={page.data.theme.textColor}
              onChange={(value) =>
                updateTheme("textColor", value)
              }
            />

            <ColorField
              label="Active color"
              value={page.data.theme.activeColor}
              onChange={(value) =>
                updateTheme("activeColor", value)
              }
            />

          </div>
        </div>

      </div>
    </div>
  )
}