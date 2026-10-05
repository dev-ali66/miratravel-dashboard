import { Search, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { SiteSettingsState } from "../settingsTypes"

interface SeoFormProps {
  formData: SiteSettingsState
  handleChange: (field: keyof SiteSettingsState, value: any) => void
}

export function SeoForm({ formData, handleChange }: SeoFormProps) {
  return (
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
  )
}
