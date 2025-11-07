import { connectDB } from "@/config/db.config";
import { NextResponse } from "next/server";

export default function wrapAsync(controller) {
  return async function (req, context) {
    try {
      await connectDB();

      return await controller(req, context);
    } catch (err) {
      console.error(err);

      if (err.status && err.message) {
        return NextResponse.json({ success: false, message: err.message }, { status: err.status });
      }

      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  };
}
