import {
  User,
  ShieldCheck,
  Save,
  Lock,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileAvatarCard } from "./ProfileAvatarCard"
import { SearchableCountryDropdown } from "./SearchableCountryDropdown"

export interface ProfileDetailsState {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  country: string
  state: string
  city: string
  zip: string
  nationality: string
  dateOfBirth: string
  about: string
}

interface PersonalDetailsSectionProps {
  form: ProfileDetailsState
  currentPhotoUrl: string | null
  photoFile: File | null
  photoPreview: string | null
  errors: Record<string, string>
  loading: boolean
  onChange: (field: keyof ProfileDetailsState, value: string) => void
  onFileSelect: (file: File) => void
  onResetPhoto: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function PersonalDetailsSection({
  form,
  currentPhotoUrl,
  photoFile,
  photoPreview,
  errors,
  loading,
  onChange,
  onFileSelect,
  onResetPhoto,
  onSubmit,
}: PersonalDetailsSectionProps) {
  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card p-5 sm:p-7 shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                Personal Details
              </h2>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Primary Profile
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update your administrator information, contact channels, and profile photo.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Avatar Card */}
        <div className="w-full lg:w-72 shrink-0">
          <ProfileAvatarCard
            currentPhotoUrl={currentPhotoUrl}
            previewUrl={photoPreview}
            photoFile={photoFile}
            firstName={form.firstName}
            lastName={form.lastName}
            email={form.email}
            onFileSelect={onFileSelect}
            onResetPhoto={onResetPhoto}
            disabled={loading}
          />
        </div>

        {/* Right Column: Form Fields */}
        <div className="flex-1 w-full flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${
                  errors.firstName
                    ? "border-destructive focus-within:border-destructive ring-2 ring-destructive/10"
                    : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
              >
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  placeholder="Enter first name"
                  disabled={loading}
                  className="h-full w-full bg-transparent px-3.5 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-destructive pl-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${
                  errors.lastName
                    ? "border-destructive focus-within:border-destructive ring-2 ring-destructive/10"
                    : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
              >
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => onChange("lastName", e.target.value)}
                  placeholder="Enter last name"
                  disabled={loading}
                  className="h-full w-full bg-transparent px-3.5 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-destructive pl-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email Address (Read-only Account ID) */}
            <div className="flex flex-col gap-1">
              <div className="relative h-[52px] sm:h-[54px] w-full rounded-lg border border-border/60 bg-muted/40 cursor-not-allowed">
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded flex items-center gap-1">
                  <span>Email Address</span>
                  <Lock className="h-3 w-3 text-muted-foreground" />
                </label>
                <div className="flex h-full w-full items-center justify-between px-3.5 pt-1">
                  <span className="text-sm text-foreground/80 font-mono truncate">
                    {form.email || "No email assigned"}
                  </span>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary shrink-0">
                    Verified
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground pl-1">
                Primary login email cannot be changed directly.
              </p>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${
                  errors.phone
                    ? "border-destructive focus-within:border-destructive"
                    : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
              >
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  disabled={loading}
                  className="h-full w-full bg-transparent px-3.5 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive pl-1">{errors.phone}</p>
              )}
            </div>

            {/* Address (Full Span across 2 cols) */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <div
                className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${
                  errors.address
                    ? "border-destructive focus-within:border-destructive"
                    : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
              >
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                  Street Address
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  placeholder="Suite, Street Address, Building"
                  disabled={loading}
                  className="h-full w-full bg-transparent px-3.5 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
              {errors.address && (
                <p className="text-xs text-destructive pl-1">{errors.address}</p>
              )}
            </div>

            {/* Country (Interactive Searchable Dropdown) */}
            <SearchableCountryDropdown
              label="Country"
              value={form.country}
              onChange={(val) => onChange("country", val)}
              placeholder="Select country"
              searchPlaceholder="Search country..."
              error={errors.country}
              disabled={loading}
            />

            {/* State / Region */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${
                  errors.state
                    ? "border-destructive focus-within:border-destructive"
                    : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
              >
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                  State / Region
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => onChange("state", e.target.value)}
                  placeholder="State, Province, or Canton"
                  disabled={loading}
                  className="h-full w-full bg-transparent px-3.5 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
              {errors.state && (
                <p className="text-xs text-destructive pl-1">{errors.state}</p>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${
                  errors.city
                    ? "border-destructive focus-within:border-destructive"
                    : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
              >
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                  City
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => onChange("city", e.target.value)}
                  placeholder="Enter city"
                  disabled={loading}
                  className="h-full w-full bg-transparent px-3.5 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
              {errors.city && (
                <p className="text-xs text-destructive pl-1">{errors.city}</p>
              )}
            </div>

            {/* Zip Code */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${
                  errors.zip
                    ? "border-destructive focus-within:border-destructive"
                    : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
              >
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                  Postal / Zip Code
                </label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => onChange("zip", e.target.value)}
                  placeholder="e.g. 10001"
                  disabled={loading}
                  className="h-full w-full bg-transparent px-3.5 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
              {errors.zip && (
                <p className="text-xs text-destructive pl-1">{errors.zip}</p>
              )}
            </div>

            {/* Nationality (Interactive Searchable Dropdown) */}
            <SearchableCountryDropdown
              label="Nationality"
              value={form.nationality}
              onChange={(val) => onChange("nationality", val)}
              placeholder="Select nationality"
              searchPlaceholder="Search nationality..."
              error={errors.nationality}
              disabled={loading}
            />

            {/* Date of Birth */}
            <div className="flex flex-col gap-1">
              <div
                className={`relative h-[52px] sm:h-[54px] w-full rounded-lg border transition-all ${
                  errors.dateOfBirth
                    ? "border-destructive focus-within:border-destructive"
                    : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
              >
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => onChange("dateOfBirth", e.target.value)}
                  disabled={loading}
                  className="h-full w-full bg-transparent px-3.5 pt-1 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive pl-1">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* About / Bio (Full Row) */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <div
                className={`relative w-full rounded-lg border transition-all ${
                  errors.about
                    ? "border-destructive focus-within:border-destructive"
                    : "border-border/80 hover:border-foreground/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10"
                } bg-background`}
              >
                <label className="pointer-events-none absolute -top-2.5 left-3.5 bg-background px-1.5 text-[11px] font-medium tracking-tight text-muted-foreground z-10 rounded">
                  About / Bio
                </label>
                <textarea
                  rows={3}
                  value={form.about}
                  onChange={(e) => onChange("about", e.target.value)}
                  placeholder="Share a short bio or internal administrator notes..."
                  disabled={loading}
                  maxLength={500}
                  className="w-full bg-transparent p-3.5 pt-3 text-sm font-normal text-foreground placeholder:text-muted-foreground/60 focus:outline-none resize-none"
                />
                <div className="px-3 pb-2 text-right text-[10px] text-muted-foreground">
                  {form.about?.length || 0}/500
                </div>
              </div>
              {errors.about && (
                <p className="text-xs text-destructive pl-1">{errors.about}</p>
              )}
            </div>
          </div>

          {/* Security Notice Callout */}
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground/80 leading-relaxed">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">
                Encrypted Administrator Identity:
              </span>{" "}
              Your details are safely stored in your Mira Administrator profile. Any changes made here are tracked in the live audit log for governance compliance.
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 h-10 shadow-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Profile Details</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
