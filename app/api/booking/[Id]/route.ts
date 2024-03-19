import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { Id: string } }
): Promise<Response> {
  try {
    const user = await currentUser();
    if (!params.Id) {
      return new Response(JSON.stringify({ message: "Hotel Id is required" }), {
        status: 400,
      });
    }
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const updatedBooking = await db.booking.update({
      where: { paymentIntentId: params.Id },
      data: { paymentStatus: true },
    });
    return new Response(JSON.stringify(updatedBooking), { status: 200 });
  } catch (error) {
    console.log("Error at PUT /api/booking", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { Id: string } }
): Promise<Response> {
  try {
    const user = await currentUser();
    if (!params.Id) {
      return new Response(JSON.stringify({ message: "Hotel Id is required" }), {
        status: 400,
      });
    }
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }
    // Your code to delete the booking goes here
    const booking = await db.booking.delete({
      where: { id: params.Id },
    });
    // Replace this with your code to delete the booking
    return new Response(JSON.stringify(booking), {
      status: 200,
    });
  } catch (error) {
    console.log("Error at DELETE /api/booking", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { Id: string } }
): Promise<Response> {
  try {
    const user = await currentUser();
    if (!params.Id) {
      return new Response(JSON.stringify({ message: "Hotel Id is required" }), {
        status: 400,
      });
    }
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
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
    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    console.log("Error at GET /api/booking", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
