import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "../ui/popover";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface Dropdown01Option {
    label: string;
    value: string;
}

export interface Dropdown01Props {
    options: Dropdown01Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    triggerClassName?: string;
}

export default function Dropdown01({
    options,
    value,
    onChange,
    placeholder = "Select option",
    triggerClassName
}: Dropdown01Props) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="cursor-pointer" asChild>
                <Button
                    className={cn("rounded font-medium cursor-pointer", triggerClassName)}
                    variant={triggerClassName ? "ghost" : "outline"}
                >
                    {options.find((s) => s.value === value)?.label || placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 shadow-sm rounded border-none p-1">
                <div className="flex gap-1 flex-col">
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className={cn(
                                "w-full py-2 px-3 rounded text-left hover:bg-secondary font-medium transition-colors cursor-pointer",
                                value === option.value && "bg-secondary text-primary"
                            )}
                            onClick={() => {
                                onChange?.(option.value);
                                setOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}