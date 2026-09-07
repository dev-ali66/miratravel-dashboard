import { useEffect, useRef, useCallback } from "react"

export function useSyncScroll() {
  const formRef = useRef<HTMLDivElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const isSyncingRef = useRef<"form" | "preview" | null>(null)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Helper: Detect and mark active section across form & preview
  const updateActiveSection = useCallback(() => {
    const previewEl = previewRef.current
    const formEl = formRef.current
    if (!previewEl || !formEl) return

    const previewSections = Array.from(previewEl.querySelectorAll<HTMLElement>("[data-section]"))
    const formSections = Array.from(formEl.querySelectorAll<HTMLElement>("[data-section]"))
    if (previewSections.length === 0 && formSections.length === 0) return

    let activeKey: string | null = null

    if (previewSections.length > 0 && previewEl.clientHeight > 0) {
      const previewRect = previewEl.getBoundingClientRect()
      const triggerY = previewRect.top + previewRect.height * 0.35 // 35% from viewport top

      for (const sec of previewSections) {
        const rect = sec.getBoundingClientRect()
        if (rect.top <= triggerY && rect.bottom >= previewRect.top + 30) {
          activeKey = sec.getAttribute("data-section")
        }
      }

      if (!activeKey && previewSections.length > 0) {
        activeKey = previewSections[0].getAttribute("data-section")
      }
    } else if (formSections.length > 0 && formEl.clientHeight > 0) {
      const formRect = formEl.getBoundingClientRect()
      const triggerY = formRect.top + formRect.height * 0.35

      for (const sec of formSections) {
        const rect = sec.getBoundingClientRect()
        if (rect.top <= triggerY && rect.bottom >= formRect.top + 30) {
          activeKey = sec.getAttribute("data-section")
        }
      }
    }

    if (activeKey) {
      formSections.forEach((fSec) => {
        const isMatch = fSec.getAttribute("data-section") === activeKey
        if (isMatch) {
          fSec.setAttribute("data-active-section", "true")
          fSec.classList.add("editor-section-active")
        } else {
          fSec.removeAttribute("data-active-section")
          fSec.classList.remove("editor-section-active")
        }
      })
    }
  }, [])

  // 1. Proportional Bidirectional Scroll Sync
  const handleFormScroll = useCallback(() => {
    updateActiveSection()
    if (isSyncingRef.current === "preview") return
    const formEl = formRef.current
    const previewEl = previewRef.current
    if (!formEl || !previewEl) return

    const formScrollable = formEl.scrollHeight - formEl.clientHeight
    const previewScrollable = previewEl.scrollHeight - previewEl.clientHeight

    if (formScrollable > 0 && previewScrollable > 0) {
      isSyncingRef.current = "form"
      const ratio = formEl.scrollTop / formScrollable
      previewEl.scrollTop = ratio * previewScrollable

      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => {
        isSyncingRef.current = null
      }, 80)
    }
  }, [updateActiveSection])

  const handlePreviewScroll = useCallback(() => {
    updateActiveSection()
    if (isSyncingRef.current === "form") return
    const formEl = formRef.current
    const previewEl = previewRef.current
    if (!formEl || !previewEl) return

    const formScrollable = formEl.scrollHeight - formEl.clientHeight
    const previewScrollable = previewEl.scrollHeight - previewEl.clientHeight

    if (previewScrollable > 0 && formScrollable > 0) {
      isSyncingRef.current = "preview"
      const ratio = previewEl.scrollTop / previewScrollable
      formEl.scrollTop = ratio * formScrollable

      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => {
        isSyncingRef.current = null
      }, 80)
    }
  }, [updateActiveSection])

  // 2. Section Click & Focus Synchronizer
  const handleFormInteraction = useCallback((e: Event) => {
    const target = e.target as HTMLElement | null
    if (!target) return

    const sectionEl = target.closest("[data-section]") as HTMLElement | null
    if (!sectionEl) return

    const sectionKey = sectionEl.getAttribute("data-section")
    if (!sectionKey) return

    // Immediately highlight the clicked section
    const formEl = formRef.current
    if (formEl) {
      const formSections = formEl.querySelectorAll<HTMLElement>("[data-section]")
      formSections.forEach((fSec) => {
        if (fSec.getAttribute("data-section") === sectionKey) {
          fSec.setAttribute("data-active-section", "true")
          fSec.classList.add("editor-section-active")
        } else {
          fSec.removeAttribute("data-active-section")
          fSec.classList.remove("editor-section-active")
        }
      })
    }

    const previewEl = previewRef.current
    if (!previewEl) return

    const matchingPreviewEl = previewEl.querySelector(
      `[data-section="${sectionKey}"]`
    ) as HTMLElement | null

    if (matchingPreviewEl) {
      isSyncingRef.current = "form"
      matchingPreviewEl.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })

      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => {
        isSyncingRef.current = null
      }, 600)
    }
  }, [])

  // Attach event listeners and keep refreshed
  useEffect(() => {
    let attachedFormEl: HTMLDivElement | null = null
    let attachedPreviewEl: HTMLDivElement | null = null

    const bindListeners = () => {
      const formEl = formRef.current
      const previewEl = previewRef.current

      if (formEl && formEl !== attachedFormEl) {
        if (attachedFormEl) {
          attachedFormEl.removeEventListener("scroll", handleFormScroll)
          attachedFormEl.removeEventListener("click", handleFormInteraction)
          attachedFormEl.removeEventListener("focusin", handleFormInteraction)
        }
        formEl.addEventListener("scroll", handleFormScroll, { passive: true })
        formEl.addEventListener("click", handleFormInteraction)
        formEl.addEventListener("focusin", handleFormInteraction)
        attachedFormEl = formEl
      }

      if (previewEl && previewEl !== attachedPreviewEl) {
        if (attachedPreviewEl) {
          attachedPreviewEl.removeEventListener("scroll", handlePreviewScroll)
        }
        previewEl.addEventListener("scroll", handlePreviewScroll, { passive: true })
        attachedPreviewEl = previewEl
      }
    }

    bindListeners()

    // Poll briefly to catch delayed ref bindings on page mount/route switch
    const intervalId = setInterval(bindListeners, 250)

    return () => {
      clearInterval(intervalId)
      if (attachedFormEl) {
        attachedFormEl.removeEventListener("scroll", handleFormScroll)
        attachedFormEl.removeEventListener("click", handleFormInteraction)
        attachedFormEl.removeEventListener("focusin", handleFormInteraction)
      }
      if (attachedPreviewEl) {
        attachedPreviewEl.removeEventListener("scroll", handlePreviewScroll)
      }
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [handleFormScroll, handlePreviewScroll, handleFormInteraction])

  return { formRef, previewRef }
}
