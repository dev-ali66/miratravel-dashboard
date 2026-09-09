import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";
import { toast } from "sonner";

export const useGetSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const response = await apiPrivate.get("/settings");
      return response.data.data;
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiPrivate.patch("/settings", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Settings updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update settings");
    },
  });
};
