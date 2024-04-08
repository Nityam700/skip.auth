"use server"

import { useSession } from "@/hooks/useSession"
import Session from "@/server/database/schema/session"

export async function getUserSessionsList() {
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const user = useSession()
        // await connectDatabase()
        // console.log("LOG FROM SERVER/DATABASE/DATA/AUTHENTICATION/ALLUSERSESSION");

        const userSessions = await Session.find({ username: user?.username })
        return userSessions
    } catch (error) {
        console.log(error);
    }
}
