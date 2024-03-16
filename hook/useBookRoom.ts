import { Room } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoomDatatype = {
  room: Room;
  totalPrice: number;
  breakFastIncluded: boolean;
  startDate: Date;
  endDate: Date;
};

interface BookRoomStore {
  bookingRoomData: RoomDatatype | null;
  paymentIntent: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDatatype) => void;
  setPaymentIntent: (paymentIntent: string) => void;
  setClientSecret: (clientSecret: string) => void;
  resetBookRoom: () => void;
}

const useBookRoom = create<BookRoomStore>()(
  persist(
    (set) => ({
      bookingRoomData: null,
      paymentIntent: null,
      clientSecret: undefined,
      setRoomData: (data: RoomDatatype) => set({ bookingRoomData: data }),
      setPaymentIntent: (paymentIntent: string) => set({ paymentIntent }),
      setClientSecret: (clientSecret: string) => set({ clientSecret }),
      resetBookRoom: () => {
        set({
          bookingRoomData: null,
          paymentIntent: null,
          clientSecret: undefined,
        });
      },
    }),
    {
      name: "BookRoom",
    }
  )
);

export default useBookRoom;
