"use client";

import BreadCrumbHeader from "@/components/nav/breadcrumb-header";
import AutoForm, {
  FieldConfig,
  getObjectFormSchema,
  ZodObjectOrWrapped,
} from "@/components/ui/auto-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { makePostRequest } from "@/client-api/utils";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { setFormErrrors } from "@/helpers/form";

interface CreateFormProps {
  schema: ZodObjectOrWrapped;
  entityCode: string;
  fieldConfig?: (form: UseFormReturn<any>) => FieldConfig<any>;
}

const CreateForm: React.FC<CreateFormProps> = ({
  schema,
  entityCode,
  fieldConfig,
}) => {
  const objectFormSchema = getObjectFormSchema(schema);
  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(schema),
  });
  const { toast } = useToast();
  const router = useRouter();
  const mutation = useMutation({
    mutationKey: ["create" + entityCode],
    mutationFn: (data: any) => makePostRequest(`/${entityCode}`, data),
    onSuccess: () => {
      toast({});
      router.push(`/admin/${entityCode}`);
    },
    onError: (e) => {
      toast({
        variant: "destructive",
      });
      setFormErrrors(e, form);
    },
  });

  return (
    <AutoForm
      onSubmit={(data) => mutation.mutate(data)}
      formInstance={form}
      formSchema={schema}
      fieldConfig={fieldConfig ? fieldConfig(form) : undefined}
    >
      <Button isLoading={mutation.isPending} type="submit">
        Submit
      </Button>
    </AutoForm>
  );
};

export default CreateForm;
