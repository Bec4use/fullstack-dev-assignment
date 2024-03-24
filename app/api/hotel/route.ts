import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";
import { NextApiResponse } from "next";

<<<<<<< HEAD
export async function POST(req: Request, res: NextApiResponse) {
=======
export async function POST(req: Request): Promise<Response> {
>>>>>>> test-function
  try {
    const body = await req.json();
    const user = await currentUser();
    if (!user) {
<<<<<<< HEAD
      res.status(401).json({ message: "Unauthorized" });
      return;
=======
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
>>>>>>> test-function
    }
    const dbUser = await getUserById(user.id);
    const userId = dbUser?.id;

    const hotel = await db.hotel.create({
      data: {
        ...body,
        userId,
      },
    });

<<<<<<< HEAD
    res.status(200).json(hotel);
  } catch (error) {
    console.log("Error at POST /api/hotel", error);
    res.status(500).json({ message: "Internal Server Error" });
=======
    return new Response(JSON.stringify(hotel), { status: 200 });
  } catch (error) {
    console.log("Error at POST /api/hotel", error);
    return new Response("Internal Server Error", { status: 500 });
>>>>>>> test-function
  }
}
