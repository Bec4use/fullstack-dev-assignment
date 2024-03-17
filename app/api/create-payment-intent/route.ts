import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { booking, payment_intent_id } = body;

  const bookingData = {
    ...booking,
    userName: user.name,
    userEmail: user.email,
    userId: user.id,
    currency: "usd",
    paymentIntentId: payment_intent_id,
  };

  let foundBooking;

  if (payment_intent_id) {
    foundBooking = await db.booking.findUnique({
      where: {
        paymentIntentId: payment_intent_id,
        userId: user.id,
      },
    });
  }

  if (foundBooking && payment_intent_id) {
    //Update the booking
    const current_intent =
      await stripe.paymentIntents.retrieve(payment_intent_id);
    if (current_intent) {
      if (current_intent.status === "succeeded") {
        // The PaymentIntent has already been paid, so create a new PaymentIntent
        const newPaymentIntent = await stripe.paymentIntents.create({
          amount: booking.totalPrice * 100,
          currency: bookingData.currency,
          automatic_payment_methods: { enabled: true },
        });

        bookingData.paymentIntentId = newPaymentIntent.id;

        await db.booking.create({
          data: bookingData,
        });

        return NextResponse.json({ paymentIntent: newPaymentIntent });
      } else {
        // The PaymentIntent hasn't been paid yet, so update its amount
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: booking.totalPrice * 100,
          }
        );

        const res = await db.booking.update({
          where: {
            paymentIntentId: payment_intent_id,
            userId: user.id,
          },
          data: bookingData,
        });

        if (!res) {
          return NextResponse.error();
        }
        return NextResponse.json({ paymentIntent: updated_intent });
      }
    }
  } else {
    // Create a new booking
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalPrice * 100,
      currency: bookingData.currency,
      automatic_payment_methods: { enabled: true },
    });

    bookingData.paymentIntentId = paymentIntent.id;

    await db.booking.create({
      data: bookingData,
    });

    return NextResponse.json({ paymentIntent });
  }
  return new NextResponse("Internal Server Error", { status: 500 });
}
