import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const user = await currentUser();
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const room = await db.room.create({
      data: {
        ...body,
      },
    });

    res.status(200).json(room);

    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at POST /api/room", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
