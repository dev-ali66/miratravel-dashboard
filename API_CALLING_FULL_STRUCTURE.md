# API Calling Structure for AI Agents

Use this file as a reusable instruction guide for adding API calls in frontend projects. The AI must first inspect the existing project structure, then follow the same pattern consistently.

## Main Rule

Do not call APIs randomly from UI components.

Always create a clean API layer using the project's existing structure, such as:

```txt
api/
services/
hooks/
lib/
utils/
```

If the project already has an API pattern, follow that pattern. Do not introduce a new pattern unless there is no existing one.

## Before Writing Code

First check:

- Where the API client is configured
- Which HTTP library is used: Axios, fetch, RTK Query, TanStack Query, SWR, etc.
- Where API hooks/services are stored
- How auth token is attached
- How errors are handled
- How loading state is handled
- How success/error messages are shown
- How environment variables are used
- Whether TypeScript types already exist

Then add the new API call using the same style.

## Recommended Folder Structure

For React/Next.js projects, prefer this structure if the project has no existing API pattern:

```txt
lib/
  axios.config.ts
  api-client.ts

hooks/
  <feature>/
    useGet<Resource>.ts
    useGet<Resource>ById.ts
    useCreate<Resource>.ts
    useUpdate<Resource>.ts
    useDelete<Resource>.ts
    types.ts
    queryKeys.ts
```

Example:

```txt
hooks/
  users/
    useGetUsers.ts
    useGetUserById.ts
    useCreateUser.ts
    useUpdateUser.ts
    useDeleteUser.ts
    types.ts
    queryKeys.ts
```

## API Client Rules

Create or use a shared API client.

Example with Axios:

```ts
import axios from "axios";

export const apiPublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const apiPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});
```

Use public client for:

- Login
- Register
- Forgot password
- Public listing APIs
- Public details APIs

Use private/authenticated client for:

- Profile APIs
- Dashboard APIs
- Admin APIs
- Create/update/delete APIs that require login
- Any endpoint requiring an access token

## Auth Token Rule

If the API requires auth, attach token in one shared place, not in every API call.

Example:

```ts
apiPrivate.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

Do not repeat this manually:

```ts
headers: {
  Authorization: `Bearer ${token}`,
}
```

inside every hook unless the project specifically requires it.

## GET API Structure

For GET APIs, create a query hook.

Example with TanStack Query:

```ts
import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";

type User = {
  id: string;
  name: string;
  email: string;
};

type UsersResponse = {
  success: boolean;
  data: User[];
  message?: string;
};

export function useGetUsers() {
  return useQuery({
    queryKey: ["GET_USERS"],
    queryFn: async () => {
      const res = await apiPrivate.get<UsersResponse>("/users");
      return res.data.data;
    },
  });
}
```

Rules:

- Use `useQuery` for GET.
- Use a stable query key.
- Return clean data for the UI.
- Type the API response.
- Avoid `any`.

## GET API With Params

When an API has search, filter, pagination, or sorting, include those values in the query key.

```ts
import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";

type UsersQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
};

export function useGetUsers(params: UsersQueryParams = {}) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const search = params.search ?? "";
  const status = params.status ?? "";

  return useQuery({
    queryKey: ["GET_USERS", page, limit, search, status],
    queryFn: async () => {
      const res = await apiPrivate.get("/users", {
        params: {
          page,
          limit,
          search,
          status,
        },
      });

      return res.data;
    },
  });
}
```

Rules:

- Pass query params using the HTTP client's params option.
- Include all params in the query key.
- Use default values before creating the query key.
- Return pagination meta if the API provides it.

## GET API By ID

Use `enabled` when the ID may be missing.

```ts
import { useQuery } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";

export function useGetUserById(id?: string) {
  return useQuery({
    queryKey: ["GET_USER_BY_ID", id],
    queryFn: async () => {
      const res = await apiPrivate.get(`/users/${id}`);
      return res.data.data;
    },
    enabled: Boolean(id),
  });
}
```

## POST API Structure

For POST APIs, create a mutation hook.

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";
import { toast } from "sonner";

type CreateUserPayload = {
  name: string;
  email: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const res = await apiPrivate.post<ApiResponse<unknown>>("/users", payload);
      return res.data;
    },
    onSuccess: async (res) => {
      toast.success(res.message || "Created successfully");
      await queryClient.invalidateQueries({ queryKey: ["GET_USERS"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
```

## PATCH/PUT API Structure

Use PATCH or PUT for update APIs depending on the backend.

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";
import { toast } from "sonner";

type UpdateUserPayload = {
  id: string;
  name?: string;
  email?: string;
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateUserPayload) => {
      const res = await apiPrivate.patch(`/users/${id}`, payload);
      return res.data;
    },
    onSuccess: async (_res, variables) => {
      toast.success("Updated successfully");

      await queryClient.invalidateQueries({ queryKey: ["GET_USERS"] });
      await queryClient.invalidateQueries({
        queryKey: ["GET_USER_BY_ID", variables.id],
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
```

## DELETE API Structure

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";
import { toast } from "sonner";

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiPrivate.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["GET_USERS"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
```

## File Upload API Structure

Use `FormData` for file uploads.

```ts
import { useMutation } from "@tanstack/react-query";
import { apiPrivate } from "@/lib/api-client";

type UploadPayload = {
  file: File;
  title: string;
};

export function useUploadFile() {
  return useMutation({
    mutationFn: async (payload: UploadPayload) => {
      const formData = new FormData();
      formData.append("file", payload.file);
      formData.append("title", payload.title);

      const res = await apiPrivate.post("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },
  });
}
```

Do not set `multipart/form-data` globally.

## Query Key Rules

Use predictable query keys.

Examples:

```ts
["GET_USERS"]
["GET_USERS", page, limit, search]
["GET_USER_BY_ID", id]
["GET_PRODUCTS"]
["GET_PRODUCT_BY_ID", id]
```

For large features, create a `queryKeys.ts` file:

```ts
export const userQueryKeys = {
  all: ["GET_USERS"] as const,
  list: (params: UsersQueryParams) =>
    ["GET_USERS", params.page, params.limit, params.search] as const,
  detail: (id: string) => ["GET_USER_BY_ID", id] as const,
};
```

## Type Rules

Always define types for:

- Request payload
- Query params
- API response
- Normalized UI data

Avoid:

```ts
any
```

Prefer:

```ts
unknown
```

or proper typed response objects.

## Error Handling

Create a reusable error helper.

```ts
export function getApiErrorMessage(error: unknown): string {
  if (typeof error === "object" && error && "response" in error) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return apiError.response?.data?.message || "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed";
}
```

Use it in mutations:

```ts
onError: (error) => {
  toast.error(getApiErrorMessage(error));
}
```

## Data Mapping Rule

If backend data shape is not ideal for the UI, map it inside the hook.

Example:

```ts
type BeachApiItem = {
  id: string;
  name: string;
};

type SelectOption = {
  label: string;
  value: string;
};

export function useGetBeachOptions() {
  return useQuery({
    queryKey: ["GET_BEACH_OPTIONS"],
    queryFn: async (): Promise<SelectOption[]> => {
      const res = await apiPublic.get<{ data: BeachApiItem[] }>("/beaches");

      return res.data.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    },
  });
}
```

Keep UI components simple. Components should not know backend response complexity.

## UI Usage Rule

Use hooks inside components.

```tsx
const { data, isLoading, isError } = useGetUsers({
  page,
  limit,
  search,
});
```

For mutations:

```tsx
const { mutate, isPending } = useCreateUser();

function handleSubmit(values: CreateUserPayload) {
  mutate(values);
}
```

Rules:

- Disable submit button while `isPending`.
- Show loading UI while `isLoading`.
- Show error UI when `isError`.
- Do not call API client directly from JSX components.

## Cache Invalidation Rule

After create/update/delete, invalidate related GET queries.

Examples:

```ts
await queryClient.invalidateQueries({ queryKey: ["GET_USERS"] });
await queryClient.invalidateQueries({ queryKey: ["GET_USER_BY_ID", id] });
```

Do not invalidate unrelated queries.

## Environment Variable Rule

Store API base URL in environment variables.

Examples:

```txt
NEXT_PUBLIC_API_URL=https://api.example.com
VITE_API_URL=https://api.example.com
```

Never hardcode production API URLs directly inside hooks.

## AI Agent Checklist

Before implementing an API call, the AI must know:

- Feature name
- HTTP method
- Endpoint path
- Auth required or public
- Query params
- Request body
- Response shape
- UI component that will use it
- Success behavior
- Error behavior
- Related query keys to invalidate

Implementation checklist:

- Use the existing API client
- Create hook/service in the correct feature folder
- Use `useQuery` for GET
- Use `useMutation` for POST/PATCH/PUT/DELETE
- Add request and response types
- Add stable query keys
- Add loading/error/success handling
- Add cache invalidation for mutations
- Do not use `any`
- Do not call API directly inside UI components

## Prompt Template for AI

```txt
Follow API_CALLING_FULL_STRUCTURE.md.

Add this API integration:
- Feature:
- Method:
- Endpoint:
- Auth: public/private
- Query params:
- Payload:
- Response shape:
- UI file/component:
- Success behavior:
- Error behavior:
- Query keys to invalidate:

Use the project's existing API client and folder pattern.
Use useQuery for GET.
Use useMutation for POST/PATCH/PUT/DELETE.
Add TypeScript types.
Avoid any.
Do not call API directly inside UI components.
```