import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
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

    const room = await db.room.create({
      data: {
        ...body,
      },
    });

<<<<<<< HEAD
    res.status(200).json(room);

    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at POST /api/room", error);
    res.status(500).json({ message: "Internal Server Error" });
=======
    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    console.log("Error at POST /api/room", error);
    return new Response("Internal Server Error", { status: 500 });
>>>>>>> test-function
  }
}
