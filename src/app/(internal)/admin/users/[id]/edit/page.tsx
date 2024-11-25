"use client";

import { makeGetRequest } from "@/client-api/utils";
import EditFormPage from "@/components/form/edit-form";
import AutoForm, { getObjectFormSchema } from "@/components/ui/auto-form";
import { useToast } from "@/hooks/useToast";
import { userEditSchema } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import * as z from "zod";

const UserEditPage = () => {
  const { id } = useParams();
  return (
    <EditFormPage
      entityId={id as string}
      schema={userEditSchema}
      entityCode="users"
    ></EditFormPage>
  );
};
export default UserEditPage;
