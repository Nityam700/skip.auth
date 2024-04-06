"use server"

import Session from "@/server/database/schema/session";
import { useSession } from "./useSession";

export async function useSessionInDb() {
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const user = useSession()
        const token = user?.tokenValue
        console.log("SESSION TOKEN = " + token);
        const sessionInDb = await Session.findOne({ token: token })
        // console.log(sessionInDb);
        return sessionInDb
    } catch (error) {
        console.log('NOTHING FOUND');
    }
}