import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const dbUser = await getUserById(user.id);
    const userId = dbUser?.id;

    const hotel = await db.hotel.create({
      data: {
        ...body,
        userId,
      },
    });

    return new Response(JSON.stringify(hotel), { status: 200 });
  } catch (error) {
    console.log("Error at POST /api/hotel", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
