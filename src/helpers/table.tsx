import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const getSortableHeader = (headerName: string, column: Column<any>) => {
  return (
    <Button
      variant={"ghost"}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {headerName}
      <ArrowUpDown className="ml-2 h-4 w-4"></ArrowUpDown>
    </Button>
  );
};
