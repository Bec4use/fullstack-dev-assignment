import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await currentUser();
    if (!user) {
      return {
        status: 401,
        body: { message: "Unauthorized" },
      };
    }

    const room = await db.room.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at POST /api/room", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
