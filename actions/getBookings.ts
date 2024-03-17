import { db } from "@/lib/db";

export const getBookings = async (hotelId: string) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await db.booking.findMany({
      where: {
        hotelId,
        endDate: {
          gt: yesterday,
        },
      },
    });

    return bookings;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
