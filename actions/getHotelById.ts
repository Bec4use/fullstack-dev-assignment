import { db } from "@/lib/db";

export const getHotelById = async (hotelId: string) => {
  try {
    const hotel = await db.hotel.findUnique({
      where: {
        id: hotelId,
      },
      include: {
        rooms: true,
      },
    });

    // if (!hotel) throw new Error("Hotel not found");

    return hotel;
  } catch (error: any) {
    throw new Error(error);
  }
};
