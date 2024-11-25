"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Toggle } from "./toggle";
import { Switch } from "./switch";
import { Label } from "./label";
import { Download, Filter } from "lucide-react";

type DataTableViewOptionsProps<TData> =
  | showSearchType<TData>
  | normalType<TData>;

type showSearchType<TData> = {
  table: Table<TData>;
  isAdvancedSearchEnabled: true;
  isColumnToggleEnabled: boolean;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isCsvExportable: boolean;
  onExport: () => void;
};
type normalType<TData> = {
  isAdvancedSearchEnabled: false;
  table: Table<TData>;
  isCsvExportable: boolean;
  onExport: () => void;
  isColumnToggleEnabled: boolean;
};

export function DataTableViewOptions<TData>({
  table,

  ...props
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex items-center justify-end">
      <div className="flex gap-3 items-center max-sm:hidden">
        
        {props.isAdvancedSearchEnabled && (
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={() => props.setIsExpanded(true)}
          >
            <Filter className="mr-2 h-4 w-4"></Filter>
            <span>Filter</span>
          </Button>
        )}

       {
        props.isColumnToggleEnabled && (
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant="outline" className="ml-auto lg:flex">
              <MixerHorizontalIcon className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[150px] overflow-y-auto max-h-[20rem]"
          >
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.columnDef.header?.toString()}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        )
       }
        {props.isCsvExportable && (
          <Button size={"sm"} onClick={props.onExport}>
            <Download className="mr-2 h-4 w-4"></Download>
            <span>Export</span>
          </Button>
        )}
      </div>
    </div>
  );
}
