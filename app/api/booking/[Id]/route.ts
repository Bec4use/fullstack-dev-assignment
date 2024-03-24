import { NextApiRequest, NextApiResponse } from "next";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { Id: string } }
): Promise<Response> {
  try {
    const user = await currentUser();
    if (!params.Id) {
<<<<<<< HEAD
      return res.status(400).json({ message: "Payment Intent ID is required" });
=======
      return new Response(JSON.stringify({ message: "Hotel Id is required" }), {
        status: 400,
      });
>>>>>>> test-function
    }
    if (!user) {
<<<<<<< HEAD
      return res.status(401).json({ message: "Unauthorized" });
=======
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
>>>>>>> test-function
    }

    const updatedBooking = await db.booking.update({
      where: { paymentIntentId: params.Id },
      data: { paymentStatus: true },
    });
<<<<<<< HEAD

    return res.status(200).json(booking);
  } catch (error) {
    console.log("Error at PATCH /api/booking", error);
    return res.status(500).json({ message: "Internal Server Error" });
=======
    return new Response(JSON.stringify(updatedBooking), { status: 200 });
  } catch (error) {
    console.log("Error at PUT /api/booking", error);
    return new Response("Internal Server Error", { status: 500 });
>>>>>>> test-function
  }
}

export async function DELETE(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { Id: string } }
): Promise<Response> {
  try {
    const user = await currentUser();
    if (!params.Id) {
<<<<<<< HEAD
      return res.status(400).json({ message: "Booking Id is required" });
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
=======
      return new Response(JSON.stringify({ message: "Hotel Id is required" }), {
        status: 400,
      });
    }
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
>>>>>>> test-function
    }
    // Your code to delete the booking goes here
    const booking = await db.booking.delete({
      where: { id: params.Id },
    });
<<<<<<< HEAD
    return res.status(200).json(booking);
  } catch (error) {
    console.log("Error at DELETE /api/booking", error);
    return res.status(500).json({ message: "Internal Server Error" });
=======
    // Replace this with your code to delete the booking
    return new Response(JSON.stringify(booking), {
      status: 200,
    });
  } catch (error) {
    console.log("Error at DELETE /api/booking", error);
    return new Response("Internal Server Error", { status: 500 });
>>>>>>> test-function
  }
}

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { Id: string } }
): Promise<Response> {
  try {
    const user = await currentUser();
    if (!params.Id) {
<<<<<<< HEAD
      return res.status(400).json({ message: "Hotel Id is required" });
    }
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
=======
      return new Response(JSON.stringify({ message: "Hotel Id is required" }), {
        status: 400,
      });
    }
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
>>>>>>> test-function
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
<<<<<<< HEAD
    return res.status(200).json(bookings);
  } catch (error) {
    console.log("Error at GET /api/booking", error);
    return res.status(500).json({ message: "Internal Server Error" });
=======
    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    console.log("Error at GET /api/booking", error);
    return new Response("Internal Server Error", { status: 500 });
>>>>>>> test-function
  }
}
