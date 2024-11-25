import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";

export type entityType = {
  id: string | number;
};

interface IMultiSelectPopOverProps {
  entities: entityType[];
  selectedEntities: entityType[];
  setSelectedEntities: React.Dispatch<React.SetStateAction<entityType[]>>;
  displayFunction: (e: any) => string;
  label?: string;
  isAllSelectedDefault?: boolean;
  isSingle?: boolean;
}

const MultiSelectPopOver: React.FC<IMultiSelectPopOverProps> = ({
  entities,
  selectedEntities,
  setSelectedEntities,
  displayFunction,
  label = "Open",
  isAllSelectedDefault = true,
  isSingle = false,
}) => {
  const [isAllSelected, setIsAllSelected] = useState(isAllSelectedDefault);
  const onCheckHandler = (isChecked: boolean, e: entityType) => {
    if (isChecked) {
      setSelectedEntities([
        ...selectedEntities.filter((c) => c.id !== e.id),
        e,
      ]);
    } else {
      setSelectedEntities([...selectedEntities.filter((c) => c.id !== e.id)]);
    }
  };
  useEffect(() => {
    if (isAllSelected) {
      setSelectedEntities(entities);
    } else {
      setSelectedEntities([]);
    }
  }, [isAllSelected]);
  return (
    <>
      <DropdownMenu modal>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {isSingle
              ? displayFunction(selectedEntities[0]) || label
              : `${label} (${selectedEntities?.length})`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56  overflow-y-auto max-h-[10rem]"
          align="start"
        >
          {!entities?.length ? (
            <p className=" text-center">No data</p>
          ) : (
            <>
              <DropdownMenuCheckboxItem
                checked={isAllSelected}
                onCheckedChange={(c) => setIsAllSelected(c)}
              >
                Select all
              </DropdownMenuCheckboxItem>

              {entities?.map((e) => (
                <DropdownMenuCheckboxItem
                  key={e.id}
                  checked={selectedEntities?.map((e) => e.id).includes(e.id)}
                  onCheckedChange={(c) => onCheckHandler(c, e)}
                >
                  {displayFunction(e)}
                </DropdownMenuCheckboxItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MultiSelectPopOver;
