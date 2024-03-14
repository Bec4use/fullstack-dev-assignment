import { currentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  const { imageKey } = await req.json();
  const user = await currentUser();

  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  // Check if imageKey is not null and is a string
  if (!imageKey || typeof imageKey !== "string") {
    return new NextResponse("Bad Request", { status: 400 });
  }

  try {
    const res = await utapi.deleteFiles([imageKey]);
    return NextResponse.json(res);
  } catch (error) {
    console.log("error at uploadthing/delete/route.ts: ", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
