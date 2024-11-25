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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { operatorEnum } from "@/types/api";

interface IDateSearchProps {
  name: string;
  onChange: (value: any) => void;
  value: {
    date: (Date | undefined) | { from: Date | undefined; to: Date | undefined };
    operator: "between" | "lt" | "gt";
  };
  operatorOnchange: (operator: any) => void;
}
const DateSearch: React.FC<IDateSearchProps> = ({
  onChange,
  value,
  name,
  operatorOnchange,
}) => {


  return (
    <>
      <div className="sm:w-auto w-72 flex items-center gap-2 p-2 border rounded">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                " w-44 justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value.date ? (
                value.operator === "between" ? (
                  // @ts-ignore
                  value.date.from &&
                  // @ts-ignore
                  value.date.to ? (
                    // @ts-ignore
                    `${format(value.date.from, "dd-MM-yyyy")} - ${format(
                      // @ts-ignore
                      value.date.to,
                      "dd-MM-yyyy"
                    )}`
                  ) : (
                    <span>Pick a range</span>
                  )
                ) : (
                  // @ts-ignore
                  format(value.date, "LLL d yyyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            {/* @ts-ignore */}
            <Calendar
              mode={value.operator === "between" ? "range" : "single"}
              onSelect={onChange}
              selected={value.date}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Select
          defaultValue={operatorEnum.gt}
          value={value.operator}
          onValueChange={(v) => operatorOnchange(v)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Operators</SelectLabel>
              <SelectItem value={operatorEnum.gt}>Greater than</SelectItem>
              <SelectItem value={operatorEnum.lt}>Less than</SelectItem>
              <SelectItem value={"between"}>Between (inclusive)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default DateSearch;
