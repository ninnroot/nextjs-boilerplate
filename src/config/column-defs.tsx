import MultiSelectPopOver, {
  entityType,
} from "@/components/form/multi-select-popover";
import { formatDate, formatDateTime, formatTime } from "@/helpers/date";

import { getSortableHeader } from "@/helpers/table";
import { cn } from "@/lib/utils";
import { filterParamsBody } from "@/types/api";
import { ColumnDef } from "@tanstack/react-table";

export const getColumnDefs = (entityName: string) => {
  return columnDefMapper[entityName];
};

export type columnDataType =
  | "date"
  | "string"
  | "number"
  | "select"
  | "muli-select";

export type customColumnDef<T, G> = ColumnDef<T, G> & {
  dataType?: columnDataType;
  accessorKey?: string;
  searchField?: (
    uid: string,
    entities: entityType[],
    setEntity: (entities: entityType[]) => void,
    filterParams?: filterParamsBody
  ) => React.ReactNode;
  isSearchDisabled?: boolean;
  isDefaultVisible?: boolean;
  defaultValue?: any;
  isDefaultSearchField?: boolean;
};

export const columnDefMapper: { [key: string]: customColumnDef<any, any>[] } = {
  users: [
    { accessorKey: "id", header: "ID", dataType: "number" },
    { accessorKey: "name", header: "Name", isDefaultSearchField: true },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
  ],
};
