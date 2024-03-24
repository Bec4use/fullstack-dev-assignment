import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { roomId: string } }
): Promise<Response> {
  try {
    const body = req.body;
    const user = await currentUser();

    if (!params.roomId) {
<<<<<<< HEAD
      res.status(400).json({ message: "RoomId is required" });
      return;
    }

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
=======
      return new Response(JSON.stringify({ message: "roomId is required" }), {
        status: 400,
      });
    }

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
>>>>>>> test-function
    }

    const room = await db.room.update({
      where: { id: params.roomId },
      data: { ...body },
    });

<<<<<<< HEAD
    res.status(200).json(room);
  } catch (error) {
    console.log("Error at PATCH /api/room", error);
    res.status(500).json({ message: "Internal Server Error" });
=======
    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    console.log("Error at PUT /api/room", error);
    return new Response("Internal Server Error", { status: 500 });
>>>>>>> test-function
  }
}

export async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { roomId: string } }
): Promise<Response> {
  try {
    const user = await currentUser();
    if (!params.roomId) {
<<<<<<< HEAD
      res.status(400).json({ message: "RoomId is required" });
      return;
    }
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
=======
      return new Response(JSON.stringify({ message: "RoomId is required" }), {
        status: 400,
      });
    }
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
>>>>>>> test-function
    }
    const room = await db.room.delete({
      where: { id: params.roomId },
    });
<<<<<<< HEAD
    res.status(200).json(room);
  } catch (error) {
    console.log("Error at DELETE /api/room", error);
    res.status(500).json({ message: "Internal Server Error" });
=======
    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    console.log("Error at DELETE /api/room", error);
    return new Response("Internal Server Error", { status: 500 });
>>>>>>> test-function
  }
}
