import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const body = await req.json();
    const user = await currentUser();

    if (!params.hotelId) {
      return {
        status: 400,
        body: { message: "hotelId is required" },
      };
    }

    if (!user) {
      return {
        status: 401,
        body: { message: "Unauthorized" },
      };
    }

    const hotel = await db.hotel.update({
      where: { id: params.hotelId },
      data: { ...body },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.log("Error at PATCH /api/hotel", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  try {
    const user = await currentUser();
    if (!params.roomId) {
      return {
        status: 400,
        body: { message: "roomId is required" },
      };
    }
    if (!user) {
      return {
        status: 401,
        body: { message: "Unauthorized" },
      };
    }
    const room = await db.room.delete({
      where: { id: params.roomId },
    });
    return NextResponse.json(room);
  } catch (error) {
    console.log("Error at DELETE /api/room", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
