import { Sparkles, Globe, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUploadField } from "@/components/shared/ImageUploadField"
import type { SiteSettingsState } from "../settingsTypes"

interface SocialMetaFormProps {
  formData: SiteSettingsState
  handleChange: (field: keyof SiteSettingsState, value: any) => void
}

export function SocialMetaForm({ formData, handleChange }: SocialMetaFormProps) {
  return (
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
  )
}
