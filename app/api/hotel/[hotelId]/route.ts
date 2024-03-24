import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { hotelId: string } }
): Promise<Response> {
  try {
    const body = req.body;
    const user = await currentUser();

    if (!params.hotelId) {
<<<<<<< HEAD
      return res.status(400).json({ message: "hotelId is required" });
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
=======
      return new Response(JSON.stringify({ message: "hotelId is required" }), {
        status: 400,
      });
    }

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
>>>>>>> test-function
    }

    const hotel = await db.hotel.update({
      where: { id: params.hotelId },
      data: { ...body },
    });

<<<<<<< HEAD
    return res.status(200).json(hotel);
  } catch (error) {
    console.log("Error at PATCH /api/hotel", error);
    return res.status(500).json({ message: "Internal Server Error" });
=======
    return new Response(JSON.stringify(hotel), { status: 200 });
  } catch (error) {
    console.log("Error at PATCH /api/hotel", error);
    return new Response("Internal Server Error", { status: 500 });
>>>>>>> test-function
  }
}

export async function DELETE(
<<<<<<< HEAD
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
=======
  req: Request,
  { params }: { params: { hotelId: string } }
): Promise<Response> {
  try {
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
>>>>>>> test-function
    }
    const hotel = await db.hotel.delete({
      where: { id: params.hotelId },
    });
<<<<<<< HEAD
    return res.status(200).json(room);
  } catch (error) {
    console.log("Error at DELETE /api/room", error);
    return res.status(500).json({ message: "Internal Server Error" });
=======
    return new Response(JSON.stringify(hotel), { status: 200 });
  } catch (error) {
    console.log("Error at DELETE /api/hotel", error);
    return new Response("Internal Server Error", { status: 500 });
>>>>>>> test-function
  }
}
