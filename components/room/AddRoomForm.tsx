"use client";

import * as z from "zod";
import { Hotel, Room } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  AirVent,
  Fence,
  HandPlatter,
  Loader2,
  Monitor,
  MountainSnow,
  PencilLine,
  Ship,
  Telescope,
  Trees,
  VolumeX,
  Wifi,
  XCircle,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Bars } from "react-loader-spinner";
import { Button } from "../ui/button";
import Image from "next/image";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { UploadButton } from "../uploadthing";
import { useRouter } from "next/navigation";

interface AddRoomFormProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room?: Room;
  handleDialogOpen: () => void;
}

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long!" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long!" }),
  bedCount: z.coerce
    .number()
    .min(1, { message: "Bed count must be at least 1!" }),
  guestCount: z.coerce
    .number()
    .min(1, { message: "Guest count must be at least 1!" }),
  bathroomCount: z.coerce
    .number()
    .min(1, { message: "Bathroom count must be at least 1!" }),
  kingBed: z.coerce.number().min(0),
  queenBed: z.coerce.number().min(0),
  image: z.string().min(1, { message: "Image is required!" }),
  breakFastPrice: z.coerce.number().optional(),
  roomPrice: z.coerce
    .number()
    .min(1, { message: "Room price must be at least 1!" }),
  roomService: z.boolean().optional(),
  TV: z.boolean().optional(),
  balcony: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  cityView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  forestView: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  airConditioned: z.boolean().optional(),
  soundProofed: z.boolean().optional(),
});

const AddRoomForm = ({ hotel, room, handleDialogOpen }: AddRoomFormProps) => {
  const [image, setImage] = useState<string | undefined>(room?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: room || {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      queenBed: 0,
      image: "",
      breakFastPrice: 0,
      roomPrice: 0,
      roomService: false,
      TV: false,
      balcony: false,
      freeWifi: false,
      cityView: false,
      oceanView: false,
      forestView: false,
      mountainView: false,
      airConditioned: false,
      soundProofed: false,
    },
  });

  const fields: {
    name:
      | "roomService"
      | "TV"
      | "balcony"
      | "freeWifi"
      | "cityView"
      | "oceanView"
      | "forestView"
      | "mountainView"
      | "airConditioned"
      | "soundProofed";
    label: string;
    icon?: ReactNode;
  }[] = [
    { name: "roomService", label: "24hrs Room Service", icon: <HandPlatter /> },
    { name: "TV", label: "TV", icon: <Monitor /> },
    { name: "balcony", label: "Balcony", icon: <Fence /> },
    { name: "freeWifi", label: "Free Wifi", icon: <Wifi /> },
    { name: "cityView", label: "City View", icon: <Telescope /> },
    { name: "oceanView", label: "Ocean View", icon: <Ship /> },
    { name: "forestView", label: "Forest View", icon: <Trees /> },
    { name: "mountainView", label: "Mountain View", icon: <MountainSnow /> },
    { name: "airConditioned", label: "Air Conditioned", icon: <AirVent /> },
    { name: "soundProofed", label: "Sound Proofed", icon: <VolumeX /> },
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    if (hotel && room) {
      axios
        .put(`/api/room/${room.id}`, values)
        .then((res) => {
          if (res.data) {
            toast({
              variant: "success",
              description: "Room updated successfully",
            });
            router.refresh();
            setIsLoading(false);
            handleDialogOpen();
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
      if (!hotel) {
        return;
      }
      axios
        .post("/api/room", { ...values, hotelId: hotel.id })
        .then((res) => {
          if (res.data) {
            toast({
              variant: "success",
              description: "Room created successfully",
            });
            router.refresh();
            setIsLoading(false);
            handleDialogOpen();
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

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Title</FormLabel>
                <FormDescription>Provide a title for the room</FormDescription>
                <FormControl>
                  <Input placeholder="Room Title" {...field} />
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
                <FormLabel>Room Description</FormLabel>
                <FormDescription>
                  Is there anything special about this room?
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Have a beautiful view of the ocean while in this room!"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Room Details</FormLabel>
            <FormDescription>What makes this room special?</FormDescription>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {fields.map((fieldData) => (
                <FormField
                  key={fieldData.name}
                  control={form.control}
                  name={fieldData.name}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
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
                <FormLabel>Upload Room Image</FormLabel>
                <FormDescription>
                  Choose an image that best represents the room
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
          <div className="flex flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="roomPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Room Price in USD{" "}
                      <span className="text-sm">(per night)</span>
                    </FormLabel>
                    <FormDescription>
                      How much does it cost to book this room for 24 hours?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Beds</FormLabel>
                    <FormDescription>
                      How many beds are in the room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Capacity</FormLabel>
                    <FormDescription>
                      How many guests can the room accommodate?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathroom Count</FormLabel>
                    <FormDescription>
                      How many bathrooms are in the room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={20} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="breakFastPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Breakfast Price in USD{" "}
                      <span className="text-sm">(per person)</span>
                    </FormLabel>
                    <FormDescription>
                      How much does it cost to have breakfast in the room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kingBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>King Size Beds</FormLabel>
                    <FormDescription>
                      How many king size beds are in the room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="queenBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queen Size Beds</FormLabel>
                    <FormDescription>
                      How many queen size beds are in the room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="pt-4 pb-2">
            {room ? (
              <Button
                disabled={isLoading}
                className="max-w-[150px]"
                type="button"
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Updating
                  </>
                ) : (
                  <>
                    <PencilLine className="mr-2 h-4 w-4" />
                    Update Room
                  </>
                )}
              </Button>
            ) : (
              <Button
                disabled={isLoading}
                className="max-w-[150px]"
                type="button"
                onClick={form.handleSubmit(onSubmit)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Creating
                  </>
                ) : (
                  <>
                    <PencilLine className="mr-2 h-2 w-4" />
                    Create Room
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
