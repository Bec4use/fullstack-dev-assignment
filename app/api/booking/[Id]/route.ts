import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { Id: string } }
) {
  try {
    const user = await currentUser();

    if (!params.Id) {
      return res.status(400).json({ message: "Payment Intent ID is required" });
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await db.booking.update({
      where: { paymentIntentId: params.Id },
      data: { paymentStatus: true },
    });

    return res.status(200).json(booking);
  } catch (error) {
    console.log("Error at PATCH /api/booking", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { Id: string } }
) {
  try {
    const user = await currentUser();
    if (!params.Id) {
      return res.status(400).json({ message: "Booking Id is required" });
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const booking = await db.booking.delete({
      where: { id: params.Id },
    });
    return res.status(200).json(booking);
  } catch (error) {
    console.log("Error at DELETE /api/booking", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse,
  args?: { params: { Id: string } }
) {
  try {
    if (!args) {
      res.status(400).json({ message: "Missing parameters" });
      return;
    }

    const { params } = args;
    const user = await currentUser();
    if (!params.Id) {
      res.status(400).json({ message: "Hotel Id is required" });
      return;
    }
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await db.booking.findMany({
      where: {
        paymentStatus: true,
        roomId: params.Id,
        endDate: {
          gt: yesterday,
        },
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.log("Error at GET /api/booking", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
