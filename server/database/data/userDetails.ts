"use server"

import { getSession } from "@/server/authentication/session"
import { connectDatabase } from "@/server/database/connect"
import Session from "@/server/database/schema/session"
import User from "@/server/database/schema/user"

export async function getProfile(username: string) {
    try {
        await connectDatabase()
        const profile = await User.findOne({ username: username })
        return profile
    } catch (error) {
        console.log(error);
    }
}

export async function isUserExists(username: string) {
    try {
        await connectDatabase()
        const response = await User.findOne({ username: username })
        return response
    } catch (error) {
        console.log(error);
    }
}

export async function getSessions() {
    try {
        const user = getSession()
        await connectDatabase()
        const userSessions = await Session.find({ username: user?.username })
        return userSessions
    } catch (error) {
        console.log(error);
    }
}

export async function sessionCount() {
    const user = getSession()

    if (user) {
        try {
            await connectDatabase()
            const userSessions = await Session.countDocuments({ username: user?.username })
            return userSessions
        } catch (error) {
            console.log(error);
        }
    }
}
