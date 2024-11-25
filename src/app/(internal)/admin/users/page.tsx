import ListEntityPage from "@/components/datatable/list-entity-page";
import BreadCrumbHeader from "@/components/nav/breadcrumb-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { operatorEnum } from "@/types/api";
import { UserRole } from "@/types/user";
import Link from "next/link";

const UserListPage = () => {
  return (
    <ListEntityPage
      entity="users"
      baseDetailsPath={"/admin/users"}
      getDataFilterParams={{
        filter_params: [
          {
            field_name: "role",
            operator: operatorEnum.exact,
            value: UserRole.admin,
          },
        ],
      }}
      uid="users-list"
    ></ListEntityPage>
  );
};

export default UserListPage;
