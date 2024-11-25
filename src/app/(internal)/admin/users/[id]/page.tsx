"use client";
import { makeGetRequest } from "@/client-api/utils";
import BreadCrumbHeader from "@/components/nav/breadcrumb-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const UserDetailsPage = () => {
  const { id } = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["getUser", id],
    queryFn: () => makeGetRequest(`/users/${id}`),
  });
  const pathname = usePathname();
  return (
    <div className="space-y-3">
      <BreadCrumbHeader title="Admin Details"></BreadCrumbHeader>

      <div className="bg-background p-3 rounded-md">
        {!isPending && (
          <>
            <p>
              <span className="font-bold">Email:</span> {data?.data.data.email}
            </p>
            <p>
              <span className="font-bold">Name:</span> {data?.data.data.name}
            </p>
            <p>
              <span className="font-bold">Phone Number:</span>{" "}
              {data?.data.data.phone_number}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDetailsPage;
