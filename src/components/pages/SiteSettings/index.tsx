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
} from "lucide-react"
import { toast } from "sonner"
import {
  FilterToolbar,
  FilterGroup,
  FilterTabs,
  FilterActions,
  FilterSegmentButton,
  FilterCreateButton,
} from "@/components/shared/FilterToolbar"
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
  const { data: settingsData, isLoading } = useGetSettings()
  const { mutate: updateSettings, isPending: isSaving } = useUpdateSettings()

  const [formData, setFormData] = useState<SiteSettingsState>(defaultState)
  const [activeTab, setActiveTab] = useState<string>("identity")

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
        navbarLogoDark: normalizeMultimediaField(settingsData.navbarLogoDark, "image"),
        footerLogo: normalizeMultimediaField(settingsData.footerLogo, "image"),
        footerLogoDark: normalizeMultimediaField(settingsData.footerLogoDark, "image"),
        authLogo: normalizeMultimediaField(settingsData.authLogo, "image"),
        authLogoDark: normalizeMultimediaField(settingsData.authLogoDark, "image"),
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault?.()

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
        navbarLogoDark: normalizeMultimediaField(settingsData.navbarLogoDark, "image"),
        footerLogo: normalizeMultimediaField(settingsData.footerLogo, "image"),
        footerLogoDark: normalizeMultimediaField(settingsData.footerLogoDark, "image"),
        authLogo: normalizeMultimediaField(settingsData.authLogo, "image"),
        authLogoDark: normalizeMultimediaField(settingsData.authLogoDark, "image"),
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
    <div className="w-full space-y-6 pt-2">
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
              value="11 Assets"
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
      {/* Unified Segmented Settings Toolbar with Tabs & Actions */}
      <FilterToolbar>
        <FilterGroup className="overflow-x-auto scrollbar-none">
          <FilterTabs
            tabs={[
              { key: "identity", label: "1. Identity", icon: Building2 },
              { key: "brand", label: "2. Brand Assets", icon: ImageIcon },
              { key: "social", label: "3. Social Links", icon: Share2, count: formData.socialLinks?.length || 0 },
              { key: "meta", label: "4. Social Meta", icon: Sparkles },
              { key: "seo", label: "5. SEO & Meta", icon: Search },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </FilterGroup>

        <FilterActions>
          <FilterSegmentButton
            onClick={() => {
              console.log("⚙️ [GLOBAL SITE SETTINGS PAYLOAD]:", formData)
              toast.info("Site settings payload logged to browser console (F12)")
            }}
            label="Console Data"
            icon={Terminal}
            title="Inspect clean site settings payload in browser console (F12)"
          />

          <FilterSegmentButton
            onClick={handleReset}
            disabled={isSaving}
            label="Reset"
            icon={RotateCcw}
          />

          <FilterCreateButton
            onClick={handleSubmit}
            disabled={isSaving}
            label={isSaving ? "Saving..." : "Save"}
            icon={Save}
          />
        </FilterActions>
      </FilterToolbar>

      {/* Form Sections */}
      <div className="w-full space-y-6">
        {activeTab === "identity" && (
          <IdentityForm formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "brand" && (
          <BrandAssetsForm formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "social" && (
          <SocialLinksForm
            formData={formData}
            handleAddSocialLink={handleAddSocialLink}
            handleUpdateSocialLink={handleUpdateSocialLink}
            handleRemoveSocialLink={handleRemoveSocialLink}
          />
        )}
        {activeTab === "meta" && (
          <SocialMetaForm formData={formData} handleChange={handleChange} />
        )}
        {activeTab === "seo" && (
          <SeoForm formData={formData} handleChange={handleChange} />
        )}
      </div>
    </div>
  )
}
