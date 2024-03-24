"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import { useCurrentUser } from "@/hook/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import Link from "next/link";
import { Settings2Icon } from "lucide-react";
import { useState } from "react";

export const UserButton = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback>
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem onClick={() => setIsOpen(false)}>
          <Link href="/settings">
            <div className="flex">
              <Settings2Icon className="h-4 w-4 mr-2" />
              Setting
            </div>
          </Link>
        </DropdownMenuItem>
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
