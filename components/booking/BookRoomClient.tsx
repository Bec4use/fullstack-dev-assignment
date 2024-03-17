"use client";

import useBookRoom from "@/hook/useBookRoom";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import RoomCard from "../room/RoomCard";
import { Elements } from "@stripe/react-stripe-js";
import { IoCalendarSharp } from "react-icons/io5";
import RoomPaymentForm from "./RoomPaymentForm";
import { useState } from "react";
import { useTheme } from "next-themes";
import Stripe from "stripe";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const BookRoomClient = () => {
  const { bookingRoomData, clientSecret } = useBookRoom();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme === "dark" ? "night" : "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = (value: boolean) => {
    setPaymentSuccess(value);
  };

  if (!paymentSuccess && (!bookingRoomData || !clientSecret))
    return (
      <div className="flex flex-col items-center gap-4 p-4 shadow rounded-lg backdrop-filter backdrop-blur-md">
        <div className="text-rose-500 text-lg font-semibold">
          Oops! This page could not be loaded. Please try again.
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Button
            variant="outline"
            className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors"
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
          <Button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => router.push("/my-bookings")}
          >
            View My Booking
          </Button>
        </div>
      </div>
    );
  if (paymentSuccess)
    return (
      <div className="flex items-center flex-col gap-4">
        <div className="text-teal-500 text-center">Payment Success</div>
        <Button onClick={() => router.push("/my-bookings")}>
          View Bookings
        </Button>
      </div>
    );

  return (
    <div className="max-w-[700px] mx-auto">
      {clientSecret && bookingRoomData && (
        <div>
          <h3 className="text-2xl font-semibold mb-6 flex">
            Complete payment to reserve this room!
            <IoCalendarSharp className="ml-4" size={30} />
          </h3>
          <div className="mb-6">
            <RoomCard room={bookingRoomData.room} />
          </div>
          <Elements options={options} stripe={stripePromise}>
            <RoomPaymentForm
              clientSecret={clientSecret}
              handleSetPaymentSuccess={handleSetPaymentSuccess}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default BookRoomClient;
