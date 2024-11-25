"use client";

import BreadCrumbHeader from "../nav/breadcrumb-header";
import { DataTable, DataTableProps } from "../ui/data-table";

interface ListEntityPageProps extends DataTableProps<any, any> {}

const ListEntityPage: React.FC<ListEntityPageProps> = (props) => {
  return (
    <div className="space-y-3">
      <BreadCrumbHeader></BreadCrumbHeader>
      <div className="p-3 bg-background rounded-md">
        <DataTable {...props}></DataTable>
      </div>
    </div>
  );
};

export default ListEntityPage