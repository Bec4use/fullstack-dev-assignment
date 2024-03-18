"use client";

import useBookRoom from "@/hook/useBookRoom";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator";
import moment from "moment";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Terminal } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Booking } from "@prisma/client";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

interface RoomPaymentFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

type DateRangesType = {
  startDate: Date;
  endDate: Date;
};

function hasOverlap(
  startDate: Date,
  endDate: Date,
  dateRanges: DateRangesType[]
) {
  const targetInterval = {
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  };

  for (const range of dateRanges) {
    const rangeStart = startOfDay(new Date(range.startDate));
    const rangeEnd = endOfDay(new Date(range.endDate));

    if (
      isWithinInterval(targetInterval.start, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      isWithinInterval(targetInterval.end, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
    ) {
      return true;
    }
  }
  return false;
}

const RoomPaymentForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: RoomPaymentFormProps) => {
  const { bookingRoomData, resetBookRoom } = useBookRoom();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    handleSetPaymentSuccess(false);
    setIsLoading(false);
  }, [stripe, clientSecret, handleSetPaymentSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements || !bookingRoomData) {
      return;
    }
    try {
      const bookings = await axios.get(
        `/api/booking/${bookingRoomData.room.id}`
      );

      const roomBookingDates = bookings.data.map((booking: Booking) => {
        return {
          startDate: booking.startDate,
          endDate: booking.endDate,
        };
      });

      const overlapFound = hasOverlap(
        bookingRoomData.startDate,
        bookingRoomData.endDate,
        roomBookingDates
      );

      if (overlapFound) {
        setIsLoading(false);
        return toast({
          variant: "destructive",
          description:
            "Room is already booked for the selected dates! Please select different dates.",
        });
      }
      stripe
        .confirmPayment({ elements, redirect: "if_required" })
        .then((result) => {
          if (!result.error) {
            axios
              .put(`/api/booking/${result.paymentIntent.id}`)
              .then((res) => {
                toast({
                  variant: "success",
                  description: "Payment Successful!",
                });
                router.refresh();
                resetBookRoom();
                handleSetPaymentSuccess(true);
                setIsLoading(false);
              })
              .catch((error) => {
                console.log(error);
                toast({
                  variant: "destructive",
                  description: "Payment Failed! (catch)",
                });
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: "Payment Failed! (else)",
            });
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  if (!bookingRoomData?.startDate || !bookingRoomData?.endDate) {
    return <div>Error: Missing reservation dates...</div>;
  }

  const startDate = moment(bookingRoomData?.startDate).format("MMMM Do YYYY");
  const endDate = moment(bookingRoomData?.endDate).format("MMMM Do YYYY");

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="font-semibold mb-2 text-lg">Billing Address</h2>
      <AddressElement
        options={{
          mode: "billing",
        }}
      />
      <h2 className="font-semibold mt-4 mb-2 text-lg">Payment Information</h2>
      <PaymentElement
        id="payment-element"
        options={{
          layout: "tabs",
        }}
      />
      <div className="flex flex-col gap-4 p-4 rounded-lg shadow-md mt-4">
        <Separator />
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl text-white-600">
            Your Booking Summary
          </h2>
          <div className="text-sm text-gray-700">
            You will check-in on{" "}
            <span className="font-semibold">{startDate}</span> at 5PM
          </div>
          <div className="text-sm text-gray-700">
            You will check-out on{" "}
            <span className="font-semibold">{endDate}</span> at 5PM
          </div>
          {bookingRoomData?.breakFastIncluded && (
            <div className="text-sm text-gray-700">
              You will be served breakfast each day at 8AM
            </div>
          )}
        </div>
        <Separator />
        <div className="font-bold text-xl text-white-600">
          {bookingRoomData?.breakFastIncluded && (
            <div className="mb-2 text-sm text-gray-700 justify-center flex">
              Breakfast Price :{" "}
              <div className="font-semibold">
                ${bookingRoomData.room.breakFastPrice}
              </div>
            </div>
          )}
          <div className="flex justify-center">
            Total Price:{" "}
            <span className="font-semibold">
              ${bookingRoomData?.totalPrice}
            </span>
          </div>
        </div>
      </div>
      {isLoading && (
        <Alert className="flex flex-col gap-2 p-4 bg-primary/20 rounded-md bg-indigo-600">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Payment Processing...</AlertTitle>
          <AlertDescription>
            Your hotel needs rooms !
            <div>Please stay on the page as we process your payment</div>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex justify-center mt-4">
        <Button disabled={isLoading}>
          {isLoading ? "Process Payment..." : "Confirm Payment"}
        </Button>
      </div>
    </form>
  );
};

export default RoomPaymentForm;
