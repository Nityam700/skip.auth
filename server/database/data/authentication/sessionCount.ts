"use server"

import Session from "@/server/database/schema/session";

export async function userSessionCount(username: string) {
    try {
        // await connectDatabase()
        // console.log("LOG FROM SERVER/DATABASE/DATA/AUTHENTICATION/SESSIONCOUNT.TS");
        const userSessionCount = await Session.countDocuments({ username: username })
        return userSessionCount
    } catch (error) {
        console.log(error);
    }
}