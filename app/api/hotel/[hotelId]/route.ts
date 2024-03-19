import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { hotelId: string } }
) {
  try {
    const body = req.body;
    const user = await currentUser();

    if (!params.hotelId) {
      return res.status(400).json({ message: "hotelId is required" });
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const hotel = await db.hotel.update({
      where: { id: params.hotelId },
      data: { ...body },
    });

    return res.status(200).json(hotel);
  } catch (error) {
    console.log("Error at PATCH /api/hotel", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { roomId: string } }
) {
  try {
    const user = await currentUser();
    if (!params.roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const room = await db.room.delete({
      where: { id: params.roomId },
    });
    return res.status(200).json(room);
  } catch (error) {
    console.log("Error at DELETE /api/room", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
