"use server"
import { connectDatabase } from "@/server/database/connect";
import User from "@/server/database/schema/user";
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs"
import Session from "@/server/database/schema/session";
import { ip } from "@/hooks/useSession";
import BlacklistedToken from "../database/schema/blackListedToken";
import { revalidatePath } from "next/cache";
import { useSession } from "@/hooks/useSession";
import { useSessionInDb } from "@/hooks/useSessionIdDb";



export async function getSessions() {
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const user = useSession()
        await connectDatabase()
        const userSessions = await Session.find({ username: user?.username })
        return userSessions
    } catch (error) {
        console.log(error);
    }
}

export async function sessionCount() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const user = useSession()

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
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const user = useSession()
        console.log("GOT THE SESSION INFO OF CURRENT USER" + user?.sessionId);

        const logoutType = formData.get('logoutType')
        console.log("LOGOUT TYPE = " + logoutType);

        if (logoutType === "CURRENT_SESSION") {
            try {
                await Session.findByIdAndDelete({ _id: user?.sessionId })
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

        if (logoutType === "VERIFY") {
            try {
                cookies().delete('User')
                console.log("LOGOUT VERIFY SUCCESS");
                return {
                    verificationInitiated: "Verification started"
                }
            } catch (error) {
                console.log("LOGOUT VERIFY ERROR");
                return {
                    verificationFailed: "Verification failed"
                }
            }
        }
        if (logoutType === "REVOKE") {
            try {
                console.log("LOGOUT TYPE = REVOKE INITIATED");
                console.log("DATA REQUIRED FOR REVOKING SESSION (GOT FROM FORM): ");

                const revokingSessionId = formData.get('revokingSessionId')
                console.log('REVOKING SESSION ID = ' + revokingSessionId);
                const revokingSessionToken = formData.get('revokingSessionToken')
                console.log("REVOKING SESSION TOKEN = " + revokingSessionToken);
                const username = formData.get('username')
                console.log("USER'S USERNAME = " + username);
                const userId = formData.get('userId')
                console.log("USERS USER ID = " + userId);

                // eslint-disable-next-line react-hooks/rules-of-hooks
                const user = useSession()
                if (user) {
                    console.log("USER SESSION FOUND. USERNAME = " + user.username);
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const session = await useSessionInDb()
                    if (session) {
                        console.log("ID GENERATED FOR BLACKLISTING TOKEN");
                        const revokeThisSession = await Session.findByIdAndDelete(revokingSessionId)
                        console.log(`SESSION ${revokingSessionId} IS REVOKED`);
                        return {
                            revokeSuccess: "Session Revoked"
                        }
                    } else {
                        console.log("USER'S SESSION IS REVOKED");
                        return {
                            sessionExpired: "You are not permitted do this. Your session is expired or revoked"
                        }
                    }
                }
            } catch (error) {
                console.log(error, "REVOKE FAILED");
                return {
                    RevokeError: "Failed to Revoke session"
                }
            }
        }
        // if (logoutType === "DELETE") {
        //     const revokedSessionId = formData.get('revokedSessionId')
        //     try {
        //         await Session.findByIdAndDelete(revokedSessionId)
        //         console.log("SESSION RELETED");
        //         return {
        //             deleteSuccess: "Revoked Session deleted"
        //         }
        //     } catch (error) {
        //         return {
        //             deleteError: "Failed to delete revoked session"
        //         }
        //     }
        // }
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