"use server"
import { connectDatabase } from "@/server/database/connect";
import User from "@/server/database/schema/user";
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs"
import Session from "@/server/database/schema/session";
import { getBrowserCookie, ip } from "@/server/authentication/session";


export async function identity(formData: FormData) {


    const type = formData.get('type')
    console.log("IDENTITY TYPE = " + type);

    await connectDatabase();

    if (type === "CREATE") {
        console.log("ACCOUNT CREATION ATTEMPT REQUESTED");

        try {
            const userId = uuidv4()
            console.log("A UNIQUE USER ID IS CREATED " + userId);
            const id = userId;
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
                const salt = await bcrypt.genSalt(10);
                const securePassword = await bcrypt.hash
                    (password, salt);
                console.log("PASSWORD HASHING COMPLETED " + securePassword);

                const newUser = new User({
                    _id: id,
                    username: username,
                    password: securePassword,
                });
                console.log("HERE IS NEW USER DATA = " + newUser);

                await newUser.save();
                console.log("NEW USER SAVED SUCCESSFULLY");

                return {
                    success: `Account created successfully. Sign in to continue`
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
                console.log("PASSWORD VALIDITY CHECKED " + validPassword);
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
                console.log("TOKEN GENERATED FOR USER WITH USER INFO (EXPIRES IN 1m) = " + token);
                const oneDay = 24 * 60 * 60;
                cookies().set('User', token, {
                    httpOnly: true,
                    domain: "localhost",
                    secure: true,
                    priority: 'high',
                    path: '/',
                    maxAge: oneDay,
                    sameSite: 'strict',
                })
                console.log("COOKIE CREATED IN THE BROWSER WITH VALIDITY OF 1 DAY");


                await Session.create({
                    _id: sessionId,
                    ipAddress: userIp,
                    username: user.username,
                });
                console.log("USER SESSION SUCCESSFULLY CREATED IN THE DATABASE");

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
        console.log("GOT THE SESSION INFO OF CURRENT USER" + session);

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
}

