import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Loader2, Inbox } from "lucide-react";
import Pagination from "@/components/pages/UserList/Pagination";
import { useGetRequests } from "@/hooks/requests/useGetRequests";
import { useUpdateRequestStatus } from "@/hooks/requests/useUpdateRequestStatus";
import RequestDetailsModal from "./RequestDetailsModal";

export default function RequestListTable() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const limit = 10;

    const { data, isLoading, isError } = useGetRequests(currentPage, limit);
    const { mutate: updateStatus, isPending: isUpdating } = useUpdateRequestStatus();

    const requestList = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    console.log("RequestListTable Rendered", isLoading);
   
    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pt-2">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Inbox className="w-8 h-8 text-primary" /> Instructor Requests
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Review and manage incoming requests to become an instructor.
                    </p>
                </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xl overflow-hidden min-h-100">
                {isLoading ? (
                    <div className="w-full">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border/60">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold tracking-wider">User</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Skill Level</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <tr key={i} className="border-b border-border/40">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-muted/60 animate-pulse shrink-0" />
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <div className="h-4 w-32 bg-muted/60 rounded animate-pulse" />
                                                        <div className="h-3 w-48 bg-muted/40 rounded animate-pulse" />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 w-20 bg-muted/60 rounded animate-pulse" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-4 w-24 bg-muted/60 rounded animate-pulse" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="h-6 w-20 bg-muted/60 rounded-full animate-pulse" />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="h-8 w-8 bg-muted/60 rounded-md animate-pulse" />
                                                    <div className="h-8 w-8 bg-muted/60 rounded-md animate-pulse" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex justify-center items-center h-64 text-rose-500">
                        Failed to load requests.
                    </div>
                ) : requestList.length === 0 ? (
                    <div className="flex justify-center items-center h-64 text-muted-foreground">
                        No pending requests found.
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left overflow-hidden">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b border-border/60">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold tracking-wider">User</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Skill Level</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                        <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requestList.map((user, idx) => {
                                        const name = user.userPersonalInfo?.firstName
                                            ? `${user.userPersonalInfo.firstName} ${user.userPersonalInfo.lastName || ''}`
                                            : "No Name";
                                        const avatar = user.userPersonalInfo?.photoUrl?.[0] || "https://i.pravatar.cc/150?u=default";
                                        const role = user.roles?.[0]?.name || "USER";
                                        const skillData = user.instructorInfo?.skill;
                                        const skill = (Array.isArray(skillData) ? skillData.join(", ") : skillData) || "N/A";
                                        const status = user.isVerified ? "Verified" : "Pending";

                                        return (
                                            <motion.tr
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05, duration: 0.3 }}
                                                key={user.id}
                                                className="group border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors"
                                            >
                                                <td
                                                    className="px-6 py-4 cursor-pointer hover:bg-muted/10 transition-colors"
                                                    onClick={() => setSelectedUser(user)}
                                                    title="View Details"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-300">
                                                            <img
                                                                src={avatar}
                                                                alt={name}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{name}</span>
                                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-foreground font-medium capitalize">{role.toLowerCase()}</span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground capitalize">
                                                    {skill.toLowerCase()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.isVerified
                                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                        }`}>
                                                        {status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            className="p-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Approve Request"
                                                            disabled={isUpdating}
                                                            onClick={() => updateStatus({ id: user.id, isVerified: true, status: 'ACTIVE' })}
                                                        >
                                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                            title="Reject Request"
                                                            disabled={isUpdating}
                                                            onClick={() => updateStatus({ id: user.id, isVerified: false, status: 'INACTIVE' })}
                                                        >
                                                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="border-t border-border/60 bg-background/50 backdrop-blur-xl p-5">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <RequestDetailsModal
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                isUpdating={isUpdating}
                updateStatus={updateStatus}
            />
        </div>
    );
}
