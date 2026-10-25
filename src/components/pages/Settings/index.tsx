import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import {
  User,
  KeyRound,
} from "lucide-react"
import { toast } from "sonner"
import MiraLoader from "@/components/shared/MiraLoader"
import { useMe } from "@/hooks/auth/useMe"
import { apiPrivate } from "@/lib/api-client"
import { ActiveDevicesModal } from "@/components/layout/ActiveDevicesModal"
import { FilterToolbar, FilterGroup, FilterTabs } from "@/components/shared/FilterToolbar"

import {
  PersonalDetailsSection,
  type ProfileDetailsState,
} from "./PersonalDetailsSection"
import { PasswordSecuritySection } from "./PasswordSecuritySection"

const INITIAL_PROFILE_STATE: ProfileDetailsState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  country: "",
  state: "",
  city: "",
  zip: "",
  nationality: "",
  dateOfBirth: "",
  about: "",
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") === "password" ? "password" : "profile"

  const queryClient = useQueryClient()
  const { data: user, isLoading } = useMe()

  const [form, setForm] = useState<ProfileDetailsState>(INITIAL_PROFILE_STATE)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)

  const [savingProfile, setSavingProfile] = useState(false)
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false)
  const isInitializedRef = useRef(false)

  // Populate form ONCE from live user profile data without wiping active typing
  useEffect(() => {
    if (user && !isInitializedRef.current) {
      isInitializedRef.current = true
      const pi = user.userPersonalInfo as Record<string, any> | null
      const rawUser = user as Record<string, any>

      // Extract photo candidate
      let candidatePhoto: string | null = null
      if (pi?.photoUrl && Array.isArray(pi.photoUrl) && pi.photoUrl.length > 0) {
        candidatePhoto = pi.photoUrl[0]
      } else if (typeof pi?.photoUrl === "string" && pi.photoUrl.trim()) {
        candidatePhoto = pi.photoUrl.trim()
      } else if (rawUser?.avatar && typeof rawUser.avatar === "string") {
        candidatePhoto = rawUser.avatar
      }

      setCurrentPhotoUrl(candidatePhoto)

      // Format Date of Birth if present
      let rawDob = (pi?.dateOfBirth as string) ?? (rawUser?.dob as string) ?? ""
      if (rawDob && rawDob.includes("T")) {
        rawDob = rawDob.split("T")[0]
      }

      setForm({
        firstName: pi?.firstName ?? rawUser?.firstName ?? "",
        lastName: pi?.lastName ?? rawUser?.lastName ?? "",
        email: user.email ?? "",
        phone: pi?.phone ?? rawUser?.phone ?? "",
        address: pi?.address ?? rawUser?.address ?? "",
        country: pi?.country ?? rawUser?.country ?? "",
        state: pi?.state ?? rawUser?.state ?? "",
        city: pi?.city ?? rawUser?.city ?? "",
        zip: (pi?.zipCode as string) ?? (pi?.zip as string) ?? (rawUser?.zip as string) ?? "",
        nationality: pi?.nationality ?? rawUser?.nationality ?? "",
        dateOfBirth: rawDob,
        about: pi?.about ?? rawUser?.about ?? "",
      })
    }
  }, [user])

  const handleTabChange = (tab: "profile" | "password") => {
    setSearchParams({ tab })
  }

  const handleFieldChange = (field: keyof ProfileDetailsState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setProfileErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleFileSelect = (file: File) => {
    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum allowed size is 5 MB.")
      return
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid image format. Allowed: *.jpeg, *.png, *.webp.")
      return
    }

    setPhotoFile(file)
    const preview = URL.createObjectURL(file)
    setPhotoPreview(preview)
    toast.info(`Selected photo "${file.name}". Click "Save Profile Details" to persist.`)
  }

  const handleResetPhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview)
    }
    setPhotoFile(null)
    setPhotoPreview(null)
    toast.info("Reverted to previous profile avatar.")
  }

  const validateProfile = useCallback((): Record<string, string> => {
    const errs: Record<string, string> = {}
    if (!form.firstName.trim()) {
      errs.firstName = "First name is required"
    }
    if (!form.lastName.trim()) {
      errs.lastName = "Last name is required"
    }
    return errs
  }, [form.firstName, form.lastName])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateProfile()
    setProfileErrors(validationErrors)
    // Match frontend: do NOT show a toast on validation errors, display inline messages
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSavingProfile(true)
    try {
      const fd = new FormData()

      fd.append("firstName", form.firstName.trim())
      fd.append("lastName", form.lastName.trim())

      if (form.phone.trim()) fd.append("phone", form.phone.trim())
      if (form.address.trim()) fd.append("address", form.address.trim())
      if (form.country.trim()) fd.append("country", form.country.trim())
      if (form.state.trim()) fd.append("state", form.state.trim())
      if (form.city.trim()) fd.append("city", form.city.trim())

      const zipVal = form.zip.trim()
      if (zipVal) {
        fd.append("zipCode", zipVal)
        fd.append("zip", zipVal)
      }

      if (form.nationality.trim()) fd.append("nationality", form.nationality.trim())

      const dobVal = form.dateOfBirth.trim()
      if (dobVal) {
        fd.append("dateOfBirth", dobVal)
        fd.append("dob", dobVal)
      }

      if (form.about.trim()) fd.append("about", form.about.trim())

      if (photoFile) {
        fd.append("photoUrl", photoFile)
      }

      // apiPrivate request interceptor automatically omits Content-Type for FormData
      // allowing browser to attach multipart/form-data with the correct boundary
      const res = await apiPrivate.post("/auth/me", fd)

      if (res.data?.success || res.status === 200) {
        toast.success("Profile details updated successfully!")
        setPhotoFile(null)

        const freshUser = res.data?.data
        if (freshUser?.userPersonalInfo?.photoUrl?.[0]) {
          setCurrentPhotoUrl(freshUser.userPersonalInfo.photoUrl[0])
        }

        // Refetch user data across app
        await queryClient.invalidateQueries({ queryKey: ["GET_ME"] })
      } else {
        toast.error(res.data?.message || "Failed to update profile.")
      }
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile details."
      if (!msg.includes("Too many requests")) {
        toast.error(msg)
      }
    } finally {
      setSavingProfile(false)
    }
  }

  if (isLoading) {
    return (
      <MiraLoader text="Loading administrator profile..." className="min-h-[350px] py-16" />
    )
  }

  return (
    <div className="w-full space-y-6 pt-2 pb-16">
      {/* Clean Page Title & Subtitle (Exact frontend parity) */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading">
          {activeTab === "profile" ? "Personal Details" : "Password & Security"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {activeTab === "profile"
            ? "Manage your account information and personal details."
            : "Update your password and manage account security."}
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <FilterToolbar>
        <FilterGroup>
          <FilterTabs
            tabs={[
              { id: "profile", label: "Profile Details", icon: User },
              { id: "password", label: "Password & Security", icon: KeyRound },
            ]}
            activeTab={activeTab}
            onChange={(tab) => handleTabChange(tab as "profile" | "password")}
          />
        </FilterGroup>
      </FilterToolbar>

      {/* TAB 1: PERSONAL DETAILS & AVATAR */}
      {activeTab === "profile" && (
        <PersonalDetailsSection
          form={form}
          currentPhotoUrl={currentPhotoUrl}
          photoFile={photoFile}
          photoPreview={photoPreview}
          errors={profileErrors}
          loading={savingProfile}
          onChange={handleFieldChange}
          onFileSelect={handleFileSelect}
          onResetPhoto={handleResetPhoto}
          onSubmit={handleSaveProfile}
        />
      )}

      {/* TAB 2: PASSWORD & SECURITY CREDENTIALS */}
      {activeTab === "password" && (
        <PasswordSecuritySection
          onOpenDevicesModal={() => setIsDevicesModalOpen(true)}
          onNavigateAuditLogs={() => navigate("/audit-logs")}
        />
      )}

      {/* Active Devices Inspection Modal */}
      <ActiveDevicesModal
        open={isDevicesModalOpen}
        onClose={() => setIsDevicesModalOpen(false)}
      />
    </div>
  )
}
