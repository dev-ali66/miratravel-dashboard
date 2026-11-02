import { useState, useEffect } from "react"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { useAddCms } from "@/hooks/cms/useAddCms"
import { DEFAULT_ITEMS, type PolicyItem } from "./types"
import {
  createDefaultPrivacyHero,
  normalizeLegalHero,
  type LegalHeroData,
} from "@/components/pages/CMS/shared/legalHeroDefaults"
import { LegalHeroForm } from "@/components/pages/CMS/shared/LegalHeroForm"
import { FormSection } from "@/components/pages/CMS/shared/FormControls"
import { PrivacyPolicyMetadata } from "./PrivacyPolicyMetadata"
import { PrivacyPolicyTabs } from "./PrivacyPolicyTabs"
import { PrivacyPolicyEditor } from "./PrivacyPolicyEditor"
import { PrivacyPolicyPreview } from "./PrivacyPolicyPreview"
import { PrivacyPolicySkeleton } from "./PrivacyPolicySkeleton"
import { UniversalEditorLayout } from "@/components/layout/UniversalEditorLayout"
import { ShieldCheck } from "lucide-react"
import { EditorFormHeader } from "@/components/shared/EditorFormHeader"
import { toast } from "sonner"

export default function PrivacyPolicyPage() {
  const { mutate: saveSection, isPending: isSaving } = useAddCms()
  const { data: privacyPolicyResponse, isLoading } =
    useGetCmsBySlug("privacy-policy")

  const [effectiveDate, setEffectiveDate] = useState<string>("01.08.2025")
  const [lastUpdated, setLastUpdated] = useState<string>("01.08.2025")
  const [hero, setHero] = useState<LegalHeroData>(createDefaultPrivacyHero())
  const [items, setItems] = useState<PolicyItem[]>(DEFAULT_ITEMS)
  const [activeTab, setActiveTab] = useState<string>("")

  // Form Section Accordion State matching Journey/Location/Experience
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    metadata: true,
    hero: false,
    content: true,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  useEffect(() => {
    const raw = privacyPolicyResponse?.data
    const record = Array.isArray(raw)
      ? raw.find((r: any) => r.slug === "privacy-policy" || r.slug === "privacy") || raw[0]
      : raw?.data || raw

    const fetchedData = record?.data || record
    if (fetchedData) {
      if (fetchedData.effectiveDate) setEffectiveDate(fetchedData.effectiveDate)
      if (fetchedData.lastUpdated) setLastUpdated(fetchedData.lastUpdated)

      const normalized = normalizeLegalHero(fetchedData.hero, {
        breadcrumb: "MIRA ARCHIVE",
        title: fetchedData.title || "Privacy Policy",
        subtitle:
          fetchedData.subtitle ||
          "We are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your personal information across all MIRA journeys and platforms.",
        existingMedia: fetchedData.heroMultimedia,
      })
      setHero(normalized)

      const rawItems = fetchedData.items || fetchedData.parts
      if (Array.isArray(rawItems) && rawItems.length > 0) {
        setItems(rawItems)
        if (!activeTab || !rawItems.some((p: PolicyItem) => p.id === activeTab)) {
          setActiveTab(rawItems[0].id)
        }
      } else if (typeof fetchedData.content === "string" && fetchedData.content) {
        const initialItem: PolicyItem = {
          id: "item-1",
          tabTitle: "Overview",
          fullTitle: "Privacy Policy Overview",
          content: fetchedData.content,
        }
        setItems([initialItem])
        setActiveTab("item-1")
      }
    }
  }, [privacyPolicyResponse])

  // Handle adding a new item
  const handleAddItem = () => {
    const nextNum = items.length + 1
    const newId = `item-${Date.now()}`
    const newItem: PolicyItem = {
      id: newId,
      tabTitle: `Item ${nextNum}`,
      fullTitle: `${nextNum}. New Section`,
      content: "<p>Write your section content here...</p>",
    }
    setItems((prev) => [...prev, newItem])
    setActiveTab(newId)
    // Ensure content section is open when adding
    setOpenSections((prev) => ({ ...prev, content: true }))
    toast.success(`Section "Item ${nextNum}" added.`)
  }

  // Handle removing the item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => {
      const remaining = prev.filter((p) => p.id !== id)
      if (remaining.length > 0) {
        setActiveTab(remaining[0].id)
      } else {
        setActiveTab("")
      }
      return remaining
    })
    toast.info("Section removed.")
  }

  // Handle reordering (Move Up / Down)
  const handleMoveItem = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= items.length) return

    const nextItems = [...items]
    const [moved] = nextItems.splice(index, 1)
    nextItems.splice(targetIdx, 0, moved)
    setItems(nextItems)
  }

  // Handle updating titles
  const handleTitleChange = (field: "tabTitle" | "fullTitle", value: string) => {
    setItems((prev) =>
      prev.map((p) => (p.id === activeTab ? { ...p, [field]: value } : p))
    )
  }

  // Handle updating rich text content
  const handleContentChange = (content: string) => {
    setItems((prev) =>
      prev.map((p) => (p.id === activeTab ? { ...p, content } : p))
    )
  }

  // Inspect payload in browser console (F12)
  const handleConsoleData = () => {
    const payload = {
      effectiveDate,
      lastUpdated,
      hero,
      items,
    }

    console.log("📜 [CLEAN CMS PRIVACY POLICY PAYLOAD]:", payload)
    toast.info("Privacy Policy payload logged to browser console (F12)")
  }

  // Handle save
  const handleSave = () => {
    const payload = {
      effectiveDate,
      lastUpdated,
      hero,
      items,
    }

    const raw = privacyPolicyResponse?.data
    const record = Array.isArray(raw)
      ? raw.find((r: any) => r.slug === "privacy-policy" || r.slug === "privacy") || raw[0]
      : raw?.data || raw
    const existingId = record?.id

    // Save under both "privacy-policy" and "privacy" slugs
    saveSection({
      ...(existingId ? { id: existingId } : {}),
      name: "Privacy Policy",
      slug: "privacy-policy",
      data: payload,
    })

    saveSection({
      name: "Privacy",
      slug: "privacy",
      data: payload,
    })
  }

  const currentItemIndex = items.findIndex((p) => p.id === activeTab)
  const currentItem = currentItemIndex !== -1 ? items[currentItemIndex] : items[0]

  if (isLoading) {
    return <PrivacyPolicySkeleton />
  }

  return (
    <UniversalEditorLayout
      backToUrl="/"
      backToLabel="Back to Dashboard"
      icon={ShieldCheck}
      iconColor="text-emerald-500"
      title="Privacy Policy Editor"
      useWorkspaceScale={true}
      sidebarContent={
        <div className="flex min-h-full flex-col">
          {/* =================================================
              HEADER (Universal Sticky Header)
          ================================================= */}
          <EditorFormHeader
            eyebrow="Privacy Policy"
            title="Privacy Policy Editor"
            saveLabel="Save Changes"
            isSaving={isSaving}
            onSave={handleSave}
            onConsoleData={handleConsoleData}
            consoleDataTitle="Inspect clean privacy payload sent to backend API in browser console (F12)"
          />

          {/* =================================================
              SECTIONS — Continuous divide-y accordion layout
              Exact match with Journey & Location
          ================================================= */}
          <div className="flex-1 divide-y divide-border/60">
            {/* 01. Publication Dates & Metadata */}
            <FormSection
              title="Publication Dates & Metadata"
              sectionNumber="01"
              active={Boolean(openSections.metadata)}
              onClick={() => toggleSection("metadata")}
            >
              <PrivacyPolicyMetadata
                effectiveDate={effectiveDate}
                setEffectiveDate={setEffectiveDate}
                lastUpdated={lastUpdated}
                setLastUpdated={setLastUpdated}
              />
            </FormSection>

            {/* 02. Hero Banner & Multimedia */}
            <LegalHeroForm
              title="Hero Banner & Multimedia"
              sectionNumber="02"
              hero={hero}
              onChange={setHero}
              isOpen={Boolean(openSections.hero)}
              onToggle={() => toggleSection("hero")}
            />

            {/* 03. Document Structure & Content */}
            <FormSection
              title="Document Sections & Content"
              sectionNumber="03"
              active={Boolean(openSections.content)}
              onClick={() => toggleSection("content")}
            >
              <div className="flex flex-col gap-4">
                {items.length > 0 && (
                  <PrivacyPolicyTabs
                    items={items}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onAddItem={handleAddItem}
                  />
                )}

                <PrivacyPolicyEditor
                  currentItem={currentItem}
                  activeTab={activeTab}
                  itemIndex={currentItemIndex !== -1 ? currentItemIndex : 0}
                  totalItems={items.length}
                  onContentChange={handleContentChange}
                  onTitleChange={handleTitleChange}
                  onMoveItem={handleMoveItem}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                />
              </div>
            </FormSection>
          </div>
        </div>
      }
      previewContent={
        <PrivacyPolicyPreview
          items={items}
          effectiveDate={effectiveDate}
          lastUpdated={lastUpdated}
          hero={hero}
        />
      }
    />
  )
}

