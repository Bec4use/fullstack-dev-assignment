"use client";

import { usePathname, useRouter } from "next/navigation";
import { HotelWithRooms } from "./AddHotelForm";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import { Dumbbell, MapPin, Waves } from "lucide-react";
import useLocation from "@/hook/useLocation";
import { Button } from "../ui/button";
import { FaPersonSwimming } from "react-icons/fa6";

const HotelCard = ({ hotel }: { hotel: HotelWithRooms }) => {
  const pathname = usePathname();
  const isMyHotels = pathname.includes("my-hotels");
  const router = useRouter();

  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country);

  return (
    <div
      onClick={() => !isMyHotels && router.push(`/hotel-details/${hotel.id}`)}
      className={cn(
        "col-span-1 cursor-pointer transition hover:scale-105",
        isMyHotels && "cursor-default"
      )}
    >
      <div className="flex bg-background/50 border border-primary/10 rounded-lg overflow-hidden">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
          <Image
            fill
            src={hotel.image}
            alt={hotel.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm pl-2">
          <h3 className="font-semibold text-xl line-clamp-2">{hotel.title}</h3>
          <div className="text-primary/90">
            {hotel.description.substring(0, 45)}...
          </div>
          <div className="text-primary/90 text-[11px] ml-1">
            <AmenityItem>
              <MapPin className="w-4 h-4 mb-2" /> {country?.name}, {hotel.city}
            </AmenityItem>
            {hotel.swimmingPool && (
              <AmenityItem>
                <FaPersonSwimming size={18} />
                Swimming Pool
              </AmenityItem>
            )}
            {hotel.gym && (
              <AmenityItem>
                <Dumbbell className="w-4 h-4" /> Gym
              </AmenityItem>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="text-primary/90 font-semibold text-xs ml-2 gap-1 flex">
                {hotel?.rooms[0]?.roomPrice && (
                  <>
                    <div className="font-semibold">
                      $
                      {Math.min(
                        ...(hotel?.rooms.map((room) => room.roomPrice) ?? [
                          Infinity,
                        ])
                      )}
                    </div>
                    <div className="text-[10px] text-primary/60">/24Hrs</div>
                  </>
                )}
              </div>
            </div>
            {isMyHotels && (
              <Button
                onClick={() => router.push(`/hotel/${hotel.id}`)}
                variant="outline"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
