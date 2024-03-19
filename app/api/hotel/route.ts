import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const user = await currentUser();
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const dbUser = await getUserById(user.id);
    const userId = dbUser?.id;

    const hotel = await db.hotel.create({
      data: {
        ...body,
        userId,
      },
    });

    res.status(200).json(hotel);
  } catch (error) {
    console.log("Error at POST /api/hotel", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
