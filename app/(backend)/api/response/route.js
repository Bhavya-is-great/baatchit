import wrapAsync from "@/utils/wrapAsync.util";
import giveResponse from "@/controllers/response.controllers";

export const POST = wrapAsync(giveResponse);