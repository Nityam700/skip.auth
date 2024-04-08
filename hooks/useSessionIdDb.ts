"use server"

import Session from "@/server/database/schema/session";
import { useSession } from "./useSession";
export async function useSessionInDb() {
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const user = useSession()
        const token = user?.tokenValue
        // await connectDatabase()
        // console.log("LOG FROM HOOKS/USESESSIONINDB");
        const sessionInDb = await Session.findOne({ token: token })
        // console.log(sessionInDb);
        return sessionInDb
    } catch (error) {
        console.log("NO USER SESSION FOUND IN THE DB /HOOKS/USESESSION", error);
    }
}