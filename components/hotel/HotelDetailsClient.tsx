"use client";

import { Booking } from "@prisma/client";
import { HotelWithRooms } from "./AddHotelForm";
import useLocation from "@/hook/useLocation";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin } from "lucide-react";
import {
  FaCar,
  FaCartShopping,
  FaPersonSwimming,
  FaSpa,
  FaWifi,
} from "react-icons/fa6";
import {
  MdDirectionsBike,
  MdLocalBar,
  MdOutlineLocalLaundryService,
  MdOutlineRestaurant,
} from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { RiMovie2Fill } from "react-icons/ri";
import { SiBuymeacoffee } from "react-icons/si";
import RoomCard from "../room/RoomCard";
import { GiDiamondRing, GiPartyPopper } from "react-icons/gi";
import { BiSolidPlaneAlt } from "react-icons/bi";

const HotelDetailsClient = ({
  hotel,
  bookings,
}: {
  hotel: HotelWithRooms;
  bookings?: Booking[];
}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  const state = getStateByCode(hotel.country, hotel.state);

  return (
    <div className="flex flex-col gap-6 pb-2">
      <div className="aspect-square overflow-hidden relative w-full h-[200px] rounded-lg md:h-[400px] content-between justify-between">
        <Image
          fill
          src={hotel.image}
          alt={hotel.title}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <h3 className="font-semibold text-xl md:text-3xl">{hotel.title}</h3>
        <div className="text-primary/70 text-sm md:text-lg  font-semibold mt-4">
          <AmenityItem>
            <MapPin className="w-4 h-4" />
            {country?.name}, {state?.name}, {hotel.city}
          </AmenityItem>
        </div>
        <h3 className="font-semibold text-md mt-4 mb-2">Location Details</h3>
        <p className="text-primary/90 mb-2 text-sm">
          {hotel.locationDescription}
        </p>
        <h3 className="font-semibold text-md mt-4 mb-2">About this hotel</h3>
        <p className="text-primary/90 mb-2 text-sm">{hotel.description}</p>
        <h3 className="font-semibold text-md mt-4 mb-2">Popular Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-xs">
          {hotel.swimmingPool && (
            <AmenityItem>
              <FaPersonSwimming size={18} />
              Pool
            </AmenityItem>
          )}
          {hotel.gym && (
            <AmenityItem>
              <Dumbbell className="w-4 h-4" />
              Gym
            </AmenityItem>
          )}
          {hotel.spa && (
            <AmenityItem>
              <FaSpa size={18} />
              Spa
            </AmenityItem>
          )}
          {hotel.bar && (
            <AmenityItem>
              <MdLocalBar size={18} />
              Bar
            </AmenityItem>
          )}
          {hotel.laundry && (
            <AmenityItem>
              <MdOutlineLocalLaundryService size={18} />
              Laundry
            </AmenityItem>
          )}
          {hotel.restaurant && (
            <AmenityItem>
              <MdOutlineRestaurant size={18} />
              Restaurant
            </AmenityItem>
          )}
          {hotel.shopping && (
            <AmenityItem>
              <FaCartShopping size={18} />
              Shopping
            </AmenityItem>
          )}
          {hotel.freeParking && (
            <AmenityItem>
              <FaCar size={18} />
              Free Parking
            </AmenityItem>
          )}
          {hotel.bikeRental && (
            <AmenityItem>
              <MdDirectionsBike size={18} />
              Bike Rental
            </AmenityItem>
          )}
          {hotel.freeWifi && (
            <AmenityItem>
              <FaWifi size={18} />
              Free Wifi
            </AmenityItem>
          )}
          {hotel.movieNights && (
            <AmenityItem>
              <RiMovie2Fill size={18} />
              Movie Nights
            </AmenityItem>
          )}
          {hotel.coffeeShop && (
            <AmenityItem>
              <SiBuymeacoffee size={18} />
              Coffee Shop
            </AmenityItem>
          )}
          {hotel.multipurposeRoom && (
            <AmenityItem>
              <GiPartyPopper size={18} />
              Multipurpose Room
            </AmenityItem>
          )}
          {hotel.conferenceRoom && (
            <AmenityItem>
              <IoIosPeople size={18} />
              Conference Room
            </AmenityItem>
          )}
          {hotel.airportShuttle && (
            <AmenityItem>
              <BiSolidPlaneAlt size={18} />
              Airport Shuttle
            </AmenityItem>
          )}
          {hotel.weddingservice && (
            <AmenityItem>
              <GiDiamondRing size={18} />
              Wedding Service
            </AmenityItem>
          )}
        </div>
      </div>
      {!!hotel.rooms.length && (
        <div>
          <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotel.rooms.map((room) => {
              return (
                <RoomCard
                  key={room.id}
                  room={room}
                  hotel={hotel}
                  bookings={bookings}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetailsClient;
