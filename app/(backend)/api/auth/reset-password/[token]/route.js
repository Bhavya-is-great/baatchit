import { handleResetPassword } from "@/controllers/user.controllers";
import wrapAsync from "@/utils/wrapAsync.util";

export const POST = wrapAsync(handleResetPassword);