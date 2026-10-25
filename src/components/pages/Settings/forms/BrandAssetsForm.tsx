import { Image as ImageIcon, Video as VideoIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { UniversalMultimediaForm } from "@/components/pages/CMS/shared/UniversalMultimediaForm"
import {
  type SiteSettingsState,
  emptyImageMultimedia,
  emptyVideoMultimedia,
} from "../settingsTypes"

interface BrandAssetsFormProps {
  formData: SiteSettingsState
  handleChange: (field: keyof SiteSettingsState, value: any) => void
}

export function BrandAssetsForm({ formData, handleChange }: BrandAssetsFormProps) {
  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-border/40 pb-3">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            Brand Logo Assets & Video Media
          </h3>
        </div>

        <p className="text-xs text-muted-foreground">
          Configure brand logo variants for Navbar, Footer, Authentication, Site themes, Favicon, and global Loading Video using Universal Multimedia controls.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* 1. Navbar Logo (Light / Default) */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Navbar Logo (`navbarLogo`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Logo displayed in main website header navigation for light backgrounds (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.navbarLogo || emptyImageMultimedia}
              onChange={(val) => handleChange("navbarLogo", val)}
            />
          </div>

          {/* 2. Navbar Logo (Dark Mode) */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Navbar Logo Dark (`navbarLogoDark`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Logo displayed in main website header navigation for dark mode / backgrounds (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.navbarLogoDark || emptyImageMultimedia}
              onChange={(val) => handleChange("navbarLogoDark", val)}
            />
          </div>

          {/* 3. Footer Logo (Light / Default) */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Footer Logo (`footerLogo`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Logo displayed in site footer section for light backgrounds (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.footerLogo || emptyImageMultimedia}
              onChange={(val) => handleChange("footerLogo", val)}
            />
          </div>

          {/* 4. Footer Logo (Dark Mode) */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Footer Logo Dark (`footerLogoDark`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Logo displayed in site footer section for dark mode / backgrounds (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.footerLogoDark || emptyImageMultimedia}
              onChange={(val) => handleChange("footerLogoDark", val)}
            />
          </div>

          {/* 5. Authentication Logo (Light / Default) */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Authentication Logo (`authLogo`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Logo displayed on Login, Register & Auth screens for light backgrounds (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.authLogo || emptyImageMultimedia}
              onChange={(val) => handleChange("authLogo", val)}
            />
          </div>

          {/* 6. Authentication Logo (Dark Mode) */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Authentication Logo Dark (`authLogoDark`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Logo displayed on Login, Register & Auth screens for dark mode / backgrounds (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.authLogoDark || emptyImageMultimedia}
              onChange={(val) => handleChange("authLogoDark", val)}
            />
          </div>

          {/* 7. Primary Site Logo */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Primary Site Logo (`siteLogo`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Default global brand logo (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.siteLogo || emptyImageMultimedia}
              onChange={(val) => handleChange("siteLogo", val)}
            />
          </div>

          {/* 8. Site Logo (Light Mode) */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Site Logo - Light Mode (`siteLogoLight`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Brand logo for light backgrounds and themes (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.siteLogoLight || emptyImageMultimedia}
              onChange={(val) => handleChange("siteLogoLight", val)}
            />
          </div>

          {/* 9. Site Logo (Dark Mode) */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Site Logo - Dark Mode (`siteLogoDark`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Brand logo for dark backgrounds and themes (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.siteLogoDark || emptyImageMultimedia}
              onChange={(val) => handleChange("siteLogoDark", val)}
            />
          </div>

          {/* 10. Site Favicon */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Site Favicon (`siteFavicon`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Browser tab icon asset (default mode: image).
            </p>
            <UniversalMultimediaForm
              value={formData.siteFavicon || emptyImageMultimedia}
              onChange={(val) => handleChange("siteFavicon", val)}
            />
          </div>

          {/* 11. Loading Video Asset */}
          <div className="space-y-2 p-4 border border-border/60 rounded-md bg-card/40">
            <div className="flex items-center gap-2">
              <VideoIcon className="h-4 w-4 text-primary" />
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                Loading Video Asset (`loadingVideo`)
              </label>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Global page loader animation video (default mode: video).
            </p>
            <UniversalMultimediaForm
              value={formData.loadingVideo || emptyVideoMultimedia}
              onChange={(val) => handleChange("loadingVideo", val)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
