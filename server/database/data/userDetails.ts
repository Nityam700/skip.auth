"use server"
import { getBrowserCookie } from "@/server/authentication/session";
import { connectDatabase } from "@/server/database/connect"
import User from "@/server/database/schema/user"

export async function getProfile() {
    const user = getBrowserCookie();

    try {
        await connectDatabase()
        const profile = await User.findOne({ username: user?.username! })
        console.log(profile);

        return profile
    } catch (error) {
        console.log("PROFILE NOT FOUND");
    }
}



// export async function isUserExists(username: string) {
//     try {
//         await connectDatabase()
//         const response = await User.findOne({ username: username })
//         return response
//     } catch (error) {
//         console.log(error);
//     }
// }

