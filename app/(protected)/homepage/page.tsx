import { getHotels } from "@/actions/getHotels";
import LocationFilter from "@/components/LocationFilter";
import HotelList from "@/components/hotel/HotelList";

interface HomeProps {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const hotels = await getHotels(searchParams);

  if (!hotels) {
    return <div>There are no hotels available</div>;
  }
  return (
    <div>
      <LocationFilter />
      <HotelList hotels={hotels} />
    </div>
  );
}
