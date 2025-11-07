import { handleStatus } from "@/controllers/user.controllers";
import wrapAsync from "@/utils/wrapAsync.util";

export const GET = wrapAsync(handleStatus)