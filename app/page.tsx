import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main
      className="flex h-full flex-col items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%),
        linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%),
        url('/background.jpg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100vh",
      }}
    >
      <div className="space-y-6 text-center p-4">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md flex items-center justify-center space-x-2",
            font.className
          )}
        >
          <div
            style={{
              filter: "drop-shadow(6px 6px 6px white)",
            }}
          >
            <Image
              src="/dark-logo-hotel.png"
              alt="logo"
              width={300}
              height={100}
            />
          </div>
        </h1>
        <p className="text-white text-lg max-w-[620px] font-semibold leading-relaxed  p-4 rounded-lg shadow-lg backdrop-filter backdrop-blur-md">
          <span className="block mb-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Welcome to our hotel booking platform.
          </span>
          Effortlessly find and book your next stay from a wide range of hotels.
          Enjoy detailed room information and secure online payment. Plan your
          unforgettable stay with us.
        </p>
        <div>
          <LoginButton mode="modal" asChild>
            <Button variant="outline" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
