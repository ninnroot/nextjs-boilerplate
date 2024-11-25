"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  SortingState,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  PaginationState,
  RowModel,
  Row,
  Table as tbType,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { ArrowRightCircle, ArrowUpDown, SortAsc, SortDesc } from "lucide-react";
import Link from "next/link";
import { filterParamsBody, operatorEnum, queryParamOptions } from "@/types/api";

import {
  DEFAULT_FIRST_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  queryParamDefault,
} from "@/config/defaults";
import { useQuery } from "@tanstack/react-query";
import { makePostRequest, searchEntities } from "@/client-api/utils";

import { customColumnDef, getColumnDefs } from "@/config/column-defs";

import { usePathname, useRouter } from "next/navigation";
import { Input } from "./input";
import DataTableSearch from "./data-table-search";
import { Separator } from "./separator";
import { getDateISOString } from "@/helpers/date";
import { downloadCsv } from "@/helpers/file";
import { listToApiArray } from "@/helpers/filter-params";
import { entityType } from "../form/multi-select-popover";

import { Loader } from "../form/loader";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import { Toggle } from "./toggle";
import { Switch } from "./switch";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

import { cn } from "@/lib/utils";

export interface DataTableProps<TData, TValue> {
  entity: string;
  queryParams?: queryParamOptions;
  // Filter params when getting the rows on initial table load
  getDataFilterParams?: filterParamsBody;
  // Filter params to populate respective select fields
  selectFieldsParams?: { [key in string]: filterParamsBody };
  //** base path for the action button to navigate to */
  baseDetailsPath: string | ((entityId: string | number) => string);
  hideActionColumn?: boolean;
  //** a unique id for invaliding caches */
  uid: string;
  columns?: customColumnDef<TData, TValue>[];
  isAdvancedSearchEnabled?: boolean;
  isCsvExportable?: boolean;
  pageSize?: number;
  additionalSearchFields?: React.ReactNode[];
  isSelectionIncluded?: boolean;
  onRowsSelect?: (table: tbType<any>) => void;
  isCustomBaseUrl?: boolean;
  baseApiUrl?: string;
  defaultViewMode?: "table" | "card";
  isViewModeEditable?: boolean;
  cardRenderFunction?: (row: Row<any>) => React.ReactNode;
  actionButtonRender?: (row: Row<any>) => React.ReactNode;
  selectCheckboxDisabled?: (row: Row<any>) => boolean;
  customComponentOnTable?: (table: tbType<any>) => React.ReactNode;
  isColumnToggleEnabled?: boolean;
  selectBtnText?: string;
  isSelectButtonLoading?: boolean;
  isSortingEnabled?: boolean;
  defaultSearchField?: customColumnDef<any, any>;
  // Function to get the id of the row (for action button href)
  getIdFn?: (row: Row<any>) => string;
}

export function DataTable<TData, TValue>({
  baseDetailsPath,
  entity,
  queryParams = queryParamDefault,
  getDataFilterParams: filterParams = {},
  hideActionColumn = false,
  uid,
  columns,
  isAdvancedSearchEnabled = true,
  isCsvExportable = true,
  pageSize = DEFAULT_PAGE_SIZE,
  selectFieldsParams,
  additionalSearchFields = [],
  isSelectionIncluded = false,
  onRowsSelect,
  isCustomBaseUrl = false,
  baseApiUrl,
  isViewModeEditable = false,
  cardRenderFunction,
  actionButtonRender,
  defaultViewMode = "table",
  selectCheckboxDisabled,
  customComponentOnTable,
  isColumnToggleEnabled = true,
  selectBtnText = "Select",
  isSelectButtonLoading = false,
  isSortingEnabled = false,
  defaultSearchField,
  getIdFn,
}: DataTableProps<TData, TValue>) {
  const [viewMode, setViewMode] = React.useState<"table" | "card">(
    isViewModeEditable ? defaultViewMode : "table"
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageSize: pageSize,
    pageIndex: DEFAULT_FIRST_PAGE_INDEX,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  const [searchParams, setSearchParams] = React.useState<filterParamsBody>({
    filter_params: [],
    exclude_params: [],
  });
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);

  const pathname = usePathname();

  const { data, refetch, isLoading, isFetching } = useQuery({
    refetchOnMount: true,
    queryKey: [
      `search${entity}`,
      uid,
      pagination,
      searchParams,
      filterParams,
      queryParams,
      sorting,
    ],
    queryFn: () =>
      isCustomBaseUrl
        ? makePostRequest(
            baseApiUrl!,
            {
              filter_params: [
                ...(searchParams.filter_params || []),
                ...(filterParams.filter_params || []),
              ],
              exclude_params: [
                ...(searchParams.exclude_params || []),
                ...(filterParams.exclude_params || []),
              ],
            },
            {
              sorts: queryParams.sorts,
              expand: queryParams.expand,
              page: pagination.pageIndex + 1,
              size: pagination.pageSize,
              group_by: queryParams.group_by,
              fields: queryParams.fields,
            }
          )
        : searchEntities(
            entity,
            {
              sorts: queryParams.sorts,
              expand: queryParams.expand,
              page: pagination.pageIndex + 1,
              size: pagination.pageSize,
              group_by: queryParams.group_by,
              fields: queryParams.fields,
            },
            {
              filter_params: [
                ...(searchParams.filter_params || []),
                ...(filterParams.filter_params || []),
              ],
              exclude_params: [
                ...(searchParams.exclude_params || []),
                ...(filterParams.exclude_params || []),
              ],
            }
          ),
    enabled: true,
  });

  const getColumns = () => {
    let c: customColumnDef<any, any>[] = [];

    c = c.concat(columns || getColumnDefs(entity));

    if (isSelectionIncluded) {
      c.push({
        id: "select",
        header: ({ table }) =>
          selectCheckboxDisabled ? (
            <p>Select</p>
          ) : (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
              aria-label="Select all"
            />
          ),
        cell: ({ row }) => (
          <Checkbox
            className=" mr-3"
            disabled={
              selectCheckboxDisabled ? selectCheckboxDisabled(row) : undefined
            }
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }
    return c;
  };

  const table = useReactTable({
    columns: getColumns(),
    data: data ? data.data.data : [],
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
      rowSelection,
      // columnVisibility: getVisibilityState(),
    },
    manualPagination: true,
    pageCount: data ? data.data.total_pages : -1,
    onPaginationChange: setPagination,
  });

  const searchTable = (data: any) => {
    const tempSearchParams: filterParamsBody = {
      filter_params: [],
      exclude_params: [],
    };

    getColumns().map((c) => {
      if (data[c.accessorKey!]) {
        if (c.dataType === "date" && data[c.accessorKey!].date) {
          if (data[c.accessorKey!].operator === "between") {
            tempSearchParams.exclude_params?.push({
              field_name: c.accessorKey!,
              operator: operatorEnum.lt,
              value: getDateISOString(data[c.accessorKey!].date.from),
            });
            tempSearchParams.exclude_params?.push({
              field_name: c.accessorKey!,
              operator: operatorEnum.gt,
              value: getDateISOString(data[c.accessorKey!].date.to),
            });
          } else {
            tempSearchParams.filter_params?.push({
              operator: data[c.accessorKey!].operator || operatorEnum.gt,
              value: getDateISOString(data[c.accessorKey!].date),
              field_name: c.accessorKey!,
            });
          }
        } else if (c.dataType === "muli-select") {
          tempSearchParams.filter_params?.push({
            field_name: c.accessorKey!,
            operator: operatorEnum.in,
            value:
              data[c.accessorKey!].map((i: entityType) => i.id).toString() ||
              "0",
          });
        } else {
          tempSearchParams.filter_params?.push({
            operator: operatorEnum.icontains,
            value: data[c.accessorKey!],
            field_name: c.accessorKey!,
          });
        }
      }
    });
    setSearchParams(tempSearchParams);
  };

  const {
    refetch: getCsvFile,
    data: csvData,
    isSuccess: isCsvQuerySuccess,
  } = useQuery({
    queryKey: ["downloadCsv", uid, entity],
    enabled: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    queryFn: () =>
      searchEntities(
        entity,
        {
          sorts: [
            ...(queryParams.sorts || []),
            ...sorting.map((s) => (s.desc ? `-${s.id}` : s.id)),
          ],
          expand: queryParams.expand,
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
          csv: true,
          fields: table
            .getAllColumns()
            .filter((c) => c.getIsVisible())
            .map((c) => c.id),
        },
        {
          filter_params: [
            ...(searchParams.filter_params || []),
            ...(filterParams.filter_params || []),
          ],
          exclude_params: [
            ...(searchParams.exclude_params || []),
            ...(filterParams.exclude_params || []),
          ],
        }
      ),
  });
  const exportCsv = () => {
    getCsvFile();
  };
  React.useEffect(() => {
    if (isCsvQuerySuccess && csvData?.data) {
      downloadCsv(csvData.data, `${entity}.csv`);
    }
  }, [csvData, isCsvQuerySuccess]);

  return (
    <div className="space-y-3">
      {customComponentOnTable && customComponentOnTable(table)}
      <div className="flex justify-between items-end">
        <div className="flex justify-between gap-3 items-end">
          <div className="flex items-end gap-3">
            <DataTableSearch
              defaultSearchField={defaultSearchField}
              additionalSearchFields={additionalSearchFields}
              setIsExpanded={setIsSearchExpanded}
              selectFieldsParams={selectFieldsParams}
              isExpanded={isSearchExpanded}
              filterParams={searchParams}
              setFilterParams={setSearchParams}
              onSubmit={searchTable}
              // @ts-ignore
              searchFields={getColumnDefs(entity)?.filter(
                (c) => !c.isSearchDisabled
              )}
            ></DataTableSearch>
            {isSelectionIncluded && (
              <Button
                isLoading={isSelectButtonLoading || isLoading || isFetching}
                disabled={
                  !(
                    table.getIsAllRowsSelected() ||
                    table.getIsSomeRowsSelected()
                  )
                }
                onClick={() => {
                  onRowsSelect!(table);
                }}
              >
                {selectBtnText}
              </Button>
            )}
          </div>

          {isViewModeEditable && (
            <div className="space-y-1 max-sm:hidden">
              <Label>View Mode</Label>
              <Select
                value={viewMode}
                onValueChange={(v) => setViewMode(v as "table" | "card")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="View Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DataTableViewOptions
          isColumnToggleEnabled={isColumnToggleEnabled}
          isAdvancedSearchEnabled={isAdvancedSearchEnabled}
          isExpanded={isSearchExpanded}
          isCsvExportable={isCsvExportable}
          onExport={exportCsv}
          setIsExpanded={setIsSearchExpanded}
          table={table}
        ></DataTableViewOptions>
      </div>

      {viewMode === "table" && (
        <div className="rounded-md border">
          <Table >
            <TableHeader className="bg-primary">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {!hideActionColumn && (
                    <TableHead key={headerGroup.id + "-action"}>
                      Action
                    </TableHead>
                  )}
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="text-primary-foreground"
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {isSortingEnabled &&
                              header.column.id !== "select" && (
                                <Button
                                  size={"icon"}
                                  variant={"ghost"}
                                  onClick={() => {
                                    header.column.toggleSorting(
                                      header.column.getIsSorted() === "asc"
                                    );
                                    refetch();
                                  }}
                                >
                                  {header.column.getIsSorted() === "asc" ? (
                                    <SortAsc></SortAsc>
                                  ) : header.column.getIsSorted() === "desc" ? (
                                    <SortDesc></SortDesc>
                                  ) : (
                                    <ArrowUpDown></ArrowUpDown>
                                  )}
                                </Button>
                              )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className=" even:bg-primary/10"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {!hideActionColumn && (
                      <TableCell key={`${row.id}-action`}>
                        {actionButtonRender ? (
                          actionButtonRender(row)
                        ) : (
                          <Link
                            href={
                              typeof baseDetailsPath === "string" ||
                              baseDetailsPath instanceof String
                                ? `${baseDetailsPath}/${
                                    getIdFn ? getIdFn(row) : row.getValue("id")
                                  }?ref=${encodeURIComponent(pathname)}`
                                : baseDetailsPath(
                                    getIdFn ? getIdFn(row) : row.getValue("id")
                                  )
                            }
                          >
                            <ArrowRightCircle className="hover:text-primary/90"></ArrowRightCircle>
                          </Link>
                        )}
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.options.columns.length + 1}
                    className="h-24 "
                  >
                    <div className=" flex justify-center items-center">
                      {(isLoading || isFetching) && <Loader></Loader>}
                      <p>
                        {isLoading || isFetching
                          ? "Loading ..."
                          : "No results."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <DataTablePagination
        totalCount={data?.data.count}
        table={table}
      ></DataTablePagination>
    </div>
  );
}
