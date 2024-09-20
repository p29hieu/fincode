import { NextResponse } from "next/server";

export async function POST(request: Request, other: { params: any }) {
  const bodyJson = await request.json();
  console.log("===Fincode webhook", bodyJson)
  return NextResponse.json("1")
}
