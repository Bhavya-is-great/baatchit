import User from "@/models/user.model";
import Conversation from "@/models/conversation.model";
import Messages from "@/models/messages.model";
import { cookies } from "next/headers";
import { decodeJWT } from "@/utils/generateJWT.utils";
import { NextResponse } from "next/server";
import ExpressError from "@/utils/ExpressError.util";

/* -----------------------------------------------------------
   🔐 Decode JWT and get user
----------------------------------------------------------- */
async function decodingUser() {
  const cookieStore = await cookies();
  const tokenrec = cookieStore.get("token");

  if (!tokenrec || !tokenrec.value) {
    throw new ExpressError(401, "Unauthorized: Token missing");
  }

  const decodedJwt = decodeJWT(tokenrec.value);
  if (!decodedJwt || !decodedJwt._id) {
    throw new ExpressError(401, "Unauthorized: Invalid token");
  }

  const user = await User.findOne({ _id: decodedJwt._id });
  if (!user) {
    throw new ExpressError(404, "User not found");
  }

  return user;
}

/* -----------------------------------------------------------
   🧩 GET /api/conversations → all conversations for user
----------------------------------------------------------- */
export async function getConversation(req) {
  const user = await decodingUser();

  const conversations = await Conversation.find({ user_id: user._id }).sort({
    createdAt: -1,
  });

  if (!conversations || conversations.length === 0) {
    throw new ExpressError(404, "No conversations found");
  }

  return NextResponse.json(
    {
      success: true,
      message: "Conversations fetched successfully",
      data: conversations,
    },
    { status: 200 }
  );
}

/* -----------------------------------------------------------
   🧩 POST /api/conversations → create new conversation
   Body: { title }
----------------------------------------------------------- */
export async function setConversation(req) {
  const user = await decodingUser();

  const body = await req.json().catch(() => {
    throw new ExpressError(400, "Invalid JSON body");
  });

  const { title, aiModel } = body;
  if (!title || typeof title !== "string" || !title.trim()) {
    throw new ExpressError(400, "Title is required and must be a string");
  }

  const newConv = new Conversation({
    title: title.trim(),
    user_id: user._id,
    aiModel: aiModel
  });

  await newConv.save();

  return NextResponse.json(
    {
      success: true,
      message: "Conversation created successfully",
      data: newConv,
    },
    { status: 201 }
  );
}

/* -----------------------------------------------------------
   💬 GET /api/messages?conversation_id=<id>
   Fetch messages for a conversation
----------------------------------------------------------- */
export async function getMessages(req) {
  const user = await decodingUser();

  const conversation_id =
    req.nextUrl?.searchParams?.get("conversation_id") ||
    (await req.json().then((b) => b?.conversation_id).catch(() => null));

  if (!conversation_id) {
    throw new ExpressError(400, "conversation_id is required");
  }

  const conv = await Conversation.findOne({
    _id: conversation_id,
    user_id: user._id,
  });

  if (!conv) {
    throw new ExpressError(403, "Access denied or conversation not found");
  }

  const messages = await Messages.find({ conversation_id })

  const sortedMEssages = messages.sort((a, b)=>{a.IndexNum-b.IndexNum});

  if (!messages || messages.length === 0) {
    throw new ExpressError(404, "No messages found");
  }

  return NextResponse.json(
    {
      success: true,
      message: "Messages fetched successfully",
      data: sortedMEssages,
    },
    { status: 200 }
  );
}

/* -----------------------------------------------------------
   💬 POST /api/messages
   Body: { conversation_id, value, type, IndexNum }
----------------------------------------------------------- */
export async function setMessages(req) {
  const user = await decodingUser();

  const body = await req.json().catch(() => {
    throw new ExpressError(400, "Invalid JSON body");
  });

  const { conversation_id, content, role, IndexNum } = body;

  if (!["assistant", "user"].includes(role)) {
    throw new ExpressError(400, 'type must be either "Bot" or "User"');
  }

  const conv = await Conversation.findOne({
    _id: conversation_id,
    user_id: user._id,
  });
  if (!conv) {
    throw new ExpressError(403, "Access denied or conversation not found");
  }

  const newMsg = new Messages({ role, conversation_id, content, IndexNum });
  await newMsg.save();

  return NextResponse.json(
    {
      success: true,
      message: "Message saved successfully",
      data: newMsg,
    },
    { status: 201 }
  );
}
