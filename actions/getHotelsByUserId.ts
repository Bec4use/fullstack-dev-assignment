import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getHotelsByUserId = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const userId = user.id;

    const hotels = await db.hotel.findMany({
      where: {
        userId,
      },
      include: {
        rooms: true,
      },
    });

    if (!hotels) return null;

    return hotels;
  } catch (error: any) {
    throw new Error(error);
  }
};
