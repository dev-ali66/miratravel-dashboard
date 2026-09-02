import { useGetPages, type PageData } from "@/hooks/cms/useGetPages"
import { useDeletePage } from "@/hooks/cms/useDeletePage"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Trash2, FileText, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function CMSPage() {
    const { data, isLoading } = useGetPages();
    const { mutate: deletePage, isPending: isDeleting } = useDeletePage();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState<PageData | null>(null);

    const openDeleteModal = (page: PageData) => {
        setSelectedPage(page);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedPage) return;
        deletePage(selectedPage.id, {
            onSuccess: () => {
                toast.success(`"${selectedPage.name}" page deleted.`);
                setDeleteModalOpen(false);
                setSelectedPage(null);
            },
            onError: () => {
                toast.error("Failed to delete page. Please try again.");
            },
        });
    };

    const pages = data?.data ?? [];

    return (
        <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pt-2">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Content Management System
                    </h1>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            ) : pages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {pages.map((page) => (
                        <div key={page.id} className="group relative rounded-xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
                            <button
                                onClick={() => openDeleteModal(page)}
                                className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                title="Delete Page"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div>
                                <h3 className="text-[17px] font-bold text-foreground capitalize mb-2 pr-8">
                                    Manage {page.name.replace(/([A-Z])/g, ' $1').trim()} Page
                                </h3>
                                <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed">
                                    Manage texts, images, and content for the {page.name.replace(/([A-Z])/g, ' $1').trim()} page.
                                </p>
                            </div>
                            <Link 
                                to={`/cms/${page.slug}&&${page.id}`} 
                                className="text-sm font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors group/link"
                            >
                                Edit {page.name.replace(/([A-Z])/g, ' $1').trim()} Page
                                <span className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-xl bg-card/50 border-dashed border-border/60">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Pages Found</h3>
                    <p className="text-muted-foreground max-w-sm">
                        There are no CMS pages created yet. Click the "Create Page" button above to get started.
                    </p>
                </div>
            )}

            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete page?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete "{selectedPage?.name}". This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting} className="gap-1.5">
                            {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
