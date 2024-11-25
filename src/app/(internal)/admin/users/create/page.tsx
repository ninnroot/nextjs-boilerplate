"use client";

import BreadCrumbHeader from "@/components/nav/breadcrumb-header";
import { Button } from "@/components/ui/button";
import UserCreateForm from "@/forms/user-create-form";

const UserCreatePage = () => {
  return (
    <div>
      <BreadCrumbHeader title="Create User"></BreadCrumbHeader>

      <div className="p-3 bg-background rounded-md">
        <UserCreateForm></UserCreateForm>
      </div>
    </div>
  );
};

export default UserCreatePage;
