import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: { hotelId: string } }
): Promise<Response> {
  try {
    const body = await req.json();
    const user = await currentUser();

    if (!params.hotelId) {
      return new Response(JSON.stringify({ message: "hotelId is required" }), {
        status: 400,
      });
    }

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const hotel = await db.hotel.update({
      where: { id: params.hotelId },
      data: { ...body },
    });

    return new Response(JSON.stringify(hotel), { status: 200 });
  } catch (error) {
    console.log("Error at PATCH /api/hotel", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string } }
): Promise<Response> {
  try {
    const user = await currentUser();
    if (!params.roomId) {
      return new Response(JSON.stringify({ message: "roomId is required" }), {
        status: 400,
      });
    }
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    const room = await db.room.delete({
      where: { id: params.roomId },
    });
    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    console.log("Error at DELETE /api/room", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
