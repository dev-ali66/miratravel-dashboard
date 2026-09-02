import { Loader2, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RequestDetailsModalProps {
    selectedUser: any | null;
    setSelectedUser: (user: any | null) => void;
    isUpdating: boolean;
    updateStatus: (data: { id: string, isVerified: boolean, status?: string }) => void;
}

export default function RequestDetailsModal({
    selectedUser,
    setSelectedUser,
    isUpdating,
    updateStatus
}: RequestDetailsModalProps) {
    return (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Instructor Request Details</DialogTitle>
                    <DialogDescription>
                        Review the detailed information for this applicant.
                    </DialogDescription>
                </DialogHeader>
                
                {selectedUser && (
                    <div className="flex flex-col gap-5 mt-2">
                        <div className="flex items-center gap-4 border-b border-border/40 pb-5">
                            <img 
                                src={selectedUser.userPersonalInfo?.photoUrl?.[0] || "https://i.pravatar.cc/150?u=default"}
                                alt="Profile" 
                                className="w-16 h-16 rounded-full object-cover border border-border"
                            />
                            <div className="flex flex-col">
                                <span className="text-xl font-bold">
                                    {selectedUser.userPersonalInfo?.firstName 
                                        ? `${selectedUser.userPersonalInfo.firstName} ${selectedUser.userPersonalInfo.lastName || ''}`
                                        : "No Name"}
                                </span>
                                <span className="text-sm text-muted-foreground">{selectedUser.email}</span>
                                <span className="text-xs uppercase bg-primary/10 text-primary font-bold w-fit px-2.5 py-0.5 rounded-full mt-1.5 border border-primary/20">
                                    {selectedUser.roles?.[0]?.name || "USER"}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-sm bg-muted/20 p-4 rounded-xl border border-border/40">
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Skill Level</span>
                                <span className="font-medium capitalize text-foreground">
                                    {Array.isArray(selectedUser.instructorInfo?.skill) 
                                        ? selectedUser.instructorInfo.skill.join(", ").toLowerCase() 
                                        : (selectedUser.instructorInfo?.skill?.toLowerCase() || "N/A")}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Experience</span>
                                <span className="font-medium text-foreground">{selectedUser.instructorInfo?.experience || "Not provided"}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Preferred Time</span>
                                <span className="font-medium capitalize text-foreground">
                                    {Array.isArray(selectedUser.instructorInfo?.preferredTime) 
                                        ? selectedUser.instructorInfo.preferredTime.join(", ").toLowerCase() 
                                        : (selectedUser.instructorInfo?.preferredTime?.toLowerCase() || "N/A")}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Verification Status</span>
                                <span className={`font-medium ${selectedUser.isVerified ? "text-emerald-500" : "text-amber-500"}`}>
                                    {selectedUser.isVerified ? "Verified" : "Pending"}
                                </span>
                            </div>
                        </div>

                        {selectedUser.instructorInfo?.license?.length > 0 && (
                            <div className="flex flex-col mt-2">
                                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-3">Licenses & Documents</span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedUser.instructorInfo.license.map((lic: string, i: number) => (
                                        <a 
                                            key={i} 
                                            href={lic} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            className="inline-flex items-center gap-2 text-sm bg-background border border-border/60 rounded-lg px-3 py-2 hover:bg-muted hover:border-primary/30 transition-all text-primary max-w-50"
                                        >
                                            <div className="truncate">View Document {i + 1}</div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border/40">
                            <button 
                                className="px-4 py-2 text-sm font-medium text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 active:scale-95"
                                disabled={isUpdating}
                                onClick={() => {
                                    updateStatus({ id: selectedUser.id, isVerified: false, status: 'INACTIVE' });
                                    setSelectedUser(null);
                                }}
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                Reject
                            </button>
                            <button 
                                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-primary/20 flex items-center gap-2 active:scale-95"
                                disabled={isUpdating || selectedUser.isVerified}
                                onClick={() => {
                                    updateStatus({ id: selectedUser.id, isVerified: true, status: 'ACTIVE' });
                                    setSelectedUser(null);
                                }}
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Approve Request
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
