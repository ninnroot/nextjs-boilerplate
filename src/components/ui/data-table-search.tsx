import { filterParamsBody } from "@/types/api";

import React, { useEffect } from "react";
import { Input } from "./input";
import { columnDataType, customColumnDef } from "@/config/column-defs";

import { Button } from "./button";
import { Switch } from "./switch";
import { useForm } from "react-hook-form";
import DateSearch from "../datatable/date-search";
import { Search, XCircle } from "lucide-react";
import { Label } from "./label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface IDataTableSearchProps {
  filterParams: filterParamsBody;
  setFilterParams: React.Dispatch<React.SetStateAction<filterParamsBody>>;
  searchFields: customColumnDef<any, any>[];
  onSubmit: (data: any) => void;
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  selectFieldsParams?: { [key in string]: filterParamsBody };
  additionalSearchFields?: React.ReactNode[];
  defaultSearchField?: customColumnDef<any, any>;
}

const DataTableSearch: React.FC<IDataTableSearchProps> = ({
  filterParams,
  setFilterParams,
  searchFields,
  isExpanded,
  setIsExpanded,
  onSubmit,
  selectFieldsParams,
  additionalSearchFields = [],
  defaultSearchField 
}) => {
  const form = useForm();
  // need to watch for re-render
  // https://stackoverflow.com/questions/77069761/react-updating-react-hook-form-via-react-day-picker-doesnt-rerender-component
  form.watch([...searchFields.map((f) => f.accessorKey!) ]);

  const getDefaultSearchFields = () => {
    if (defaultSearchField){
      return [defaultSearchField];
    }
    if (searchFields.length > 0) {
      if (searchFields.length === 1) {
        return [searchFields[0]];
      } else if (searchFields[0].accessorKey!=="id") {
        return [searchFields[0]]
      }
      return [searchFields[1]];
    }
    return [];
  };

  const renderField = (field: customColumnDef<any, any>) => {
    // @ts-ignore
    if (!field.accessorKey) {
      return <></>;
    }
    if (field.searchField) {
      if (!form.getValues()[field.accessorKey!]) {
        form.setValue(field.accessorKey!, []);
      }

      return (
        <div className="flex flex-col gap-2  items-start">
          <Label>Search by {field.header?.toString()}</Label>
          {selectFieldsParams
            ? field.searchField(
                "search" + field.accessorKey,
                form.getValues()[field.accessorKey!],
                (v) => {
                  form.setValue(field.accessorKey!, v);
                },
                selectFieldsParams[field.accessorKey!]
              )
            : field.searchField(
                "search" + field.accessorKey,
                form.getValues()[field.accessorKey!],
                (v) => {
                  form.setValue(field.accessorKey!, v);
                }
              )}
        </div>
      );
    }
    if (field.dataType) {
      if (field.dataType === "date") {
        return (
          <div className="flex flex-col gap-2 items-start">
            <Label>Search by {field.header?.toString()}</Label>
            <DateSearch
              //@ts-ignore
              {...form.register(field.accessorKey)}
              value={
                //@ts-ignore
                form.getValues()[field.accessorKey] || {
                  operator: "gt",
                  date: undefined,
                }
              }
              onChange={(v) => {
                // @ts-ignore
                form.setValue(field.accessorKey, {
                  // @ts-ignore
                  operator: form.getValues()[field.accessorKey]?.operator,
                  date: v,
                });
              }}
              operatorOnchange={(o) => {
                if (o === "between") {
                  // @ts-ignore
                  form.setValue(field.accessorKey, {
                    date: {
                      from:
                        // @ts-ignore
                        form.getValues()[field.accessorKey]?.date || undefined,
                      to: undefined,
                    },
                    operator: o,
                  });
                } else {
                  // @ts-ignore
                  form.setValue(field.accessorKey, {
                    date:
                      // @ts-ignore
                      form.getValues()[field.accessorKey]?.date?.from ||
                      undefined,
                    operator: o,
                  });
                }
              }}
            ></DateSearch>
          </div>
        );
      }
    }
    return (
      <div className="flex flex-col gap-2 ">
        <Label>Search by {field.header?.toString()}</Label>
        <Input
          // @ts-ignore
          key={field.accessorKey}
          className="sm:w-auto max-w-[12rem]"
          // @ts-ignore
          {...form.register(field.accessorKey)}
          type={field.dataType}
        ></Input>
      </div>
    );
  };

  return (
    <>
      <div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between">
            <div className="flex flex-wrap gap-3 items-start">
              {getDefaultSearchFields().map((f) => renderField(f))}
              {additionalSearchFields.map((f) => f)}

              <Sheet open={isExpanded} onOpenChange={setIsExpanded}>
                <SheetContent className="flex flex-col overflow-y-auto">
                  {isExpanded && searchFields.map((f) => renderField(f))}
                  <div className="flex flex-col gap-3">
                    <Button
                      size={"sm"}
                      type="submit"
                      onClick={() => onSubmit(form.getValues())}
                    >
                      <Search className="mr-2 h-4 w-4"></Search>
                      <span>Search</span>
                    </Button>
                    <Button
                      size={"sm"}
                      onClick={() => {
                        let resetVal = form.getValues();
                        Object.keys(resetVal).map((k) => {
                          resetVal[k] = null;
                        });
                        form.reset(resetVal);
                      }}
                      type="button"
                      variant={"outline"}
                    >
                      <XCircle className="mr-2 h-4 w-4"></XCircle>
                      Clear
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default DataTableSearch;
