"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
    const role = await currentRole();

    if (role === UserRole.ADMIN) {
        return { success : "Allowed Sever Action!"};
    }

    return { error: "Forbidden Sever Action!"}
};