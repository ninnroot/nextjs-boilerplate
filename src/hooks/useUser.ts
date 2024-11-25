import { axiosClient } from "@/lib/api";
import { userSchema } from "@/types/user";

import { getCookie, setCookie } from "cookies-next";
import { add } from "date-fns";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as z from "zod";
export const useUser = () => {
  const [user, setUser] = useState<z.infer<typeof userSchema>>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          if (getCookie("account")) {
            setUser(JSON.parse(getCookie("account") || "{}"));
          } else {
            router.push(`/login?${new URLSearchParams({ next: pathname })}`);

          }
        }
      } catch (e) {
        router.push(`/login?${new URLSearchParams({ next: pathname })}`);
        return null;
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return {
    user,
    setUser: (data: Partial<z.infer<typeof userSchema>>) => {
      // @ts-ignore
      setUser({ ...user, ...data });
      setCookie("account", JSON.stringify(data), {
        expires: add(new Date(), { hours: 2 }),
      });
    },
  };
};
