import { useEffect, useRef, useCallback } from "react"

export function useSyncScroll() {
  const formRef = useRef<HTMLDivElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const isSyncingRef = useRef<"form" | "preview" | null>(null)
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafIdRef = useRef<number | null>(null)

  // Helper: Get element top offset relative to the scrollable container content (scale-aware)
  const getAbsoluteTop = (child: HTMLElement, container: HTMLElement): number => {
    const childRect = child.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()
    const scale = container.offsetWidth > 0 ? containerRect.width / container.offsetWidth : 1
    const safeScale = scale > 0.05 ? scale : 1
    return (childRect.top - containerRect.top) / safeScale + container.scrollTop
  }

  // Helper: Get element height accurately
  const getElementHeight = (el: HTMLElement): number => {
    return el.offsetHeight || el.getBoundingClientRect().height || 1
  }

  // Helper: Detect and mark active section in form
  const updateActiveSection = useCallback(() => {
    const previewEl = previewRef.current
    const formEl = formRef.current
    if (!previewEl || !formEl) return

    const previewSections = Array.from(previewEl.querySelectorAll<HTMLElement>("[data-section]"))
    const formSections = Array.from(formEl.querySelectorAll<HTMLElement>("[data-section]"))
    if (previewSections.length === 0 && formSections.length === 0) return

    let activeKey: string | null = null

    if (previewSections.length > 0 && previewEl.clientHeight > 0) {
      const containerRect = previewEl.getBoundingClientRect()
      const triggerY = containerRect.top + containerRect.height * 0.3 // 30% from container top

      for (const sec of previewSections) {
        const rect = sec.getBoundingClientRect()
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          activeKey = sec.getAttribute("data-section")
          break
        }
      }

      if (!activeKey && previewSections.length > 0) {
        // Fallback to closest section
        for (const sec of previewSections) {
          const rect = sec.getBoundingClientRect()
          if (rect.bottom >= containerRect.top + 20) {
            activeKey = sec.getAttribute("data-section")
            break
          }
        }
      }
    } else if (formSections.length > 0 && formEl.clientHeight > 0) {
      const containerRect = formEl.getBoundingClientRect()
      const triggerY = containerRect.top + containerRect.height * 0.3

      for (const sec of formSections) {
        const rect = sec.getBoundingClientRect()
        if (rect.top <= triggerY && rect.bottom >= triggerY) {
          activeKey = sec.getAttribute("data-section")
          break
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

  // 1. Form Scroll Handler -> Syncs to Preview
  const handleFormScroll = useCallback(() => {
    updateActiveSection()
    if (isSyncingRef.current === "preview") return

    const formEl = formRef.current
    const previewEl = previewRef.current
    if (!formEl || !previewEl) return

    const formSections = Array.from(formEl.querySelectorAll<HTMLElement>("[data-section]"))
    const previewSections = Array.from(previewEl.querySelectorAll<HTMLElement>("[data-section]"))

    // Top boundary check
    if (formEl.scrollTop <= 5) {
      isSyncingRef.current = "form"
      previewEl.scrollTop = 0
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => { isSyncingRef.current = null }, 50)
      return
    }

    // Bottom boundary check
    const formMaxScroll = formEl.scrollHeight - formEl.clientHeight
    const previewMaxScroll = previewEl.scrollHeight - previewEl.clientHeight
    if (formMaxScroll > 0 && formEl.scrollTop >= formMaxScroll - 5) {
      isSyncingRef.current = "form"
      previewEl.scrollTop = previewMaxScroll
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => { isSyncingRef.current = null }, 50)
      return
    }

    if (formSections.length > 0 && previewSections.length > 0) {
      const focusOffset = formEl.clientHeight * 0.3
      const formFocusY = formEl.scrollTop + focusOffset

      let currentFormSec: HTMLElement | null = null
      let secProgress = 0

      for (let i = 0; i < formSections.length; i++) {
        const fSec = formSections[i]
        const secTop = getAbsoluteTop(fSec, formEl)
        const secHeight = getElementHeight(fSec)
        const secBottom = secTop + secHeight

        if (formFocusY >= secTop && formFocusY <= secBottom) {
          currentFormSec = fSec
          secProgress = Math.max(0, Math.min(1, (formFocusY - secTop) / Math.max(1, secHeight)))
          break
        }
      }

      if (currentFormSec) {
        const sectionKey = currentFormSec.getAttribute("data-section")
        const targetPreviewSec = previewSections.find(s => s.getAttribute("data-section") === sectionKey)

        if (targetPreviewSec) {
          isSyncingRef.current = "form"
          const targetSecTop = getAbsoluteTop(targetPreviewSec, previewEl)
          const targetSecHeight = getElementHeight(targetPreviewSec)
          const previewFocusOffset = previewEl.clientHeight * 0.3

          const targetScrollTop = targetSecTop + (targetSecHeight * secProgress) - previewFocusOffset

          if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = requestAnimationFrame(() => {
            previewEl.scrollTop = Math.max(0, Math.min(targetScrollTop, previewMaxScroll))
          })

          if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
          syncTimerRef.current = setTimeout(() => {
            isSyncingRef.current = null
          }, 60)
          return
        }
      }
    }

    // Proportional Fallback
    if (formMaxScroll > 0 && previewMaxScroll > 0) {
      isSyncingRef.current = "form"
      const ratio = formEl.scrollTop / formMaxScroll
      previewEl.scrollTop = ratio * previewMaxScroll

      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => {
        isSyncingRef.current = null
      }, 60)
    }
  }, [updateActiveSection])

  // 2. Preview Scroll Handler -> Syncs to Form
  const handlePreviewScroll = useCallback(() => {
    updateActiveSection()
    if (isSyncingRef.current === "form") return

    const formEl = formRef.current
    const previewEl = previewRef.current
    if (!formEl || !previewEl) return

    const formSections = Array.from(formEl.querySelectorAll<HTMLElement>("[data-section]"))
    const previewSections = Array.from(previewEl.querySelectorAll<HTMLElement>("[data-section]"))

    // Top boundary check
    if (previewEl.scrollTop <= 5) {
      isSyncingRef.current = "preview"
      formEl.scrollTop = 0
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => { isSyncingRef.current = null }, 50)
      return
    }

    // Bottom boundary check
    const formMaxScroll = formEl.scrollHeight - formEl.clientHeight
    const previewMaxScroll = previewEl.scrollHeight - previewEl.clientHeight
    if (previewMaxScroll > 0 && previewEl.scrollTop >= previewMaxScroll - 5) {
      isSyncingRef.current = "preview"
      formEl.scrollTop = formMaxScroll
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => { isSyncingRef.current = null }, 50)
      return
    }

    if (formSections.length > 0 && previewSections.length > 0) {
      const focusOffset = previewEl.clientHeight * 0.3
      const previewFocusY = previewEl.scrollTop + focusOffset

      let currentPreviewSec: HTMLElement | null = null
      let secProgress = 0

      for (let i = 0; i < previewSections.length; i++) {
        const pSec = previewSections[i]
        const secTop = getAbsoluteTop(pSec, previewEl)
        const secHeight = getElementHeight(pSec)
        const secBottom = secTop + secHeight

        if (previewFocusY >= secTop && previewFocusY <= secBottom) {
          currentPreviewSec = pSec
          secProgress = Math.max(0, Math.min(1, (previewFocusY - secTop) / Math.max(1, secHeight)))
          break
        }
      }

      if (currentPreviewSec) {
        const sectionKey = currentPreviewSec.getAttribute("data-section")
        const targetFormSec = formSections.find(s => s.getAttribute("data-section") === sectionKey)

        if (targetFormSec) {
          isSyncingRef.current = "preview"
          const targetSecTop = getAbsoluteTop(targetFormSec, formEl)
          const targetSecHeight = getElementHeight(targetFormSec)
          const formFocusOffset = formEl.clientHeight * 0.3

          const targetScrollTop = targetSecTop + (targetSecHeight * secProgress) - formFocusOffset

          if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = requestAnimationFrame(() => {
            formEl.scrollTop = Math.max(0, Math.min(targetScrollTop, formMaxScroll))
          })

          if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
          syncTimerRef.current = setTimeout(() => {
            isSyncingRef.current = null
          }, 60)
          return
        }
      }
    }

    // Proportional Fallback
    if (previewMaxScroll > 0 && formMaxScroll > 0) {
      isSyncingRef.current = "preview"
      const ratio = previewEl.scrollTop / previewMaxScroll
      formEl.scrollTop = ratio * formMaxScroll

      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => {
        isSyncingRef.current = null
      }, 60)
    }
  }, [updateActiveSection])

  // 3. Section Click & Focus Synchronizer
  const handleFormInteraction = useCallback((e: Event) => {
    const target = e.target as HTMLElement | null
    if (!target) return

    const sectionEl = target.closest("[data-section]") as HTMLElement | null
    if (!sectionEl) return

    const sectionKey = sectionEl.getAttribute("data-section")
    if (!sectionKey) return

    // Highlight the clicked section in form
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
      const targetTop = getAbsoluteTop(matchingPreviewEl, previewEl)
      const targetScrollTop = Math.max(0, targetTop - previewEl.clientHeight * 0.15)

      previewEl.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
      })

      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
      syncTimerRef.current = setTimeout(() => {
        isSyncingRef.current = null
      }, 600)
    }
  }, [])

  // Attach event listeners with resilient ref checking
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
    const intervalId = setInterval(bindListeners, 300)

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
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [handleFormScroll, handlePreviewScroll, handleFormInteraction])

  return { formRef, previewRef }
}

