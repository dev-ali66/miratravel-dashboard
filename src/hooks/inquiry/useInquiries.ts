import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { toast } from "sonner"

export interface InquiryItem {
  id: string
  inquiryNumber: string
  fullName: string
  email: string
  phone?: string | null
  destination?: string | null
  travelDate?: string | null
  travelers?: string | null
  journeyTypes: string[]
  message?: string | null
  status: "NEW" | "IN_REVIEW" | "CONTACTED" | "CLOSED"
  adminNotes?: string | null
  createdAt: string
  updatedAt?: string
}

export interface GetInquiriesParams {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export interface GetInquiriesResponse {
  success: boolean
  message: string
  code: number
  data: InquiryItem[]
  meta?: {
    total: number
    page: number
    limit: number
    totalPages?: number
  }
}

export function useGetInquiries(params: GetInquiriesParams = {}) {
  const { page = 1, limit = 10, search, status } = params

  return useQuery({
    queryKey: ["inquiries", page, limit, search, status],
    queryFn: async () => {
      const queryParams: Record<string, string> = {
        page: String(page),
        limit: String(limit),
      }
      if (search?.trim()) queryParams.search = search.trim()
      if (status && status !== "ALL") queryParams.status = status

      const res = await apiPrivate.get<GetInquiriesResponse>("/inquiry", {
        params: queryParams,
      })
      return res.data
    },
    placeholderData: keepPreviousData,
  })
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status?: string; adminNotes?: string }) => {
      const res = await apiPrivate.patch(`/inquiry/${id}`, {
        ...(status ? { status } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      })
      return res.data
    },
    onSuccess: () => {
      toast.success("Inquiry updated successfully")
      queryClient.invalidateQueries({ queryKey: ["inquiries"] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update inquiry")
    },
  })
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiPrivate.delete(`/inquiry/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Inquiry deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["inquiries"] })
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete inquiry")
    },
  })
}
