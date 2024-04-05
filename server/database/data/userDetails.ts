"use server"
import { getBrowserCookie } from "@/server/cookie/session";
import { connectDatabase } from "@/server/database/connect"
import User from "@/server/database/schema/user"

export async function getProfile() {
    const user = getBrowserCookie();

    try {
        await connectDatabase()
        console.log("LOG FROM database/data");

        const profile = await User.findOne({ username: user?.username! })
        return profile
    } catch (error) {
        console.log("PROFILE NOT FOUND");
    }
}




