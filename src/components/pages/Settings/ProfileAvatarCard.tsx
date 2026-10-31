import { useRef } from "react"
import { Camera, RotateCcw, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOptimizedImageUrl, DASHBOARD_IMAGE_WIDTHS } from "@/lib/optimizedImage"

interface ProfileAvatarCardProps {
  currentPhotoUrl: string | null
  previewUrl: string | null
  photoFile: File | null
  firstName: string
  lastName: string
  email: string
  onFileSelect: (file: File) => void
  onResetPhoto: () => void
  disabled?: boolean
}

// Generate initials and consistent background color
function getInitials(firstName: string, lastName: string, email: string): string {
  const f = firstName?.trim() ? firstName.trim()[0] : ""
  const l = lastName?.trim() ? lastName.trim()[0] : ""
  if (f || l) return `${f}${l}`.toUpperCase()
  return (email?.trim() ? email.trim()[0] : "A").toUpperCase()
}

const BG_COLORS = [
  "#2563EB", // Blue
  "#7C3AED", // Violet
  "#059669", // Emerald
  "#D97706", // Amber
  "#DB2777", // Pink
  "#4F46E5", // Indigo
  "#0891B2", // Cyan
  "#DC2626", // Red
]

function getAvatarColor(seed: string): string {
  if (!seed) return BG_COLORS[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % BG_COLORS.length
  return BG_COLORS[index]
}

export function ProfileAvatarCard({
  currentPhotoUrl,
  previewUrl,
  photoFile,
  firstName,
  lastName,
  email,
  onFileSelect,
  onResetPhoto,
  disabled = false,
}: ProfileAvatarCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeImage = previewUrl || currentPhotoUrl
  const initials = getInitials(firstName, lastName, email)
  const bgColor = getAvatarColor(email || firstName)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-md border border-border/80 bg-card p-6 sm:p-8 shadow-xs transition-all">
      {/* Photo Frame */}
      <div className="relative group">
        <label
          htmlFor="profile-avatar-upload"
          className={`relative flex size-44 sm:size-48 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border/80 transition-all duration-300 ${photoFile
              ? "border-primary ring-4 ring-primary/10"
              : "hover:border-primary/80 hover:ring-4 hover:ring-primary/5"
            } ${disabled ? "pointer-events-none opacity-60" : ""}`}
        >
          <div className="relative size-36 sm:size-40 overflow-hidden rounded-full shadow-inner bg-muted">
            {activeImage ? (
              <img
                src={getOptimizedImageUrl(activeImage, { width: DASHBOARD_IMAGE_WIDTHS.PROFILE_AVATAR, quality: 100 })}
                alt="Profile Avatar"
                className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div
                className="flex size-full items-center justify-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: bgColor }}
              >
                <span className="select-none text-4xl sm:text-5xl font-bold text-white tracking-wider">
                  {initials}
                </span>
              </div>
            )}

            {/* Hover Camera Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 backdrop-blur-[2px]">
              <Camera className="h-6 w-6 text-white" />
              <span className="text-xs font-semibold tracking-wide">
                Change Photo
              </span>
            </div>
          </div>

          <input
            ref={fileInputRef}
            id="profile-avatar-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={disabled}
            onChange={handleInputChange}
          />
        </label>
      </div>

      {/* Pending status / Reset */}
      {photoFile ? (
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <UploadCloud className="h-3.5 w-3.5" />
            <span className="truncate max-w-[180px]">{photoFile.name}</span>
            <span className="text-[10px] opacity-80">(Pending Save)</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetPhoto}
            className="h-7 text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Revert Photo</span>
          </Button>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <p className="text-xs font-medium text-foreground">
            Profile Photo
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
            Allowed *.jpeg, *.png, *.webp
            <br />
            Max file size: 5 MB
          </p>
        </div>
      )}
    </div>
  )
}
