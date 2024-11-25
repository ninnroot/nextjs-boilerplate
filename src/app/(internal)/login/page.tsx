"use client";

import { makePostRequest } from "@/client-api/utils";
import AutoForm, { getObjectFormSchema } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/useToast";
import { loginSchema } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { add } from "date-fns";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { useForm } from "react-hook-form";
import * as z from "zod";

const LoginPage: React.FC = () => {
  const objectFormSchema = getObjectFormSchema(loginSchema);
  const form = useForm<z.infer<typeof objectFormSchema>>({
    resolver: zodResolver(loginSchema),
  });
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const getRedirectPath = () => {
    if (searchParams.get("next")) {
      if (searchParams.get("next") === "/") {
        return "/admin/members";
      }
      return searchParams.get("next")!;
    }
    return "/admin/members";
  };
  const redirect = () => {
    window.location.href = getRedirectPath();
  };
  const loginMuatation = useMutation({
    mutationKey: ["login"],
    mutationFn: (data: any) => makePostRequest("/login", data),
    onSuccess: (data) => {
      toast({
        description: "Login Success",
      });
      setCookie("access", data.data.access, {
        expires: add(new Date(), { hours: 2 }),
      });
      setCookie("account", data.data.user, {
        expires: add(new Date(), { hours: 2 }),
      });
      redirect();
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "Please enter valid credentials",
      });
    },
  });
  return (
    <Card className="min-w-96 min-h-96 ">
      <CardContent className="mt-3">
        <AutoForm
          onSubmit={(data) => loginMuatation.mutate(data)}
          formInstance={form}
          formSchema={objectFormSchema}
          fieldConfig={{
            password: {
              inputProps: {
                type: "password",
              },
            },
          }}
        >
          <Button isLoading={loginMuatation.isPending} type="submit">
            Login
          </Button>
        </AutoForm>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
