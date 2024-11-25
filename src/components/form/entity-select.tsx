"use client";

import { filterParamsBody, queryParamOptions } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormDescription } from "../ui/form";
import { Loader } from "./loader";
import { searchEntities } from "@/client-api/utils";
interface IEntitySelectProps {
  displayFunction: (entity: any) => string;
  entity: string;
  value: number;
  onChange: (v: number) => void;
  label: string;
  isRequired: boolean;
  formDescription?: string;
  disabled?: boolean;
  filterParams?: filterParamsBody;
  queryParams?: queryParamOptions;
}

const EntitySelect: React.FC<IEntitySelectProps> = ({
  displayFunction,
  entity,
  value,
  onChange,
  label,
  isRequired,
  formDescription,
  disabled = false,
  filterParams = { filter_params: [], exclude_params: [] },
  queryParams,
}) => {
  const getAllEntities = useQuery({
    queryKey: ["getAllEntities", entity, filterParams],
    queryFn: () => {
      return searchEntities(
        entity,
        {
          ...queryParams,
          size: -1,
          fields: queryParams?.fields || undefined,
        },
        filterParams
      );
    },
  });
  return (
    <div className="space-y-3">
      <Label>
        {label} {isRequired && <span className=" text-destructive">*</span>}
      </Label>
      <Select
        value={String(value)}
        onValueChange={(v) => onChange(Number(v))}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={`Select`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className=" capitalize">{entity}</SelectLabel>
            {getAllEntities.isLoading && (
              <SelectItem value={"loading"} disabled>
                <div className="flex justify-center items-center gap-3">
                  <Loader></Loader> <p>Loading...</p>
                </div>
              </SelectItem>
            )}
            {getAllEntities.data?.data.data.map((c: any) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {displayFunction(c)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {formDescription && <FormDescription>{formDescription}</FormDescription>}
    </div>
  );
};

export default EntitySelect;
