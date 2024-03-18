"use client";

import { Booking, Hotel, Room } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Fence,
  HandPlatter,
  MapPin,
  MountainSnow,
  Ship,
  Telescope,
  Trees,
  Tv,
  User,
  VolumeX,
  Wifi,
} from "lucide-react";
import AmenityItem from "../AmenityItem";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { differenceInCalendarDays } from "date-fns";
import useBookRoom from "@/hook/useBookRoom";
import useLocation from "@/hook/useLocation";
import moment from "moment";

interface MyBookingsClientProps {
  booking: Booking & { Room: Room | null } & { Hotel: Hotel | null };
}

const MyBookingsClient: React.FC<MyBookingsClientProps> = ({ booking }) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const { getCountryByCode, getStateByCode } = useLocation();
  //   const user = currentUser();
  const router = useRouter();
  const { Hotel, Room } = booking;
  const { toast } = useToast();

  if (!Hotel || !Room) return <div>Missing Data...</div>;

  const country = getCountryByCode(Hotel.country);
  const state = getStateByCode(Hotel.country, Hotel.state);

  const startDate = moment(booking.startDate).format("MMMM Do YYYY");
  const endDate = moment(booking.endDate).format("MMMM Do YYYY");
  const dayCount = differenceInCalendarDays(booking.endDate, booking.startDate);

  const handleBookRoom = () => {
    // if (!user)
    //   return toast({
    //     variant: "destructive",
    //     description: "You need to be logged in to book a room",
    //   });

    if (!Hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Hotel owner is not found",
      });

    setBookingIsLoading(true);

    const bookingRoomData = {
      room: Room,
      totalPrice: booking.totalPrice,
      breakFastIncluded: booking.breakFastIncluded,
      startDate: booking.startDate,
      endDate: booking.endDate,
    };

    setRoomData(bookingRoomData);

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          hotelOwnerId: Hotel.userId,
          hotelId: Hotel.id,
          roomId: Room.id,
          startDate: bookingRoomData.startDate,
          endDate: bookingRoomData.endDate,
          breakFastIncluded: bookingRoomData.breakFastIncluded,
          totalPrice: bookingRoomData.totalPrice,
        },
        payment_intent_id: paymentIntentId,
      }),
    })
      .then((res) => {
        setBookingIsLoading(false);
        if (res.status === 401) {
          return router.push("/login");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.paymentIntent.client_secret);
        setPaymentIntentId(data.paymentIntent.id);
        router.push("/book-room");
      })
      .catch((error: any) => {
        console.log("Error :", error);
        toast({
          variant: "destructive",
          description: error.message,
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">HOTEL : {Hotel.title}</CardTitle>
        <CardDescription>
          <div className="text-primary/70 text-md md:text-sm  font-semibold mt-4">
            <AmenityItem>
              <MapPin className="w-4 h-4" />
              {country?.name}, {state?.name}, {Hotel.city}
            </AmenityItem>
          </div>
          <p className="text-primary/90 py-2 text-xs">
            {Hotel.locationDescription}
          </p>
        </CardDescription>
        <Separator />
        <CardTitle className="mt-2">ROOM : {Room.title}</CardTitle>
        <CardDescription className="text-xs pt-2">
          {Room.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={Room.image}
            alt={Room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-[11px] text-primary/70">
          <AmenityItem>
            <Bed className="h-4 w-4" /> {Room.bedCount} Bed{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <User className="h-4 w-4" />
            {Room.guestCount} Guest{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" />
            {Room.bathroomCount} Bath{"(s)"}
          </AmenityItem>
          {!!Room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {Room.kingBed} King Bed{"(s)"}
            </AmenityItem>
          )}
          {!!Room.queenBed && (
            <AmenityItem>
              <Bed className="h-4 w-4" />
              {Room.queenBed} Queen Bed{"(s)"}
            </AmenityItem>
          )}
        </div>
        <p className="text-[12px] font-semibold">Accessories :</p>
        <div className="grid grid-cols-2 gap-4 content-start text-[11px] text-primary/70">
          {Room.roomService && (
            <AmenityItem>
              <HandPlatter className="h-4 w-4" />
              Room Service
            </AmenityItem>
          )}
          {Room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {Room.balcony && (
            <AmenityItem>
              <Fence className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {Room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free Wifi
            </AmenityItem>
          )}
          {Room.cityView && (
            <AmenityItem>
              <Telescope className="h-4 w-4" />
              City View
            </AmenityItem>
          )}
          {Room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean View
            </AmenityItem>
          )}
          {Room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest View
            </AmenityItem>
          )}
          {Room.mountainView && (
            <AmenityItem>
              <MountainSnow className="h-4 w-4" />
              Mountain View
            </AmenityItem>
          )}
          {Room.airConditioned && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air Conditioned
            </AmenityItem>
          )}
          {Room.soundProofed && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" />
              Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between text-xs">
          <div>
            Room Price: <span className="font-bold">${Room.roomPrice}</span>
            <span className="text-[11px] text-primary/70">/24hrs</span>
          </div>
          {!!Room.breakFastPrice && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${Room.breakFastPrice}</span>
              <span className="text-[11px] text-primary/70">/person</span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap2 text-sm">
          <CardTitle>Booking Details</CardTitle>
          <div className="text-primary/60 mt-2">
            <div>
              Room booked by {booking.userName} for {dayCount} days -{" "}
              {moment(booking.bookedAt).fromNow()}
            </div>
            <div>Check-in : {startDate} at 5PM</div>
            <div>Check-out {endDate} at 5PM</div>
            {booking.breakFastIncluded && <div>Breakfast included</div>}
            {booking.paymentStatus ? (
              <div className="text-green-500">
                Payment Status: Paid ${booking.totalPrice} - Room Reserved
              </div>
            ) : (
              <div className="text-red-500">
                Payment Status: Unpaid ${booking.totalPrice} - Room Not Reserved
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          disabled={bookingIsLoading}
          variant="outline"
          onClick={() => router.push(`/hotel-details/${Hotel.id}`)}
        >
          View Hotel
        </Button>
        {!booking.paymentStatus && (
          <Button disabled={bookingIsLoading} onClick={() => handleBookRoom()}>
            {bookingIsLoading ? "Processing..." : "Pay Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MyBookingsClient;
