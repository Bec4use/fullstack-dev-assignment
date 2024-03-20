"use client";

import * as z from "zod";
import { Hotel, Room } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadButton } from "../uploadthing";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  Eye,
  Loader2,
  PackagePlus,
  PencilLine,
  Terminal,
  Trash,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import { ICity, IState } from "country-state-city";
import useLocation from "@/hook/useLocation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddRoomForm from "../room/AddRoomForm";
import RoomCard from "../room/RoomCard";
import { Separator } from "../ui/separator";
import { CiDumbbell } from "react-icons/ci";
import { PiWineFill } from "react-icons/pi";
import {
  FaCar,
  FaCartShopping,
  FaPersonSwimming,
  FaSpa,
  FaWifi,
} from "react-icons/fa6";
import {
  MdOutlineLocalLaundryService,
  MdOutlineRestaurant,
  MdDirectionsBike,
} from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { GiPartyPopper, GiDiamondRing } from "react-icons/gi";
import { RiMovie2Fill } from "react-icons/ri";
import { SiBuymeacoffee } from "react-icons/si";
import { BiSolidPlaneAlt } from "react-icons/bi";
import image from "next/image";
interface AddHotelFormProps {
  hotel: HotelWithRooms | null;
}

export type HotelWithRooms = Hotel & {
  rooms: Room[];
};

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters long",
  }),
  image: z.string().min(1, {
    message: "Please provide an image",
  }),
  country: z.string().min(1, {
    message: "Please provide a country",
  }),
  state: z.string().optional(),
  city: z.string().optional(),
  locationDescription: z.string().min(10, {
    message: "Location description must be at least 10 characters long",
  }),
  gym: z.boolean().optional(),
  spa: z.boolean().optional(),
  bar: z.boolean().optional(),
  laundry: z.boolean().optional(),
  restaurant: z.boolean().optional(),
  shopping: z.boolean().optional(),
  freeParking: z.boolean().optional(),
  bikeRental: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  movieNights: z.boolean().optional(),
  swimmingPool: z.boolean().optional(),
  coffeeShop: z.boolean().optional(),
  multipurposeRoom: z.boolean().optional(),
  conferenceRoom: z.boolean().optional(),
  airportShuttle: z.boolean().optional(),
  weddingservice: z.boolean().optional(),
});
const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openAddRoom, setOpenAddRoom] = useState(false);
  const [isHotelDeleting, setIsHotelDeleting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const { getAllCountries, getCountryStates, getStateCities } = useLocation();
  const countries = getAllCountries();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: hotel || {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      locationDescription: "",
      gym: false,
      spa: false,
      bar: false,
      laundry: false,
      restaurant: false,
      shopping: false,
      freeParking: false,
      bikeRental: false,
      freeWifi: false,
      movieNights: false,
      swimmingPool: false,
      coffeeShop: false,
      multipurposeRoom: false,
      conferenceRoom: false,
      airportShuttle: false,
      weddingservice: false,
    },
  });

  const fields: {
    name:
      | "gym"
      | "spa"
      | "bar"
      | "laundry"
      | "restaurant"
      | "shopping"
      | "freeParking"
      | "bikeRental"
      | "freeWifi"
      | "movieNights"
      | "swimmingPool"
      | "coffeeShop"
      | "multipurposeRoom"
      | "conferenceRoom"
      | "airportShuttle"
      | "weddingservice";
    label: string;
    icon?: ReactNode;
  }[] = [
    { name: "gym", label: "Gym", icon: <CiDumbbell size={20} /> },
    { name: "spa", label: "Spa", icon: <FaSpa size={20} /> },
    { name: "bar", label: "Bar", icon: <PiWineFill size={20} /> },
    {
      name: "laundry",
      label: "Laundry",
      icon: <MdOutlineLocalLaundryService size={20} />,
    },
    {
      name: "restaurant",
      label: "Restaurant",
      icon: <MdOutlineRestaurant size={20} />,
    },
    { name: "shopping", label: "Shopping", icon: <FaCartShopping size={20} /> },
    { name: "freeParking", label: "Free Parking", icon: <FaCar size={20} /> },
    {
      name: "bikeRental",
      label: "Bike Rental",
      icon: <MdDirectionsBike size={20} />,
    },
    { name: "freeWifi", label: "Free Wifi", icon: <FaWifi size={20} /> },
    {
      name: "movieNights",
      label: "Movie Nights",
      icon: <RiMovie2Fill size={20} />,
    },
    {
      name: "swimmingPool",
      label: "Swimming Pool",
      icon: <FaPersonSwimming size={20} />,
    },
    {
      name: "coffeeShop",
      label: "Coffee Shop",
      icon: <SiBuymeacoffee size={20} />,
    },
    {
      name: "multipurposeRoom",
      label: "Multipurpose Room",
      icon: <GiPartyPopper size={20} />,
    },
    {
      name: "conferenceRoom",
      label: "Conference Room",
      icon: <IoIosPeople size={20} />,
    },
    {
      name: "airportShuttle",
      label: "Airport Shuttle",
      icon: <BiSolidPlaneAlt size={20} />,
    },
    {
      name: "weddingservice",
      label: "Wedding Service",
      icon: <GiDiamondRing size={20} />,
    },
  ];

  useEffect(() => {
    if (typeof image === "string" && form.watch("image") !== image) {
      form.setValue("image", image, {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
    }
  }, [image, form]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedState = form.watch("state");
    const stateCities = getStateCities(selectedCountry, selectedState);
    if (stateCities) {
      setCities(stateCities);
    }
  }, [form.watch("country"), form.watch("state")]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (hotel) {
      axios
        .put(`/api/hotel/${hotel.id}`, values)
        .then((res) => {
          if (res.data) {
            toast({
              variant: "success",
              description: "Hotel updated successfully",
            });
            router.push(`/hotel/${res.data.id}`);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: `ERROR! ${error.message}`,
          });
          setIsLoading(false);
        });
    } else {
      axios
        .post("/api/hotel", values)
        .then((res) => {
          if (res.data) {
            toast({
              variant: "success",
              description: "Hotel created successfully",
            });
            router.push(`/hotel/${res.data.id}`);
            setIsLoading(false);
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: `ERROR! ${error.message}`,
          });
          setIsLoading(false);
        });
    }
  }

  const handleDeleteHotel = async (hotel: HotelWithRooms) => {
    setIsHotelDeleting(true);
    const getImageKey = (src: string) =>
      src.substring(src.lastIndexOf("/") + 1);

    try {
      const imageKey = getImageKey(hotel.image);
      await axios.post("/api/uploadthing/delete", { imageKey });
      await axios.delete(`/api/hotel/${hotel.id}`);

      setIsHotelDeleting(false);
      toast({
        variant: "success",
        description: "Hotel deleted successfully",
      });
      router.push("/hotel/new");
    } catch (error: any) {
      console.log("Error deleting hotel", error);
      setIsHotelDeleting(false);
      toast({
        variant: "destructive",
        description: `ERROR! ${error.message}`,
      });
    }
  };

  const handleImageDelete = async (image: string) => {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast({
            variant: "success",
            description: "Image deleted successfully",
          });
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: `ERROR! ${error.message}`,
        });
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  };

  const handleDialogOpen = () => {
    setOpenAddRoom((prev) => !prev);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {hotel ? "Update your Hotel!" : "Describe your Hotel!"}
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Title</FormLabel>
                    <FormDescription>
                      Provide a title for your hotel, this will be the name of
                      your
                    </FormDescription>
                    <FormControl>
                      <Input placeholder="Beach Hotel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Description</FormLabel>
                    <FormDescription>
                      Describe your hotel in a few words
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="A beautiful hotel by the beach"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Choose Amenities for your Hotel</FormLabel>
                <FormDescription>
                  Choose the amenities your hotel offers
                </FormDescription>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {fields.map((fieldData) => (
                    <FormField
                      key={fieldData.name}
                      control={form.control}
                      name={fieldData.name}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 rounded-md p-4 border">
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex items-center flex-row">
                            <FormLabel className="flex flex-row">
                              <div className="mr-2 pb-2">{fieldData.icon}</div>
                              <div className="pt-1">{fieldData.label}</div>
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3">
                    <FormLabel>Upload an Image of your Hotel</FormLabel>
                    <FormDescription>
                      Provide an image for your hotel
                    </FormDescription>
                    <FormControl>
                      {image ? (
                        <>
                          <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                            <Image
                              fill
                              src={image}
                              alt="Hotel Image"
                              className="object-contain"
                            />
                            <Button
                              onClick={() => handleImageDelete(image)}
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-[-12px] top-0"
                            >
                              {imageIsDeleting ? (
                                <Bars
                                  width={30}
                                  height={30}
                                  color="BlueViolet"
                                  visible
                                />
                              ) : (
                                <XCircle />
                              )}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {
                                console.log("Files", res);
                                setImage(res[0].url);
                                toast({
                                  variant: "success",
                                  description: "Image uploaded successfully",
                                });
                              }}
                              onUploadError={(error: Error) => {
                                toast({
                                  variant: "destructive",
                                  description: `ERROR! ${error.message}`,
                                });
                              }}
                            />
                          </div>
                        </>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country</FormLabel>
                      <FormDescription>
                        Select the country where your hotel is located
                      </FormDescription>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a country"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select State</FormLabel>
                      <FormDescription>
                        Select the state where your hotel is located
                      </FormDescription>
                      <Select
                        disabled={isLoading || states.length < 1}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a state"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem
                              key={state.isoCode}
                              value={state.isoCode}
                            >
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select City</FormLabel>
                    <FormDescription>
                      Select the city where your hotel is located
                    </FormDescription>
                    <Select
                      disabled={isLoading || cities.length < 1}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a city"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description</FormLabel>
                    <FormDescription>
                      Provide a detailed description of the location of your
                      hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Located in the heart of the city"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {hotel && !hotel.rooms.length && (
                <Alert className="flex flex-col gap-2 p-4 bg-primary/20 rounded-md">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>
                    One last step! Add rooms to your hotel
                  </AlertTitle>
                  <AlertDescription>
                    Your hotel needs rooms !
                    <div>Please add rooms to your hotel to get started</div>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-between gap-2 flex-wrap">
                {hotel && (
                  <Button
                    onClick={() => handleDeleteHotel(hotel)}
                    variant="ghost"
                    type="button"
                    className="max-w-[150px]"
                    disabled={isHotelDeleting || isLoading}
                  >
                    {isHotelDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" />
                        Deleting
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                )}

                {hotel && (
                  <Button
                    onClick={() => router.push(`/hotel-details/${hotel.id}`)}
                    variant="ghost"
                    type="button"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Hotel
                  </Button>
                )}

                {hotel && (
                  <Dialog open={openAddRoom} onOpenChange={setOpenAddRoom}>
                    <DialogTrigger>
                      <Button variant="ghost" type="button">
                        <PackagePlus className="mr-2 h-4 w-4" />
                        Add Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[900px] w-[90%]">
                      <DialogHeader className="px-2">
                        <DialogTitle>Update Rooms</DialogTitle>
                        <DialogDescription>
                          Update the rooms in your hotel
                        </DialogDescription>
                      </DialogHeader>
                      <AddRoomForm
                        hotel={hotel}
                        handleDialogOpen={handleDialogOpen}
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {hotel ? (
                  <Button disabled={isLoading} className="max-w-[150px]">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" />
                        Updating
                      </>
                    ) : (
                      <>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Update Hotel
                      </>
                    )}
                  </Button>
                ) : (
                  <Button disabled={isLoading} className="max-w-[150px]">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4" />
                        Creating
                      </>
                    ) : (
                      <>
                        <PencilLine className="mr-2 h-2 w-4" />
                        Create Hotel
                      </>
                    )}
                  </Button>
                )}
              </div>
              {hotel && !!hotel.rooms.length && (
                <div>
                  <Separator />
                  <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2  gap-6">
                    {hotel.rooms.map((room) => {
                      return (
                        <RoomCard key={room.id} hotel={hotel} room={room} />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
