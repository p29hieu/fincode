import { NextResponse } from "next/server";

export async function GET(request: Request, other: { params: any }) {
  return NextResponse.json({
    message: "pong",
    timestampz: new Date(),
  });
}
