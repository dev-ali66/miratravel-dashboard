import { useEffect, useRef, useCallback } from "react"

export interface UseSyncScrollOptions {
  /**
   * Mode for scroll sync:
   * - "bidirectional": scrolling preview updates form accordion, and clicking form scrolls preview (default)
   * - "previewToFormOnly": ONLY scrolling preview updates form; clicking/interacting with form does NOT scroll preview
   * - "formToPreviewOnly": ONLY clicking/interacting with form scrolls preview
   * - "disabled": no scroll sync
   */
  mode?: "bidirectional" | "previewToFormOnly" | "formToPreviewOnly" | "disabled"
}

export function useSyncScroll(options: UseSyncScrollOptions = {}) {
  const { mode = "previewToFormOnly" } = options
  const formRef = useRef<HTMLDivElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const lastActiveKeyRef = useRef<string | null>(null)
  const isFormInteractingRef = useRef<boolean>(false)
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Helper: Get element top offset relative to scrollable container
  const getAbsoluteTop = (child: HTMLElement, container: HTMLElement): number => {
    const childRect = child.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const scale = container.offsetWidth > 0 ? containerRect.width / container.offsetWidth : 1
    const safeScale = scale > 0.05 ? scale : 1
    return (childRect.top - containerRect.top) / safeScale + container.scrollTop
  }

  // 1. Preview Scroll Handler: ONLY detects active preview section & expands form accordion when user scrolls preview
  const handlePreviewScroll = useCallback(() => {
    const previewEl = previewRef.current
    const formEl = formRef.current
    if (!previewEl || !formEl) return

    // If user is currently interacting with the form sidebar or has focus inside it, DO NOT auto-switch form section
    if (isFormInteractingRef.current || (document.activeElement && formEl.contains(document.activeElement))) {
      return
    }

    const previewSections = Array.from(previewEl.querySelectorAll<HTMLElement>("[data-section]"))
    if (previewSections.length === 0) return

    const containerRect = previewEl.getBoundingClientRect()
    const triggerY = containerRect.top + containerRect.height * 0.25 // 25% from top of preview pane

    let activeKey: string | null = null

    for (const sec of previewSections) {
      const rect = sec.getBoundingClientRect()
      if (rect.top <= triggerY && rect.bottom >= triggerY) {
        activeKey = sec.getAttribute("data-section")
        break
      }
    }

    if (!activeKey && previewSections.length > 0) {
      for (const sec of previewSections) {
        const rect = sec.getBoundingClientRect()
        if (rect.bottom >= containerRect.top + 50) {
          activeKey = sec.getAttribute("data-section")
          break
        }
      }
    }

    if (activeKey && activeKey !== lastActiveKeyRef.current) {
      lastActiveKeyRef.current = activeKey

      // Highlight active section in form
      const formSections = formEl.querySelectorAll<HTMLElement>("[data-section]")
      formSections.forEach((fSec) => {
        if (fSec.getAttribute("data-section") === activeKey) {
          fSec.setAttribute("data-active-section", "true")
          fSec.classList.add("editor-section-active")
        } else {
          fSec.removeAttribute("data-active-section")
          fSec.classList.remove("editor-section-active")
        }
      })

      // Dispatch custom event so active form section automatically expands open from collapsed state
      window.dispatchEvent(
        new CustomEvent("editor-active-section-change", {
          detail: { sectionKey: activeKey },
        })
      )

      // Gently scroll form container to make active section visible in form sidebar
      const matchingFormSec = formEl.querySelector(
        `[data-section="${activeKey}"]`
      ) as HTMLElement | null

      if (matchingFormSec) {
        const targetTop = getAbsoluteTop(matchingFormSec, formEl)
        formEl.scrollTo({
          top: Math.max(0, targetTop - 20),
          behavior: "smooth",
        })
      }
    }
  }, [])

  // 2. Form Interaction Handler: When user clicks/focuses a form section, scroll preview to that section
  const handleFormInteraction = useCallback((e: Event) => {
    isFormInteractingRef.current = true
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current)
    interactionTimerRef.current = setTimeout(() => {
      isFormInteractingRef.current = false
    }, 3000)

    const target = e.target as HTMLElement | null
    if (!target) return

    const sectionEl = target.closest("[data-section]") as HTMLElement | null
    if (!sectionEl) return

    const sectionKey = sectionEl.getAttribute("data-section")
    if (!sectionKey) return

    lastActiveKeyRef.current = sectionKey

    // Highlight section in form
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

    // Scroll preview to matching section (ONLY if formToPreview is allowed)
    if (mode === "bidirectional" || mode === "formToPreviewOnly") {
      const previewEl = previewRef.current
      if (!previewEl) return

      const matchingPreviewEl = previewEl.querySelector(
        `[data-section="${sectionKey}"]`
      ) as HTMLElement | null

      if (matchingPreviewEl) {
        const targetTop = getAbsoluteTop(matchingPreviewEl, previewEl)
        const targetScrollTop = Math.max(0, targetTop - 20)

        previewEl.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        })
      }
    }
  }, [mode])

  // Attach event listeners
  useEffect(() => {
    if (mode === "disabled") return

    let attachedFormEl: HTMLDivElement | null = null
    let attachedPreviewEl: HTMLDivElement | null = null

    const bindListeners = () => {
      const formEl = formRef.current
      const previewEl = previewRef.current

      // Listen to form interactions if bidirectional or formToPreviewOnly
      if (mode === "bidirectional" || mode === "formToPreviewOnly") {
        if (formEl && formEl !== attachedFormEl) {
          if (attachedFormEl) {
            attachedFormEl.removeEventListener("click", handleFormInteraction)
            attachedFormEl.removeEventListener("focusin", handleFormInteraction)
            attachedFormEl.removeEventListener("input", handleFormInteraction)
            attachedFormEl.removeEventListener("change", handleFormInteraction)
            attachedFormEl.removeEventListener("mousedown", handleFormInteraction)
          }
          formEl.addEventListener("click", handleFormInteraction)
          formEl.addEventListener("focusin", handleFormInteraction)
          formEl.addEventListener("input", handleFormInteraction)
          formEl.addEventListener("change", handleFormInteraction)
          formEl.addEventListener("mousedown", handleFormInteraction)
          attachedFormEl = formEl
        }
      }

      // Listen to preview scrolling if bidirectional or previewToFormOnly
      if (mode === "bidirectional" || mode === "previewToFormOnly") {
        if (previewEl && previewEl !== attachedPreviewEl) {
          if (attachedPreviewEl) {
            attachedPreviewEl.removeEventListener("scroll", handlePreviewScroll)
          }
          previewEl.addEventListener("scroll", handlePreviewScroll, { passive: true })
          attachedPreviewEl = previewEl
        }
      }
    }

    bindListeners()
    const intervalId = setInterval(bindListeners, 300)

    return () => {
      clearInterval(intervalId)
      if (attachedFormEl) {
        attachedFormEl.removeEventListener("click", handleFormInteraction)
        attachedFormEl.removeEventListener("focusin", handleFormInteraction)
        attachedFormEl.removeEventListener("input", handleFormInteraction)
        attachedFormEl.removeEventListener("change", handleFormInteraction)
        attachedFormEl.removeEventListener("mousedown", handleFormInteraction)
      }
      if (attachedPreviewEl) {
        attachedPreviewEl.removeEventListener("scroll", handlePreviewScroll)
      }
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current)
    }
  }, [handlePreviewScroll, handleFormInteraction])

  return { formRef, previewRef }
}
