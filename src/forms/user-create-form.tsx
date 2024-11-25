"use client";

import { makePostRequest } from "@/client-api/utils";
import AutoForm, { getObjectFormSchema } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { setFormErrrors } from "@/helpers/form";
import { useToast } from "@/hooks/useToast";
import { userCreateSchema, UserRole } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
const UserCreateForm = () => {
  const objectFormSchema = getObjectFormSchema(userCreateSchema);
  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(userCreateSchema),
  });
  const router = useRouter();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (data: any) => makePostRequest("/users", data),
    onSuccess: () => {
      toast({
        description: "user successfully created",
      });
      router.push("/admin/users");
    },
    onError: (e) => {
      toast({
        variant: "destructive",
      });
      setFormErrrors(e, form);
    },
  });
  return (
    <div>
      <AutoForm
        formInstance={form}
        formSchema={userCreateSchema}
        onSubmit={(data: any) => {
          data.role = UserRole.admin
          mutation.mutate(data)
        }}
      >
        <Button isLoading={mutation.isPending} type="submit">
          Submit
        </Button>
      </AutoForm>
    </div>
  );
};

export default UserCreateForm;
