import { Share2, Plus, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import {
  type SiteSettingsState,
  type SocialLinkItem,
  POPULAR_PLATFORMS,
  normalizeMultimediaField,
} from "../settingsTypes"

interface SocialLinksFormProps {
  formData: SiteSettingsState
  handleAddSocialLink: () => void
  handleUpdateSocialLink: (index: number, field: keyof SocialLinkItem, value: any) => void
  handleRemoveSocialLink: (index: number) => void
}

export function SocialLinksForm({
  formData,
  handleAddSocialLink,
  handleUpdateSocialLink,
  handleRemoveSocialLink,
}: SocialLinksFormProps) {
  return (
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

        {!formData.socialLinks || formData.socialLinks.length === 0 ? (
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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* Left Column: Social Link Info Inputs */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">Channel URL / Handle</Label>
                      <Input
                        value={item.url || ""}
                        onChange={(e) => handleUpdateSocialLink(index, "url", e.target.value)}
                        placeholder="https://instagram.com/miratravel"
                      />
                    </div>
                  </div>

                  {/* Right Column: Custom Icon / Badge Image */}
                  <div className="lg:col-span-6 space-y-2">
                    <Label className="text-xs font-semibold text-foreground">
                      Custom Icon / Badge Image (Optional)
                    </Label>
                    <UniversalMultimediaForm
                      value={normalizeMultimediaField(item.iconMultimedia || item.iconImage, "image")}
                      onChange={(val) => {
                        handleUpdateSocialLink(index, "iconMultimedia", val)
                        handleUpdateSocialLink(index, "iconImage", val?.image?.url || "")
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

