import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";

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
    const dbUser = await getUserById(user.id);
    const userId = dbUser?.id;

    const hotel = await db.hotel.create({
      data: {
        ...body,
        userId,
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.log("Error at POST /api/hotel", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
