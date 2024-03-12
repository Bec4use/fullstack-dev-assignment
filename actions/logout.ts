"use server";

import { signOut } from "@/auth";

export const logout = async () => {
    //Some sever stuff
    await signOut();
}