"use client";

import Container from "../Container";
import SeachInput from "../SeachInput";
import { UserButton } from "../auth/user-button";
import Image from "next/image";
import { ThemeToggle } from "../theme-toggle";
import { NavMenuToggle } from "./NavMenu";
import { useTheme } from "next-themes";

const NavBar = () => {
  const { theme } = useTheme();
  return (
    <div className="sticky top-0 border-b z-50 shadow-md py-2 px-4 xl:px-0 transition-all duration-300 ease-in-out backdrop-filter backdrop-blur-md">
      <Container>
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <Image src="/logo.svg" alt="logo" width={30} height={30} /> */}
            <a href="/homepage" className="text-xl font-bold">
              <div
                style={{ backgroundColor: "transparent" }}
                className=" flex items-center"
              >
                <Image
                  src={
                    theme === "dark" || theme === "system"
                      ? "/dark-logo.png"
                      : "/light-logo.png"
                  }
                  alt="Banner"
                  width={165}
                  height={60}
                />
                <div></div>
              </div>
            </a>
          </div>
          <SeachInput />
          <div className="flex gap-3 items-center justify-center">
            <div className="flex items-center justify-center">
              <ThemeToggle />
              <NavMenuToggle />
            </div>

            <div>
              <UserButton />
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
};

export default NavBar;
