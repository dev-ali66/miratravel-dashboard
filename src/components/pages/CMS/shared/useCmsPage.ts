import { useEffect, useState } from "react"
import { useGetCmsBySlug } from "@/hooks/cms/useGetCmsBySlug"
import { useAddCms } from "@/hooks/cms/useAddCms"
import { useSetCmsDraft } from "./CmsDraftContext"

export function useCmsPage<
  T extends { data?: Record<string, any> }
>(
  slug: string,
  name: string
) {
  const {
    data: cmsData,
    isLoading,
  } = useGetCmsBySlug(slug)

  const {
    mutate: saveCms,
    isPending: isSaving,
  } = useAddCms()

  const setDraft = useSetCmsDraft<T>()

  // API response directly
  const [page, setPage] = useState<T | null>(null)

  useEffect(() => {
    if (isLoading) return
    setPage(cmsData?.data ? (cmsData.data as unknown as T) : null)
  }, [cmsData, isLoading])

  useEffect(() => {
    if (page) {
      setDraft(page)
    }
  }, [page, setDraft])


  const save = () => {
    if (!page) return

    const existingCms = cmsData?.data
    const pageData = page.data ?? {}

    if (existingCms?.id) {
      saveCms({
        id: existingCms.id,
        slug,
        data: pageData,
      })
    } else {
      saveCms({
        name,
        slug,
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