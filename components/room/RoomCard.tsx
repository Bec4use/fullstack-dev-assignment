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
  Loader2,
  MountainSnow,
  Settings2,
  Ship,
  Telescope,
  Trash2,
  Trees,
  Tv,
  User,
  VolumeX,
  Wand2,
  Wifi,
} from "lucide-react";
import AmenityItem from "../AmenityItem";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import { differenceInCalendarDays, set } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { currentUser } from "@/lib/auth";
import useBookRoom from "@/hook/useBookRoom";

interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [openAddRoom, setOpenAddRoom] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakfast, setIncludeBreakfast] = useState(false);
  const [days, setDays] = useState(0);

  const router = useRouter();
  const { toast } = useToast();
  const user = currentUser();
  const pathname = usePathname();
  const isHotelDetailsPage = pathname.includes("hotel-details");

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);

      setDays(dayCount);

      if (dayCount && room.roomPrice) {
        if (includeBreakfast && room.breakFastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakFastPrice
          );
        } else {
          setTotalPrice(room.roomPrice * dayCount);
        }
      } else {
        setTotalPrice(room.roomPrice);
      }
    }
  }, [date, room.roomPrice, includeBreakfast, room.breakFastPrice]);

  const handleDialogOpen = () => {
    setOpenAddRoom((prev) => !prev);
  };

  const handleRoomDelete = async (room: Room) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: "success",
              description: "Room deleted successfully",
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: "Failed to delete the room",
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Failed to delete the room",
        });
      });
  };

  const handleBookRoom = () => {
    if (!user)
      return toast({
        variant: "destructive",
        description: "You need to be logged in to book a room",
      });

    if (!hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Hotel owner is not found",
      });

    if (date?.from && date?.to) {
      setBookingIsLoading(true);

      const bookingRoomData = {
        room,
        totalPrice,
        breakFastIncluded: includeBreakfast,
        startDate: date.from,
        endDate: date.to,
      };

      setRoomData(bookingRoomData);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastIncluded: includeBreakfast,
            totalPrice: totalPrice,
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
    } else {
      toast({
        variant: "destructive",
        description: "Please select the date range to book the room",
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-[11px] text-primary/70">
          <AmenityItem>
            <Bed className="h-4 w-4" /> {room.bedCount} Bed{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <User className="h-4 w-4" />
            {room.guestCount} Guest{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" />
            {room.bathroomCount} Bath{"(s)"}
          </AmenityItem>
          {!!room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.kingBed} King Bed{"(s)"}
            </AmenityItem>
          )}
          {!!room.queenBed && (
            <AmenityItem>
              <Bed className="h-4 w-4" />
              {room.queenBed} Queen Bed{"(s)"}
            </AmenityItem>
          )}
        </div>
        <p className="text-[12px] font-semibold">Accessories :</p>
        <div className="grid grid-cols-2 gap-4 content-start text-[11px] text-primary/70">
          {room.roomService && (
            <AmenityItem>
              <HandPlatter className="h-4 w-4" />
              Room Service
            </AmenityItem>
          )}
          {room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Fence className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free Wifi
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Telescope className="h-4 w-4" />
              City View
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean View
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest View
            </AmenityItem>
          )}
          {room.mountainView && (
            <AmenityItem>
              <MountainSnow className="h-4 w-4" />
              Mountain View
            </AmenityItem>
          )}
          {room.airConditioned && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air Conditioned
            </AmenityItem>
          )}
          {room.soundProofed && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" />
              Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between text-xs">
          <div>
            Room Price: <span className="font-bold">${room.roomPrice}</span>
            <span className="text-[11px] text-primary/70">/24hrs</span>
          </div>
          {!!room.breakFastPrice && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">${room.breakFastPrice}</span>
              <span className="text-[11px] text-primary/70">/person</span>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>
      <CardFooter>
        {isHotelDetailsPage ? (
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2">
                Select the date range to book the room for the hotel.
              </div>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
            {room.breakFastPrice > 0 && (
              <div className="items-center gap-4">
                <div className="mb-2">
                  Do you want to be serve breakfast each day?
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breakfast"
                    onCheckedChange={(value) => setIncludeBreakfast(!!value)}
                  />
                  <label htmlFor="breakfast" className="text-sm">
                    Include Breakfast
                  </label>
                </div>
              </div>
            )}
            <div>
              Total Price : <span className="font-bold">${totalPrice}</span> for{" "}
              <span className="font-bold">{days} Days</span>
            </div>
            <Button
              onClick={() => handleBookRoom()}
              disabled={bookingIsLoading}
              type="button"
            >
              {bookingIsLoading ? (
                <Loader2 className="mr-2 h-4 w-4" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {bookingIsLoading ? "Booking..." : "Book Now"}
            </Button>
          </div>
        ) : (
          <div className="flex w-full justify-between">
            <Button
              disabled={isLoading}
              type="button"
              variant="ghost"
              onClick={() => handleRoomDelete(room)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
            <Dialog open={openAddRoom} onOpenChange={setOpenAddRoom}>
              <DialogTrigger>
                <Button
                  variant="outline"
                  type="button"
                  className="max-w-[150px]"
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  Update Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90%]">
                <DialogHeader className="px-2">
                  <DialogTitle>Update Rooms</DialogTitle>
                  <DialogDescription>
                    Update the room details for the hotel
                  </DialogDescription>
                </DialogHeader>
                <AddRoomForm
                  hotel={hotel}
                  room={room}
                  handleDialogOpen={handleDialogOpen}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
