"use server"
import { useSession } from "@/hooks/useSession";
import { connectDatabase } from "@/server/database/connect"
import User from "@/server/database/schema/user"

export async function getProfile() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const user = useSession();

    try {
        await connectDatabase()
        console.log("LOG FROM database/data");

        const profile = await User.findOne({ username: user?.username! })
        return profile
    } catch (error) {
        console.log("PROFILE NOT FOUND");
    }
}




