"use client";
import { makeGetRequest } from "@/client-api/utils";
// import DashboardItem from "@/components/dashboard/dashboard-item";
import BreadCrumbHeader from "@/components/nav/breadcrumb-header";
import { DataTable } from "@/components/ui/data-table";
import { operatorEnum } from "@/types/api";
import { UserRole } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

const UserListPage = () => {
  const { data, isPending } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => {
      return makeGetRequest("/dashboard");
    },
  });
  return (
    <div className="space-y-3">
      {/* <BreadCrumbHeader
        paths={[
          {
            href: "/admin",
            name: "Dashboard",
          },
        ]}
        showCreateButton={false}
      ></BreadCrumbHeader>
      <div className=" grid grid-cols-2 max-sm:grid-cols-1 gap-3">
        {!isPending && (
          <>
            <DashboardItem
              title="Total Admins"
              count={data?.data.data.admin_count}
              link="/admin/users"
            ></DashboardItem>
            <DashboardItem
              title="Total Members"
              count={data?.data.data.member_count}
              link="/admin/members"
            ></DashboardItem>
            <DashboardItem
              title="Total Collective Marks"
              count={data?.data.data.collective_mark_count}
              link="/admin/collective-marks"
            ></DashboardItem>
            <DashboardItem
              title="Total Products"
              count={data?.data.data.product_count}
              link="/admin/mta-products"
            ></DashboardItem>
          </>
        )}
      </div> */}
    </div>
  );
};

export default UserListPage;
