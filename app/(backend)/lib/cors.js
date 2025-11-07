import { NextResponse } from "next/server";

const allowedOrigin = "http://localhost:3000"; // your frontend

export function middleware(request) {
  const response = NextResponse.next(); // let the request continue

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: "/api/:path*", // only apply this to all API routes
};
