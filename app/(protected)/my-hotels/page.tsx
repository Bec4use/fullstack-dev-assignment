import { getHotelsByUserId } from "@/actions/getHotelsByUserId";
import HotelList from "@/components/hotel/HotelList";
import React from "react";

const MyHotels = async () => {
  const hotels = await getHotelsByUserId();

  if (!hotels) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold text-red-500">
        There are no hotels found!
      </div>
    );
  }
  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="mb-4 text-3xl font-semibold text-blue-600">
        Here are your properties
      </h2>
      <HotelList hotels={hotels} />
    </div>
  );
};

export default MyHotels;
