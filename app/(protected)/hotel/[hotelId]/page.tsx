import { getHotelById } from "@/actions/getHotelById";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { currentUser } from "@/lib/auth";

interface HotelPageProps {
  params: {
    hotelId: string;
  };
}

const Hotel = async ({ params }: HotelPageProps) => {
  const hotel = await getHotelById(params.hotelId);
  const user = await currentUser();

  if (!user?.id) return <div>Not authenticated...</div>;

  if (hotel && hotel.userId !== user.id) return <div>Access denied</div>;

  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  );
};

export default Hotel;
