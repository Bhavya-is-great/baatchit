import { handleRegister } from "@/controllers/user.controllers.js";
import wrapAsync from "@/utils/wrapAsync.util.js";

export const POST = wrapAsync(handleRegister)