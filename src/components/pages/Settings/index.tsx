import MiraLoader from "@/components/shared/MiraLoader"
import { useState, useEffect } from "react"
import {
  Globe,
  Search,
  Save,
  RotateCcw,
  Building2,
  Image as ImageIcon,
  Share2,
  Sparkles,
  Terminal,
} from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { removeFiles } from "@/services/fileUpload"
import { useGetSettings, useUpdateSettings } from "@/hooks/settings/useSettings"

// Modular form components & types
import {
  type SiteSettingsState,
  type SocialLinkItem,
  defaultState,
  emptyImageMultimedia,
  emptyVideoMultimedia,
  normalizeMultimediaField,
} from "./settingsTypes"
import { IdentityForm } from "./forms/IdentityForm"
import { BrandAssetsForm } from "./forms/BrandAssetsForm"
import { SocialLinksForm } from "./forms/SocialLinksForm"
import { SocialMetaForm } from "./forms/SocialMetaForm"
import { SeoForm } from "./forms/SeoForm"

// Re-export types & helpers for external modules
export {
  emptyImageMultimedia,
  emptyVideoMultimedia,
  normalizeMultimediaField,
}
export type { SiteSettingsState, SocialLinkItem }

export default function SettingsPage() {
  const { data: settingsData, isLoading } = useGetSettings()
  const { mutate: updateSettings, isPending: isSaving } = useUpdateSettings()

  const [formData, setFormData] = useState<SiteSettingsState>(defaultState)

  useEffect(() => {
    if (settingsData) {
      let parsedSocialLinks: SocialLinkItem[] = []
      if (Array.isArray(settingsData.socialLinks)) {
        parsedSocialLinks = settingsData.socialLinks
      } else if (typeof settingsData.socialLinks === "string") {
        try {
          parsedSocialLinks = JSON.parse(settingsData.socialLinks)
        } catch {
          parsedSocialLinks = []
        }
      }

      setFormData((prev) => ({
        ...prev,
        ...settingsData,
        socialLinks: parsedSocialLinks,
        siteLogo: normalizeMultimediaField(settingsData.siteLogo, "image"),
        siteLogoLight: normalizeMultimediaField(settingsData.siteLogoLight, "image"),
        siteLogoDark: normalizeMultimediaField(settingsData.siteLogoDark, "image"),
        siteFavicon: normalizeMultimediaField(settingsData.siteFavicon, "image"),
        navbarLogo: normalizeMultimediaField(settingsData.navbarLogo, "image"),
        footerLogo: normalizeMultimediaField(settingsData.footerLogo, "image"),
        authLogo: normalizeMultimediaField(settingsData.authLogo, "image"),
        loadingVideo: normalizeMultimediaField(settingsData.loadingVideo, "video"),
      }))
    }
  }, [settingsData])

  const handleChange = (field: keyof SiteSettingsState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Social Links Array Operations
  const handleAddSocialLink = () => {
    const newLink: SocialLinkItem = {
      id: "soc_" + Date.now(),
      platform: "Instagram",
      title: "Instagram",
      url: "",
      icon: "",
      iconImage: "",
    }
    setFormData((prev) => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), newLink],
    }))
  }

  const handleUpdateSocialLink = (index: number, field: keyof SocialLinkItem, value: any) => {
    setFormData((prev) => {
      const updated = [...(prev.socialLinks || [])]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }
      return { ...prev, socialLinks: updated }
    })
  }

  const handleRemoveSocialLink = (index: number) => {
    const itemToRemove = formData.socialLinks[index]

    // Clean up uploaded image if present so no orphan file remains in cloud storage
    if (itemToRemove?.iconImage) {
      removeFiles([itemToRemove.iconImage]).catch((err) =>
        console.error("Failed to delete orphan social icon:", err)
      )
    }

    setFormData((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formData)
  }

  const handleReset = () => {
    if (settingsData) {
      let parsedSocialLinks: SocialLinkItem[] = []
      if (Array.isArray(settingsData.socialLinks)) {
        parsedSocialLinks = settingsData.socialLinks
      } else if (typeof settingsData.socialLinks === "string") {
        try {
          parsedSocialLinks = JSON.parse(settingsData.socialLinks)
        } catch {
          parsedSocialLinks = []
        }
      }
      setFormData({
        ...defaultState,
        ...settingsData,
        socialLinks: parsedSocialLinks,
        siteLogo: normalizeMultimediaField(settingsData.siteLogo, "image"),
        siteLogoLight: normalizeMultimediaField(settingsData.siteLogoLight, "image"),
        siteLogoDark: normalizeMultimediaField(settingsData.siteLogoDark, "image"),
        siteFavicon: normalizeMultimediaField(settingsData.siteFavicon, "image"),
        navbarLogo: normalizeMultimediaField(settingsData.navbarLogo, "image"),
        footerLogo: normalizeMultimediaField(settingsData.footerLogo, "image"),
        authLogo: normalizeMultimediaField(settingsData.authLogo, "image"),
        loadingVideo: normalizeMultimediaField(settingsData.loadingVideo, "video"),
      })
    } else {
      setFormData(defaultState)
    }
  }

  if (isLoading) {
    return (
      <MiraLoader text="Loading site settings..." className="min-h-[300px] py-12" />
    )
  }

  return (
    <div className="w-full space-y-6 pt-2 pb-16">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            <Globe className="h-7 w-7 text-primary" />
            Global Site Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Modular configuration forms for Identity, Brand Assets, Social Channels, Social Meta, and SEO.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              console.log("⚙️ [GLOBAL SITE SETTINGS PAYLOAD]:", formData)
              toast.info("Site settings payload logged to browser console (F12)")
            }}
            className="flex items-center gap-2 cursor-pointer"
            title="Inspect clean site settings payload in browser console (F12)"
          >
            <Terminal className="h-4 w-4 text-primary" />
            <span>Console Data</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving Settings..." : "Save Settings"}</span>
          </Button>
        </div>
      </div>

      {/* Separate Forms Tabs */}
      <Tabs defaultValue="identity" className="w-full space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto p-1 bg-muted/70 border border-border/50 gap-1">
          <TabsTrigger value="identity" className="flex items-center gap-2 py-2">
            <Building2 className="h-4 w-4" />
            <span>1. Identity</span>
          </TabsTrigger>

          <TabsTrigger value="brand" className="flex items-center gap-2 py-2">
            <ImageIcon className="h-4 w-4" />
            <span>2. Brand Assets</span>
          </TabsTrigger>

          <TabsTrigger value="social" className="flex items-center gap-2 py-2">
            <Share2 className="h-4 w-4" />
            <span>3. Social Links ({formData.socialLinks?.length || 0})</span>
          </TabsTrigger>

          <TabsTrigger value="meta" className="flex items-center gap-2 py-2">
            <Sparkles className="h-4 w-4" />
            <span>4. Social Meta</span>
          </TabsTrigger>

          <TabsTrigger value="seo" className="flex items-center gap-2 py-2">
            <Search className="h-4 w-4" />
            <span>5. SEO & Meta</span>
          </TabsTrigger>
        </TabsList>

        {/* FORM 1: IDENTITY */}
        <TabsContent value="identity" className="space-y-6">
          <IdentityForm formData={formData} handleChange={handleChange} />
        </TabsContent>

        {/* FORM 2: BRAND ASSETS */}
        <TabsContent value="brand" className="space-y-6">
          <BrandAssetsForm formData={formData} handleChange={handleChange} />
        </TabsContent>

        {/* FORM 3: SOCIAL LINKS */}
        <TabsContent value="social" className="space-y-6">
          <SocialLinksForm
            formData={formData}
            handleAddSocialLink={handleAddSocialLink}
            handleUpdateSocialLink={handleUpdateSocialLink}
            handleRemoveSocialLink={handleRemoveSocialLink}
          />
        </TabsContent>

        {/* FORM 4: SOCIAL META */}
        <TabsContent value="meta" className="space-y-6">
          <SocialMetaForm formData={formData} handleChange={handleChange} />
        </TabsContent>

        {/* FORM 5: SEO */}
        <TabsContent value="seo" className="space-y-6">
          <SeoForm formData={formData} handleChange={handleChange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
