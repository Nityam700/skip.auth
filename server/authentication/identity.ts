"use server"
import { connectDatabase } from "@/server/database/connect";
import User from "@/server/database/schema/user";
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs"
import Session from "@/server/database/schema/session";
import { getBrowserCookie, ip } from "@/server/cookie/session";
import BlacklistedToken from "../database/schema/blackListedToken";
import { revalidatePath } from "next/cache";

export async function getBlackListedToken(token: string) {
    try {
        await connectDatabase();
        const blackListedToken = await BlacklistedToken.findOne({ token: token })
        // console.log("BLACKLISTED TOKEN = " + blackListedToken);
        return blackListedToken
    } catch (error) {
        console.log(error, "FAILED TO GET BLACKLISTED TOKEN");
    }
}

export async function getUserAllBlackListedToken() {
    try {
        const session = getBrowserCookie()
        const username = session.username
        await connectDatabase()
        const userBlaclistedToken = await BlacklistedToken.find({ username: username });
        // console.log("userBlaclistedToken = " + userBlaclistedToken);

        return userBlaclistedToken
    } catch (error) {
        console.log(error, "FAILED TO GET BLACKLISTED TOKEN");
    }
}

export async function getSessionInDb() {
    try {
        const session = getBrowserCookie()
        const id = session.sessionId
        console.log("SESSION ID = " + id);
        const sessionInDb = await Session.findById(id)
        console.log("SESSION IN DB = " + sessionInDb);
        return sessionInDb
    } catch (error) {
        console.log('NOTHING FOUND');
    }
}

export async function getSessions() {
    try {
        const user = getBrowserCookie()
        await connectDatabase()
        const userSessions = await Session.find({ username: user?.username })
        return userSessions
    } catch (error) {
        console.log(error);
    }
}

export async function sessionCount() {
    const user = getBrowserCookie()

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


export async function identity(formData: FormData) {


    const type = formData.get('type')
    console.log("IDENTITY TYPE = " + type);

    await connectDatabase();

    if (type === "CREATE") {
        console.log("ACCOUNT CREATION ATTEMPT REQUESTED");

        try {
            const username = formData.get('username');
            const password = formData.get('password') as string;

            console.log("FORM DATA ACCQIRED FOR USER CREATION PROCESS");

            const userExists = await User.findOne({ username: username })


            if (userExists) {
                console.log("USER ALREADY EXISTS WITH THE PROVIDED USERNAME");
                return {
                    userexists: `username ${username} is taken`
                }
            } else {
                const userId = uuidv4()
                console.log("A UNIQUE USER ID IS CREATED " + userId);
                const id = userId;
                const salt = await bcrypt.genSalt(10);
                const securePassword = await bcrypt.hash
                    (password, salt);
                console.log("PASSWORD HASHING COMPLETED " + securePassword);

                const user = new User({
                    _id: id,
                    username: username,
                    password: securePassword,
                });
                console.log("HERE IS NEW USER DATA = " + user);

                await user.save();
                console.log("NEW USER SAVED SUCCESSFULLY");
                await signUserJWT(user)

                return {
                    success: `Hi ${username} your account created successfully`
                }
            }

        } catch (error) {
            return {
                error: "Failed to create account"
            }
        }

    }

    if (type === "VERIFY") { }



    if (type === "SIGNIN") {
        console.log("SIGN IN ATTEMPT REQUESTED");

        const username = formData.get('username');
        const password = formData.get('password');

        console.log("FORM DATA ACCURIED FOR SIGN IN PROCESS");

        const user = await User.findOne({ username: username });

        if (user) {
            console.log("FOUND THE USER WITH THE PROVIDED USER NAME " + username);
            const validPassword = await bcrypt.compare(password as string, user?.password || "");

            if (validPassword) {
                console.log("PASSWORD IS VALIDATED");

                await signUserJWT(user)

                return {
                    signInSuccess: `Hi ${username} you are logged in now`
                }

            } else {
                console.log("INCORRECT CREDENTIALS (PASSWORD)");

                return {
                    incorrectPassword: "Incorrect credentials."
                }
            }
        } else {
            console.log(`USER ${username} IS NOT REGISTERED WITH US`);

            return {
                userDosentExists: `User ${username} is not registered with us`
            }
        }
    }


    if (type === "LOGOUT") {
        const session = getBrowserCookie()
        console.log("GOT THE SESSION INFO OF CURRENT USER" + session.sessionId);

        const logoutType = formData.get('logoutType')
        console.log("LOGOUT TYPE = " + logoutType);

        if (logoutType === "CURRENT_SESSION") {
            try {
                await Session.findByIdAndDelete({ _id: session.sessionId })
                console.log("DATABASE SESSION DELETED");
                cookies().delete('User')
                return {
                    logoutSuccess: "Logged out successfully"
                }
            } catch (error) {
                return {
                    logoutError: "Failed to logout"
                }
            }
        }
        if (logoutType === "DELETE") {
            console.log("LOGOUT TYPE = DELETE INITIATED");
            const id = formData.get('revokedSessionId')
            console.log("REVOKED SESSION ID = " + id);

            try {
                await BlacklistedToken.findByIdAndDelete(id)
                return {
                    deleteSuccess: "Successfully Deleted"
                }
            } catch (error) {
                return {
                    deleteError: "Failed to delete"
                }
            }
        }
        if (logoutType === "VERIFY") {
            try {
                cookies().delete('User')
                return {
                    logoutSuccess: "Logged out successfully"
                }
            } catch (error) {
                return {
                    logoutError: "Failed to logout"
                }
            }
        }
        if (logoutType === "REVOKE") {
            try {
                console.log("LOGOUT TYPE = REVOKE INITIATED");
                const revokingSessionId = formData.get('revokingSessionId')
                const revokingSessionToken = formData.get('revokingSessionToken')
                const username = formData.get('username')
                const userId = formData.get('userId')
                const blackListedTokenId = uuidv4();

                const revokeThisSession = await Session.findByIdAndDelete({ _id: revokingSessionId })
                console.log("THIS SESSION IS DELETED FRON THE DATABASE = " + revokeThisSession);
                const blaklistToken = await BlacklistedToken.create({
                    _id: blackListedTokenId,
                    username: username,
                    userId: userId,
                    token: revokingSessionToken
                });
                console.log("BLCKLISTED TOKEN DATA= " + blaklistToken);
                revalidatePath('/identity')

                return {
                    logoutSuccess: "Session Revoked"
                }
            } catch (error) {
                console.log(error, "REVOKE FAILED");

                return {
                    logoutError: "Failed to Revoke session"
                }
            }
        }
    }
}



async function signUserJWT(user: any) {
    console.log("SIGNING JWT TO THE USER");

    const sessionId = uuidv4();
    console.log("A UNIQUE SESSION ID IS CREATED " + sessionId);
    const userIp = await ip()
    console.log("GOT THE USER IP " + userIp);
    const tokenData = {
        _id: user._id,
        ip: userIp,
        sessionId: sessionId,
        username: user.username,
        role: user.role,
    }
    console.log("HERE IS TOKEN DATA:");
    console.log("USER ID = " + tokenData._id);
    console.log("USER IP = " + tokenData.ip);
    console.log("USER SESSION ID = " + tokenData.sessionId);
    console.log("USER USERNAME = " + tokenData.username);
    console.log("USER ROLE = " + tokenData.role);




    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })
    console.log("TOKEN GENERATED FOR USER WITH USER INFO (EXPIRES IN 1d) = " + token);
    const oneDay = 24 * 60 * 60;
    cookies().set('User', token, {
        httpOnly: true,
        // domain: ".vercel.app",
        secure: true,
        priority: 'high',
        path: '/',
        maxAge: oneDay,
        sameSite: 'strict',
    })
    console.log("COOKIE CREATED IN THE BROWSER WITH VALIDITY OF 1 DAY");

    const newSession = new Session({
        _id: sessionId,
        token: token,
        ipAddress: userIp,
        username: user.username,
        userId: user._id,
    })
    await newSession.save()
    revalidatePath('/identity')
    console.log("USER SESSION SUCCESSFULLY CREATED IN THE DATABASE WITH THE FOLLOWING DATA = " + newSession);

}