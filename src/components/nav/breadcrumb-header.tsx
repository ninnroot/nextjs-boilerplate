"use client";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface BreadCrumbHeaderProps {
  paths?: { href: string; name: string }[];
  title?: string;
  showCreateButton?: boolean
  showEditButton?: boolean
}

const BreadCrumbHeader: React.FC<BreadCrumbHeaderProps> = ({
  paths,
  title,
  showCreateButton = true,
  showEditButton = true
}) => {
  const { id } = useParams();
  const [items, setItems] = useState<{ href: string; name: string }[]>(
    paths || []
  );
  const pathname = usePathname();
  const getBackLink = () => {
    const p = pathname.split("/");
    if (p.length >= 4 && !pathname.endsWith("edit")) {
      return p
        .filter((_, index) => index !== 4)
        .slice(0, -1)
        .join("/");
    }
    return p.slice(0, -1).join("/");
  };
  useEffect(() => {
    if (!paths) {
      let p: any = pathname
        .split("/")
        .map((path, index) => {
          return {
            href: pathname
              .split("/")
              .slice(0, index + 1)
              .join("/"),
            name: path,
          };
        })
        .slice(2);

      if (p.length >= 4) {
        setItems(p.filter((_: any, index: any) => index !== 2));
      } else {
        setItems(p);
      }
    }
  }, [paths]);
  return (
    <div className="flex gap-3 items-center bg-background p-3 rounded-md">
      <Link href={getBackLink()}>
        <Button
          size={"icon"}
          className=" rounded-full bg-mta-yellow text-mta-yellow-foreground"
        >
          <ChevronLeft></ChevronLeft>
        </Button>
      </Link>
      <div className="w-full">
        <div className="flex justify-between w-full ">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {items.map((path, index) => {
                return (
                  <>
                    <BreadcrumbItem className="capitalize" key={index}>
                      <BreadcrumbLink href={path.href}>
                        {path.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index !== items.length - 1 && <BreadcrumbSeparator />}
                  </>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          {!id && showCreateButton&&
            !pathname.endsWith("edit") &&
            !pathname.endsWith("create") && (
              <Link href={`${pathname}/create`}>
                <Button>Create</Button>
              </Link>
            )}
          {id && showEditButton && !pathname.endsWith("edit") && (
            <Link href={`${pathname}/edit`}>
              <Button>Edit</Button>
            </Link>
          )}
        </div>
        {title && <p className="font-bold text-3xl">{title}</p>}
      </div>
    </div>
  );
};

export default BreadCrumbHeader;
