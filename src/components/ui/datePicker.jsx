"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({ setTasksDetails, tasksDetails }) {
  const [date, setDate] = React.useState(tasksDetails?.expiryDate);

  React.useEffect(() => {
    if (date) {
      setTasksDetails((prev) => ({
        ...prev,
        expiryDate: date,
      }));
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full md:w-[280px] justify-start text-left font-normal border-gray-500",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Expiry Date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          onSelect={setDate}
          initialFocus
          selected={date}
        />
      </PopoverContent>
    </Popover>
  );
}
