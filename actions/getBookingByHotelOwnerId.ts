import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getBookingsByHotelOwnerId = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const userId = user.id;

    const bookings = await db.booking.findMany({
      where: {
        NOT: {
          userId: userId,
        },
        hotelOwnerId: userId,
      },
      include: {
        Hotel: true,
        Room: true,
      },
      orderBy: {
        bookedAt: "desc",
      },
    });

    if (!bookings) {
      throw new Error("No bookings found");
    }

    return bookings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};
