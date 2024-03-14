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
      <div className="space-y-6 text-center p-4 rounded-lg shadow-lg bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
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
        <p className="text-white text-lg">
          Book your next hotel stay with us and get the best experience
        </p>
        <div>
          <LoginButton mode="modal" asChild>
            <Button variant="default" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
