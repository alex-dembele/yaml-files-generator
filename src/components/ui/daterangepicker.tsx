
import * as React from "react"
import { format } from "date-fns" // Removed addDays
import { CalendarIcon, ChevronDown } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// Define props including the callback and placeholder
interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    initialDate?: DateRange;
    onRangeSelect?: (range: DateRange | undefined) => void;
    placeholder?: string;
    id?: string; // Add id prop
    value?:DateRange | undefined;
}

export function DatePickerWithRange({
    className,
    initialDate,
    onRangeSelect,
    placeholder = "Pick a date range", // Default placeholder
    id // Destructure id
}: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(initialDate);

    // Call the callback when the date changes
    const handleSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate);
       // setDate(value);
        if (onRangeSelect) {
            onRangeSelect(selectedDate);
        }
    };

    return (
        <div className={cn("grid gap-2")}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id={id || "date"} // Use provided id or default
                        variant={"outline"}
                        className={cn(
                            className,
                            "w-full justify-start text-left font-normal hover:bg-white hover:text-black", // Use w-full for better layout
                            !date && "text-muted-foreground" // Keep muted style when no date
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" /> {/* Add margin to icon */}
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "PPP")} - {format(date.to, "PPP")}   {/* Use PPP format */} 
                                    {/* <X size={25} onClick={ ()=> {setDate(initialDate);console.log("test")}} className="text-[#A3AED0] " /> */}
                                </>
                            ) : (
                                format(date.from, "PPP")
                            )
                        ) : (
                            <span className="flex items-center gap-x-2 " >{placeholder} <ChevronDown/> </span> // Show placeholder
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleSelect} // Use the new handler
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
