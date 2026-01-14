"use client";

import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Filter, Calendar as CalendarIcon } from "lucide-react";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface Filters {
    camera?: string;
    date?: Date;
}

interface Props {
    defaultFilters: Filters;
    onSubmit: (f: Filters) => void;
}

export function FilterDrawer({ defaultFilters, onSubmit }: Props) {
    const [localFilters, setLocalFilters] = useState<Filters>(defaultFilters);
    const [openCalendar, setOpenCalendar] = useState(false);

    const handleSubmit = () => {
        onSubmit(localFilters);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 p-6">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>

                {/* CAMERA */}
                <div className="mt-6 space-y-2">
                    <p className="text-sm font-medium">Camera</p>

                    <Select
                        value={localFilters.camera ?? ""}
                        onValueChange={(value) =>
                            setLocalFilters((prev) => ({ ...prev, camera: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select camera" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Cam 01">Cam 01</SelectItem>
                            <SelectItem value="Cam 02">Cam 02</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* DATE */}
                <div className="mt-6 space-y-2">
                    <p className="text-sm font-medium">Detected Time</p>

                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {localFilters.date
                                    ? format(localFilters.date, "yyyy-MM-dd")
                                    : "Select date"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="p-0">
                            <Calendar
                                mode="single"
                                selected={localFilters.date}
                                onSelect={(date) => {
                                    setLocalFilters((prev) => ({ ...prev, date: date ?? undefined }));
                                    setOpenCalendar(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col gap-3 mt-8">

                    <SheetClose asChild>
                        <Button className="bg-[#064E3B] hover:bg-[#064E3B]/80" onClick={handleSubmit}>Apply Filter</Button>

                    </SheetClose>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setLocalFilters({})}
                    >
                        Clear Filters
                    </Button>
                </div>

            </SheetContent>
        </Sheet>
    );
}
