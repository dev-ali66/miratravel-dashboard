import { Building2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { SiteSettingsState } from "../settingsTypes"

interface IdentityFormProps {
  formData: SiteSettingsState
  handleChange: (field: keyof SiteSettingsState, value: any) => void
}

export function IdentityForm({ formData, handleChange }: IdentityFormProps) {
  return (
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
  )
}
