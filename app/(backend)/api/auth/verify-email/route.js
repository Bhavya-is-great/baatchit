import { handleVerifyEmail } from "@/controllers/user.controllers";
import wrapAsync from "@/utils/wrapAsync.util.js";

export const POST = wrapAsync(handleVerifyEmail)