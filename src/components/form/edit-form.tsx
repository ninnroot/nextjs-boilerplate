"use client";
import * as z from "zod";
import AutoForm, {
  FieldConfig,
  getObjectFormSchema,
  ZodObjectOrWrapped,
} from "../ui/auto-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  makeGetRequest,
  makePostRequest,
  updateEntity,
} from "@/client-api/utils";
import { useEffect } from "react";
import { setFormErrrors } from "@/helpers/form";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import BreadCrumbHeader from "../nav/breadcrumb-header";
import { cn } from "@/lib/utils";
import { queryParamOptions } from "@/types/api";
import { queryParamDefault } from "@/config/defaults";
interface EditFormProps {
  schema: ZodObjectOrWrapped;
  entityCode: string;
  entityId: string;
  children?: React.ReactNode;
  className?: string;
  queryParameters?: queryParamOptions;
  fieldConfig?: FieldConfig<any>;
}

const EditFormPage: React.FC<EditFormProps> = ({
  schema,
  entityCode,
  entityId,
  children,
  className,
  queryParameters = queryParamDefault,
  fieldConfig,
}) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();
  const objectFormSchema = getObjectFormSchema(schema);
  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(schema),
  });
  const getEntity = useQuery({
    enabled: false,
    queryKey: [`get${entityCode}`, entityId, queryParameters],
    queryFn: () =>
      makeGetRequest(`/${entityCode}/${entityId}`, queryParameters),
  });

  const updateEntityMutation = useMutation({
    mutationKey: [`${entityCode}`, entityId],
    mutationFn: (data: any) => updateEntity(entityCode, entityId, data),
    onError: (e) => {
      setFormErrrors(e, form);
      toast({
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({});
      router.push(pathname.split("/").slice(0, -1).join("/"));
    },
  });
  useEffect(() => {
    if (getEntity.isSuccess && getEntity.data) {
      Object.keys(getEntity.data?.data.data).map((k) => {
        form.setValue(k, getEntity.data?.data.data[k]);
      });
    }
  }, [getEntity.data, getEntity.isSuccess]);
  useEffect(() => {
    getEntity.refetch();
  }, []);
  return (
    <div className="space-y-3">
      <BreadCrumbHeader></BreadCrumbHeader>
      <div className={cn("bg-background p-3 rounded-md", className)}>
        {!getEntity.isPending && (
          <AutoForm
            className="min-w-96"
            onSubmit={(data) => updateEntityMutation.mutate(data)}
            formInstance={form}
            formSchema={schema}
            fieldConfig={fieldConfig}
          >
            <Button isLoading={updateEntityMutation.isPending} type="submit">
              Submit
            </Button>
          </AutoForm>
        )}
        {children}
      </div>
    </div>
  );
};

export default EditFormPage;
