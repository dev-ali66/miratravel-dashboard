import { useRef } from "react"
import { useImageUpload } from "@/hooks/cms/useImageUpload"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Upload,
    Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadFieldProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        "onChange"
    > {
    label: string
    value?: string
    fieldName?: string
    onChange: (value: string) => void
}

export function ImageUploadField({
    label,
    value,
    fieldName = "",
    onChange,
    className,
    ...props
}: ImageUploadFieldProps) {
    const {
        mutate: uploadImage,
        isPending: isUploading,
    } = useImageUpload()

    const fileInputRef =
        useRef<HTMLInputElement>(null)

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]

        if (!file) return

        const fileRemove = value ? [value] : []

        uploadImage(
            {
                file,
                fieldName,
                fileRemove,
            },
            {
                onSuccess: (res) => {
                    const uploadedImages =
                        res.data?.[fieldName]

                    const newImage =
                        uploadedImages?.[0]

                    if (newImage) {
                        onChange(newImage)
                    }
                },
            }
        )

        e.target.value = ""
    }

    return (
        <div
            className={cn(
                "flex flex-col gap-3",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-2 text-foreground">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />

                <Label className="text-sm font-bold text-inherit">
                    {label}
                </Label>
            </div>

            <div
                className={cn(
                    "relative w-full h-[180px] rounded-xl border-2 border-dashed border-border flex items-center justify-center p-2 cursor-pointer transition-colors hover:bg-muted/50",
                    isUploading &&
                    "pointer-events-none opacity-50"
                )}
                onClick={() =>
                    fileInputRef.current?.click()
                }
            >
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />

                        <span className="text-sm font-medium">
                            Uploading...
                        </span>
                    </div>
                ) : value ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-muted/10 group">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-60 transition-opacity duration-300"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                                type="button"
                                variant="secondary"
                                className="gap-2 shadow-md rounded-full px-6"
                            >
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                Change Image
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8 opacity-50 mb-2" />

                        <span className="text-sm font-medium">
                            Click to upload image
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
