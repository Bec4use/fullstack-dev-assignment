"use client";

import useBookRoom from "@/hook/useBookRoom";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import RoomCard from "../room/RoomCard";
import { Elements } from "@stripe/react-stripe-js";
import { BsClipboardCheckFill } from "react-icons/bs";
import RoomPaymentForm from "./RoomPaymentForm";
import { useState } from "react";
import { useTheme } from "next-themes";
import Stripe from "stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const BookRoomClient = () => {
  const { bookingRoomData, clientSecret } = useBookRoom();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { theme } = useTheme();

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

  return (
    <div className="max-w-[700px] mx-auto">
      {clientSecret && bookingRoomData && (
        <div>
          <h3 className="text-2xl font-semibold mb-6 flex">
            Complete payment to reserve this room!
            <BsClipboardCheckFill className="ml-4 text-green-400" size={30} />
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
