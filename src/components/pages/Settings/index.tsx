import MiraLoader from "@/components/shared/MiraLoader"
import { useState, useEffect } from "react"
import {
  Globe,
  Search,
  Save,
  RotateCcw,
  Building2,
  Image as ImageIcon,
  ShieldCheck,
  Share2,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import { removeFiles } from "@/services/fileUpload"
import { useGetSettings, useUpdateSettings } from "@/hooks/settings/useSettings"

export interface SocialLinkItem {
  id: string
  platform: string
  title: string
  url: string
  icon?: string
  iconImage?: string
}

export interface SiteSettingsState {
  // 1. IDENTITY
  siteName: string
  siteTagline: string
  siteDescription: string
  siteUrl: string
  defaultLanguage: string
  defaultTimezone: string
  contactEmail: string
  supportEmail: string
  phoneNumber: string
  secondaryPhoneNumber: string
  businessName: string
  businessAddress: string
  copyrightText: string

  // 2. BRAND
  siteLogo: string
  siteLogoLight: string
  siteLogoDark: string
  siteFavicon: string

  // 3. SOCIAL
  socialLinks: SocialLinkItem[]

  // 4. SOCIAL META
  seoOgTitle: string
  seoOgDescription: string
  seoOgImage: string
  seoTwitterTitle: string
  seoTwitterDescription: string
  seoTwitterImage: string
  seoTwitterCard: string

  // 5. SEO
  seoDefaultTitle: string
  seoTitleTemplate: string
  seoMetaDescription: string
  seoKeywords: string
  seoCanonicalUrl: string
  seoRobots: string
  seoAuthor: string
  seoGoogleVerification: string
  seoBingVerification: string
  seoSchemaEnabled: boolean
}

const defaultState: SiteSettingsState = {
  siteName: "",
  siteTagline: "",
  siteDescription: "",
  siteUrl: "",
  defaultLanguage: "en",
  defaultTimezone: "UTC",
  contactEmail: "",
  supportEmail: "",
  phoneNumber: "",
  secondaryPhoneNumber: "",
  businessName: "",
  businessAddress: "",
  copyrightText: "",

  siteLogo: "",
  siteLogoLight: "",
  siteLogoDark: "",
  siteFavicon: "",

  socialLinks: [],

  seoOgTitle: "",
  seoOgDescription: "",
  seoOgImage: "",
  seoTwitterTitle: "",
  seoTwitterDescription: "",
  seoTwitterImage: "",
  seoTwitterCard: "summary_large_image",

  seoDefaultTitle: "",
  seoTitleTemplate: "",
  seoMetaDescription: "",
  seoKeywords: "",
  seoCanonicalUrl: "",
  seoRobots: "index, follow",
  seoAuthor: "",
  seoGoogleVerification: "",
  seoBingVerification: "",
  seoSchemaEnabled: true,
}

const POPULAR_PLATFORMS = [
  "Facebook",
  "Instagram",
  "X (Twitter)",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Pinterest",
  "Spotify",
  "WhatsApp",
  "Custom Platform",
]

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
      })
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
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 shadow-sm"
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

        {/* =========================================================================
            FORM 1: IDENTITY
        ========================================================================= */}
        <TabsContent value="identity" className="space-y-6">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">
                  Site Identity & General Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="siteName" className="text-xs font-semibold">Site Name</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName || ""}
                    onChange={(e) => handleChange("siteName", e.target.value)}
                    placeholder="MIRA Luxury Travel"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="siteTagline" className="text-xs font-semibold">Site Tagline</Label>
                  <Input
                    id="siteTagline"
                    value={formData.siteTagline || ""}
                    onChange={(e) => handleChange("siteTagline", e.target.value)}
                    placeholder="Curating bespoke journeys"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="siteDescription" className="text-xs font-semibold">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={formData.siteDescription || ""}
                    onChange={(e) => handleChange("siteDescription", e.target.value)}
                    placeholder="High-end luxury travel curation and bespoke editorial journeys across the globe."
                    rows={3}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="siteUrl" className="text-xs font-semibold">Public Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={formData.siteUrl || ""}
                    onChange={(e) => handleChange("siteUrl", e.target.value)}
                    placeholder="https://miratravel.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="defaultLanguage" className="text-xs font-semibold">Default Language</Label>
                  <Input
                    id="defaultLanguage"
                    value={formData.defaultLanguage || "en"}
                    onChange={(e) => handleChange("defaultLanguage", e.target.value)}
                    placeholder="en"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="defaultTimezone" className="text-xs font-semibold">Default Timezone</Label>
                  <Input
                    id="defaultTimezone"
                    value={formData.defaultTimezone || "UTC"}
                    onChange={(e) => handleChange("defaultTimezone", e.target.value)}
                    placeholder="UTC"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="copyrightText" className="text-xs font-semibold">Copyright Footer Text</Label>
                  <Input
                    id="copyrightText"
                    value={formData.copyrightText || ""}
                    onChange={(e) => handleChange("copyrightText", e.target.value)}
                    placeholder="© 2026 MIRA Luxury Travel. All rights reserved."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <h4 className="text-sm font-semibold text-foreground mb-4">Contact & Business Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactEmail" className="text-xs font-semibold">General Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail || ""}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                      placeholder="concierge@miratravel.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="supportEmail" className="text-xs font-semibold">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={formData.supportEmail || ""}
                      onChange={(e) => handleChange("supportEmail", e.target.value)}
                      placeholder="support@miratravel.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phoneNumber" className="text-xs font-semibold">Primary Phone</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber || ""}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      placeholder="+1 (800) 555-MIRA"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="secondaryPhoneNumber" className="text-xs font-semibold">Secondary Phone</Label>
                    <Input
                      id="secondaryPhoneNumber"
                      value={formData.secondaryPhoneNumber || ""}
                      onChange={(e) => handleChange("secondaryPhoneNumber", e.target.value)}
                      placeholder="+44 20 7946 0912"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="businessName" className="text-xs font-semibold">Legal Business Name</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName || ""}
                      onChange={(e) => handleChange("businessName", e.target.value)}
                      placeholder="MIRA Bespoke Journeys Ltd."
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="businessAddress" className="text-xs font-semibold">Office Address</Label>
                    <Textarea
                      id="businessAddress"
                      value={formData.businessAddress || ""}
                      onChange={(e) => handleChange("businessAddress", e.target.value)}
                      placeholder="14 Berkeley Square, Mayfair, London W1J 6BL, United Kingdom"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =========================================================================
            FORM 2: BRAND ASSETS
        ========================================================================= */}
        <TabsContent value="brand" className="space-y-6">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <ImageIcon className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">
                  Brand Logo Assets & Favicon
                </h3>
              </div>

              <p className="text-xs text-muted-foreground">
                Upload brand logo variants for standard, light, and dark UI themes, as well as the browser favicon.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <ImageUploadField
                  label="Primary Site Logo"
                  value={formData.siteLogo || ""}
                  fieldName="siteLogo"
                  onChange={(url) => handleChange("siteLogo", url)}
                />

                <ImageUploadField
                  label="Site Logo (Light Mode)"
                  value={formData.siteLogoLight || ""}
                  fieldName="siteLogoLight"
                  onChange={(url) => handleChange("siteLogoLight", url)}
                />

                <ImageUploadField
                  label="Site Logo (Dark Mode)"
                  value={formData.siteLogoDark || ""}
                  fieldName="siteLogoDark"
                  onChange={(url) => handleChange("siteLogoDark", url)}
                />

                <ImageUploadField
                  label="Site Favicon (32 × 32 or 64 × 64px)"
                  value={formData.siteFavicon || ""}
                  fieldName="siteFavicon"
                  onChange={(url) => handleChange("siteFavicon", url)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =========================================================================
            FORM 3: SOCIAL LINKS (DYNAMIC ARRAY)
        ========================================================================= */}
        <TabsContent value="social" className="space-y-6">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/40 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">
                      Social Media Channels & Handles
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add or remove social media links dynamically. Removing an item deletes any associated uploaded icons automatically.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={handleAddSocialLink}
                  className="flex items-center gap-2 self-start sm:self-auto shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Social Channel</span>
                </Button>
              </div>

              {(!formData.socialLinks || formData.socialLinks.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border/70 rounded-xl bg-muted/20 text-center">
                  <Share2 className="h-10 w-10 text-muted-foreground/50 mb-3" />
                  <h4 className="text-sm font-semibold text-foreground">No Social Channels Added</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Connect your Facebook, Instagram, LinkedIn, YouTube, or custom platforms to display on your site footer and navigation.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSocialLink}
                    className="mt-4 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add First Channel</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.socialLinks.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-5 border border-border/60 rounded-xl bg-card/80 space-y-4 shadow-2xs transition-all hover:border-border"
                    >
                      <div className="flex items-center justify-between border-b border-border/40 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {index + 1}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {item.title || item.platform || `Channel #${index + 1}`}
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSocialLink(index)}
                          className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                          title="Delete Social Channel and remove files"
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          <span className="text-xs font-medium">Remove</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Platform</Label>
                          <select
                            value={item.platform || "Instagram"}
                            onChange={(e) => {
                              handleUpdateSocialLink(index, "platform", e.target.value)
                              if (!item.title || POPULAR_PLATFORMS.includes(item.title)) {
                                handleUpdateSocialLink(index, "title", e.target.value)
                              }
                            }}
                            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs font-medium shadow-2xs transition-colors focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                          >
                            {POPULAR_PLATFORMS.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold">Display Title</Label>
                          <Input
                            value={item.title || ""}
                            onChange={(e) => handleUpdateSocialLink(index, "title", e.target.value)}
                            placeholder="e.g. Follow on Instagram"
                          />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                          <Label className="text-xs font-semibold">Channel URL / Handle</Label>
                          <Input
                            value={item.url || ""}
                            onChange={(e) => handleUpdateSocialLink(index, "url", e.target.value)}
                            placeholder="https://instagram.com/miratravel"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3 pt-1">
                          <ImageUploadField
                            label="Custom Icon / Badge Image (Optional)"
                            value={item.iconImage || ""}
                            fieldName={`socialIcon_${index}`}
                            onChange={(url) => handleUpdateSocialLink(index, "iconImage", url)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* =========================================================================
            FORM 4: SOCIAL META (OPEN GRAPH & TWITTER)
        ========================================================================= */}
        <TabsContent value="meta" className="space-y-6">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">
                  Social Share Cards (Open Graph & Twitter Cards)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Open Graph */}
                <div className="space-y-4 p-5 rounded-xl border border-border/50 bg-muted/10">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    Open Graph (Facebook, LinkedIn, iMessage)
                  </h4>

                  <div className="space-y-1.5">
                    <Label htmlFor="seoOgTitle" className="text-xs font-semibold">Open Graph Title</Label>
                    <Input
                      id="seoOgTitle"
                      value={formData.seoOgTitle || ""}
                      onChange={(e) => handleChange("seoOgTitle", e.target.value)}
                      placeholder="MIRA — Luxury Travel Curation"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="seoOgDescription" className="text-xs font-semibold">Open Graph Description</Label>
                    <Textarea
                      id="seoOgDescription"
                      value={formData.seoOgDescription || ""}
                      onChange={(e) => handleChange("seoOgDescription", e.target.value)}
                      placeholder="Discover bespoke itineraries and privately chartered journeys across 40+ global destinations."
                      rows={3}
                    />
                  </div>

                  <ImageUploadField
                    label="Open Graph Share Image (1200 × 630px)"
                    value={formData.seoOgImage || ""}
                    fieldName="seoOgImage"
                    onChange={(url) => handleChange("seoOgImage", url)}
                  />
                </div>

                {/* Twitter Cards */}
                <div className="space-y-4 p-5 rounded-xl border border-border/50 bg-muted/10">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-primary" />
                    Twitter / X Social Card
                  </h4>

                  <div className="space-y-1.5">
                    <Label htmlFor="seoTwitterTitle" className="text-xs font-semibold">Twitter Title</Label>
                    <Input
                      id="seoTwitterTitle"
                      value={formData.seoTwitterTitle || ""}
                      onChange={(e) => handleChange("seoTwitterTitle", e.target.value)}
                      placeholder="MIRA — Luxury Travel Curation"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="seoTwitterDescription" className="text-xs font-semibold">Twitter Description</Label>
                    <Textarea
                      id="seoTwitterDescription"
                      value={formData.seoTwitterDescription || ""}
                      onChange={(e) => handleChange("seoTwitterDescription", e.target.value)}
                      placeholder="Discover bespoke itineraries and privately chartered journeys."
                      rows={3}
                    />
                  </div>

                  <ImageUploadField
                    label="Twitter Share Image"
                    value={formData.seoTwitterImage || ""}
                    fieldName="seoTwitterImage"
                    onChange={(url) => handleChange("seoTwitterImage", url)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* =========================================================================
            FORM 5: SEO & WEBMASTER
        ========================================================================= */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <Search className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">
                  Search Engine Optimization (SEO) & Verification
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="seoDefaultTitle" className="text-xs font-semibold">Default Page Title</Label>
                  <Input
                    id="seoDefaultTitle"
                    value={formData.seoDefaultTitle || ""}
                    onChange={(e) => handleChange("seoDefaultTitle", e.target.value)}
                    placeholder="MIRA | Luxury Travel & Bespoke Journeys"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="seoTitleTemplate" className="text-xs font-semibold">Title Template Format</Label>
                  <Input
                    id="seoTitleTemplate"
                    value={formData.seoTitleTemplate || ""}
                    onChange={(e) => handleChange("seoTitleTemplate", e.target.value)}
                    placeholder="%s | MIRA Travel"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="seoCanonicalUrl" className="text-xs font-semibold">Canonical URL</Label>
                  <Input
                    id="seoCanonicalUrl"
                    value={formData.seoCanonicalUrl || ""}
                    onChange={(e) => handleChange("seoCanonicalUrl", e.target.value)}
                    placeholder="https://miratravel.com"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="seoMetaDescription" className="text-xs font-semibold">Meta Description</Label>
                  <Textarea
                    id="seoMetaDescription"
                    value={formData.seoMetaDescription || ""}
                    onChange={(e) => handleChange("seoMetaDescription", e.target.value)}
                    placeholder="Experience bespoke luxury journeys tailored by expert trip designers. Private access, hand-selected sanctuaries, and immersive cultural odysseys."
                    rows={3}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="seoKeywords" className="text-xs font-semibold">Meta Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords || ""}
                    onChange={(e) => handleChange("seoKeywords", e.target.value)}
                    placeholder="luxury travel, bespoke journeys, private tours, exclusive safari, curated itineraries"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="seoAuthor" className="text-xs font-semibold">Meta Author</Label>
                  <Input
                    id="seoAuthor"
                    value={formData.seoAuthor || ""}
                    onChange={(e) => handleChange("seoAuthor", e.target.value)}
                    placeholder="MIRA Editorial Team"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="seoRobots" className="text-xs font-semibold">Robots Directives</Label>
                  <Input
                    id="seoRobots"
                    value={formData.seoRobots || "index, follow"}
                    onChange={(e) => handleChange("seoRobots", e.target.value)}
                    placeholder="index, follow"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 p-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-semibold text-foreground">Structured JSON-LD Schema</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically generate Organization and TravelAgency Schema.org structured data.
                    </p>
                  </div>
                  <Switch
                    checked={formData.seoSchemaEnabled ?? true}
                    onCheckedChange={(checked) => handleChange("seoSchemaEnabled", checked)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Webmaster Search Engine Verification
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="seoGoogleVerification" className="text-xs font-semibold">Google Search Console Verification Tag</Label>
                    <Input
                      id="seoGoogleVerification"
                      value={formData.seoGoogleVerification || ""}
                      onChange={(e) => handleChange("seoGoogleVerification", e.target.value)}
                      placeholder="google-site-verification=abcdef123456"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="seoBingVerification" className="text-xs font-semibold">Bing Webmaster Verification Code</Label>
                    <Input
                      id="seoBingVerification"
                      value={formData.seoBingVerification || ""}
                      onChange={(e) => handleChange("seoBingVerification", e.target.value)}
                      placeholder="BING_VERIFICATION_TOKEN"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
