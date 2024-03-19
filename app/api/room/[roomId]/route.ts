import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { roomId: string } }
) {
  try {
    const body = req.body;
    const user = await currentUser();

    if (!params.roomId) {
      res.status(400).json({ message: "RoomId is required" });
      return;
    }

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const room = await db.room.update({
      where: { id: params.roomId },
      data: { ...body },
    });

    res.status(200).json(room);
  } catch (error) {
    console.log("Error at PATCH /api/room", error);
    res.status(500).json({ message: "Internal Server Error" });
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
      res.status(400).json({ message: "RoomId is required" });
      return;
    }
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const room = await db.room.delete({
      where: { id: params.roomId },
    });
    res.status(200).json(room);
  } catch (error) {
    console.log("Error at DELETE /api/room", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
