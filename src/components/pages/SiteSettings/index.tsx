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
  Sliders,
  User,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PageHeader, CompactStatCard } from "@/components/shared/PageHeader"
import { useGetSettings, useUpdateSettings } from "@/hooks/settings/useSettings"

import {
  type SiteSettingsState,
  type SocialLinkItem,
  defaultState,
  normalizeMultimediaField,
} from "../Settings/settingsTypes"
import { IdentityForm } from "../Settings/forms/IdentityForm"
import { BrandAssetsForm } from "../Settings/forms/BrandAssetsForm"
import { SocialLinksForm } from "../Settings/forms/SocialLinksForm"
import { SocialMetaForm } from "../Settings/forms/SocialMetaForm"
import { SeoForm } from "../Settings/forms/SeoForm"

export default function SiteSettingsPage() {
  const navigate = useNavigate()
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

  const handleUpdateSocialLink = (
    index: number,
    field: keyof SocialLinkItem,
    value: any
  ) => {
    setFormData((prev) => {
      const links = [...(prev.socialLinks || [])]
      if (links[index]) {
        links[index] = { ...links[index], [field]: value }
      }
      return { ...prev, socialLinks: links }
    })
  }

  const handleRemoveSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      socialLinks: JSON.stringify(formData.socialLinks || []),
    }

    updateSettings(payload)
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
      {/* Page Header with 30% title & 70% compact statistics */}
      <PageHeader
        icon={Globe}
        title="Global Site Settings"
        subtitle="Modular configuration forms for Identity, Brand Assets, Social, Meta, and SEO."
        stats={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 w-full">
            <CompactStatCard
              label="Modules"
              value="5 Sections"
              subtext="Identity to SEO"
              icon={Sliders}
              iconColor="text-emerald-500"
            />
            <CompactStatCard
              label="Socials"
              value={`${formData?.socialLinks?.length || 4} Profiles`}
              subtext="Connected channels"
              icon={Share2}
              iconColor="text-blue-500"
            />
            <CompactStatCard
              label="Brand Media"
              value="8 Assets"
              subtext="Logos & loaders"
              icon={ImageIcon}
              iconColor="text-purple-500"
            />
            <CompactStatCard
              label="SEO / Meta"
              value="Configured"
              subtext="Search & OG tags"
              icon={Search}
              iconColor="text-amber-500"
            />
          </div>
        }
      />

      {/* Profile Settings Quick Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-foreground/80">
        <div className="flex items-center gap-2.5">
          <User className="h-4 w-4 text-primary shrink-0" />
          <span>
            Looking to manage your administrator profile details or change credentials?
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/settings")}
          className="h-7 text-xs flex items-center gap-1.5 cursor-pointer ml-auto"
        >
          <span>Go to Profile & Security</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end gap-2.5">
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
