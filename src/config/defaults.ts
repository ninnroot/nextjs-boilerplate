import { queryParamOptions } from "@/types/api";
import * as z from "zod";

export const DEFAULT_FIRST_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 10;
const queryParamDefault: queryParamOptions = {
  page: DEFAULT_FIRST_PAGE_INDEX + 1,
  size: DEFAULT_PAGE_SIZE,
  sorts: ["id"],
  csv: false,
  group_by: "all",
  range_group_by: "day",
};

export { queryParamDefault };
