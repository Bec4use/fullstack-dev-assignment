import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const room = await db.room.create({
      data: {
        ...body,
      },
    });

    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    console.log("Error at POST /api/room", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
