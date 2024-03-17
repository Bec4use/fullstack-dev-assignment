import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const user = await currentUser();

    if (!params.Id) {
      return {
        status: 400,
        body: { message: "Payment Intent ID is required" },
      };
    }

    if (!user) {
      return {
        status: 401,
        body: { message: "Unauthorized" },
      };
    }

    const booking = await db.booking.update({
      where: { paymentIntentId: params.Id },
      data: { paymentStatus: true },
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.log("Error at PATCH /api/booking", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const user = await currentUser();
    if (!params.Id) {
      return {
        status: 400,
        body: { message: "Booking Id is required" },
      };
    }
    if (!user) {
      return {
        status: 401,
        body: { message: "Unauthorized" },
      };
    }
    const booking = await db.booking.delete({
      where: { id: params.Id },
    });
    return NextResponse.json(booking);
  } catch (error) {
    console.log("Error at DELETE /api/booking", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
