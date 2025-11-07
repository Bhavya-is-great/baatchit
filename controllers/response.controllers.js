import { NextResponse } from "next/server";

function extractText(resp) {
  if (!resp) return "";
  if (resp.message && typeof resp.message === "object") {
    if (typeof resp.message.content === "string") return resp.message.content;
    if (Array.isArray(resp.message.content)) return resp.message.content.join("");
  }
  if (typeof resp.content === "string") return resp.content;
  if (typeof resp.text === "string") return resp.text;
  if (resp.choices && Array.isArray(resp.choices) && resp.choices[0]) {
    if (typeof resp.choices[0].text === "string") return resp.choices[0].text;
    if (resp.choices[0].message && resp.choices[0].message.content)
      return resp.choices[0].message.content;
  }
  try {
    return JSON.stringify(resp);
  } catch {
    return String(resp);
  }
}

// Make these simple wrappers return a NextResponse
async function chatgpt(history = []) {
  const response = await puter.ai.chat(history, { model: "openai/gpt-4o" });
  const text = extractText(response);
  return NextResponse.json({ success: true, message: text }, { status: 200 });
}

async function gemini(history = []) {
  const response = await puter.ai.chat(history, { model: "google/gemini-1.5" });
  const text = extractText(response);
  return NextResponse.json({ success: true, message: text }, { status: 200 });
}

async function claude(history = []) {
  const response = await puter.ai.chat(history, { model: "anthropic/claude-3.5-sonnet" });
  const text = extractText(response);
  return NextResponse.json({ success: true, message: text }, { status: 200 });
}

async function grok(history = []) {
  const response = await puter.ai.chat(history, { model: "xai/grok-1" });
  const text = extractText(response);
  return NextResponse.json({ success: true, message: text }, { status: 200 });
}

// Next.js app router expects method named exports like `POST`
export default async function giveResponse(req) {
  try {
    const body = await req.json();
    const { history, aiModel } = body ?? {};

    if (!history || !Array.isArray(history)) {
      return NextResponse.json(
        { success: false, message: "Invalid request: 'history' must be an array" },
        { status: 400 }
      );
    }

    // Use switch to make sure we return the result of the called function
    switch ((aiModel || "chatgpt").toLowerCase()) {
      case "chatgpt":
      case "openai":
        return await chatgpt(history);
      case "gemini":
      case "google":
        return await gemini(history);
      case "claude":
      case "anthropic":
        return await claude(history);
      case "grok":
      case "xai":
        return await grok(history);
      default:
        return NextResponse.json(
          { success: false, message: `Unknown aiModel: ${aiModel}` },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("AI route error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: String(err) },
      { status: 500 }
    );
  }
}
