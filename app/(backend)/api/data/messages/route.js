import wrapAsync from "@/utils/wrapAsync.util";
import {
    getMessages,
    setMessages
} from '@/controllers/data.controllers';

export const POST = wrapAsync(setMessages);
export const GET = wrapAsync(getMessages);