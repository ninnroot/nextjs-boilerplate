"use client";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      retry: 3,

      // onError: (error: any) => {
      //   if (error.response.status === 404) {
      //     window.location.replace(
      //       "/notfound?" +
      //         new URLSearchParams({ next: window.location.pathname }).toString()
      //     );
      //   }
      // },
    },
  },
});

export { queryClient };
