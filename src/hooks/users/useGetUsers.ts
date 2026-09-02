import { useQuery } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"

export type UserInstructorInfo = {
    skill: string;
    experience: string | null;
    license: string[];
    languages: string[];
    preferredTime: string;
    creditBalance: number;
    free_lead_used: boolean;
    beach: any[];
    leads: any[];
};

export type UserItem = {
    id: string;
    email: string;
    status: string;
    isVerified: boolean;
    isDeleted: boolean;
    roles: string;
    firstName: string | null;
    lastName: string | null;
    photoUrl: string | null;
    lastLoginAt: string | null;
    instructorInfo?: UserInstructorInfo | null;
}

export type GetUsersResponse = {
    success: boolean;
    message: string;
    code: number;
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    data: UserItem[];
}

export function useGetUsers(page: number = 1, limit: number = 10) {
    return useQuery({
        queryKey: ["users", page, limit],
        queryFn: async () => {
            const res = await apiPrivate.get<GetUsersResponse>("/users", {
                params: { page, limit, isDeleted: "false" }
            })
            return res.data
        }
    })
}
