import { useEffect, useState } from "react"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { useAddCms } from "@/hooks/cms/useAddCms"
import { useSetCmsDraft } from "./CmsDraftContext"

import { getDefaultCmsPageData } from "./defaultCmsData"

export function useCmsPage<
  T extends {
    name?: string
    slug?: string
    data?: Record<string, any>
    metadata?: unknown
  },
>(slug: string, name: string) {
  const { data: cmsData, isLoading } = useGetCmsBySlug(slug)

  const { mutate: saveCms, isPending: isSaving } = useAddCms()

  const setDraft = useSetCmsDraft<T>()

  // API response directly
  const [page, setPage] = useState<T | null>(null)

  useEffect(() => {
    if (isLoading) return
    if (cmsData?.data) {
      setPage(cmsData.data as unknown as T)
    } else {
      const defaults = getDefaultCmsPageData(slug, name) as unknown as T
      setPage(defaults)
    }
  }, [cmsData, isLoading, slug, name])

  useEffect(() => {
    if (page) {
      setDraft(page)
    }
  }, [page, setDraft])

  const save = () => {
    if (!page) return

    const existingCms = cmsData?.data
    const pageData = { ...(page.data ?? {}) }
    delete pageData.metadata
    const metadata = page.metadata
      ? {
          ...(page.metadata as Record<string, any>),
          robots: {
            ...(((page.metadata as Record<string, any>).robots ?? {}) as Record<
              string,
              any
            >),
            index: (page.metadata as Record<string, any>).robots?.index ?? true,
            follow:
              (page.metadata as Record<string, any>).robots?.follow ?? true,
          },
        }
      : undefined

    if (existingCms?.id) {
      saveCms({
        id: existingCms.id,
        slug,
        metadata,
        data: pageData,
      })
    } else {
      saveCms({
        name,
        slug,
        metadata,
        data: pageData,
      })
    }
  }

  return {
    page,
    setPage,
    isLoading,
    isSaving,
    save,
  }
}
