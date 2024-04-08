"use server"
import User from "@/server/database/schema/user";
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs"
import Session from "@/server/database/schema/session";
import { ip } from "@/hooks/useSession";
import { revalidatePath } from "next/cache";
import { useSession } from "@/hooks/useSession";
import { useSessionInDb } from "@/hooks/useSessionIdDb";
import { sendMail } from "../mail/mail";
import { customAlphabet } from 'nanoid'
import PendingUser from "@/server/database/schema/otp";
// import { sendLoginNotification } from "../mail/loginNotification";
import { sendAccountCreatedMail } from "../mail/accountCreated";







export async function identity(formData: FormData) {


    const type = formData.get('type')
    console.log('\x1b[32m%s\x1b[0m', "IDENTITY TYPE = ", type);

    if (type === "CREATE") {
        /* SIGNIN METHOD INITIATED. LOG THE DATA */
        console.log("SIGN IN METHOD INITIATED");

        /* FORM DATA OR USER INPUTS */
        const createType = formData.get('createType');
        /* PRINTING THE DATA IN THE CONSOLE */
        console.log("CREATE TYPE = " + createType);

        const username = formData.get('username') as string;
        /* PRINTING THE DATA IN THE CONSOLE */
        console.log("USER USERNAME = " + username);

        const email = formData.get('email') as string;
        /* PRINTING THE DATA IN THE CONSOLE */
        console.log("USER EMAIL = " + email);

        const password = formData.get('password') as string;
        /* PRINTING THE DATA IN THE CONSOLE */
        console.log("USER PASSWORN = " + password);

        if (createType === "IDENTITY_CREATE") {
            /* CHECK THE DB IF THE PROVIDED CREDENTIALS ALREADY EXISTS IN THE DATABASE */
            /* CHECKING FOR USERNAME */
            const usernameCheck = await User.findOne({ username: username });
            /* LOGGING THE DATA */
            console.log("USERNAME = ", usernameCheck?.username);
            /* CHECKING FOR EMAIL */
            const EmailCheck = await User.findOne({ email: email });
            /* LOGGING THE DATA */
            console.log("EMAIL = ", EmailCheck?.email);

            if (EmailCheck || usernameCheck) {
                /* IF USER EXISTS WITH THE PROVIDED CREDENTIALS THEN RETURN MESSAGE THAT USERNAME OR EMAIL IS ALREADY REGISTERED */
                console.log("USER ALREADY EXISTS WITH THE PROVIDED CREDENTIAL");
                /* SENDING THE MESSAGE TO THE USER OR FRONTEND */
                return {
                    userexists: `hey! either username ${username} or email ${email} is taken`
                }
            } else {
                /* IF USERNAME OR EMAIL DOES NOT EXISTS IN THE DATABASE THEN CONTINUE THE IDENTITY_CREATE PROCESS. */
                /* GENERATE THE OTP */
                const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 5);
                const otp = nanoid();
                /* SAVE THE OTP IN THE DATABASE ALONG WITH USER'S USERNAME EMAIL AND PASSWORD. THESE DATA WILL BE REQUIRED DURING VERIFICATION PROCESS */
                try {
                    /* GENERATE OTP DOCUMENT ID FOR MONGODB */
                    const pendingUserDocID = uuidv4();
                    /* HASH THE PASSWORD. IT WILL BE FIRST STORED IN THE PENDIG USER DOCUMENT THEN PASSED TO THE USER DOCUMENT */
                    const salt = await bcrypt.genSalt(10);
                    const securePassword = await bcrypt.hash
                        (password, salt);
                    /* PENDING USER DOCUMENT DATA ...TO BE SAVED IN DATABASE */
                    const pendingUser = new PendingUser({
                        _id: pendingUserDocID,
                        otp: otp,
                        username: username,
                        email: email,
                        password: securePassword,
                    });
                    /* SAVE THE PENDING USER DATA IN THE DATABASE */
                    await pendingUser.save();

                } catch (error) {
                    /* CATCH ERROR WHICH OCCURS DURING SAVING PENDING USER DOCUMENT IN THE DATABASE */
                    console.log("FAILED TO SAVE THE OTP IN THE DATABASE", error);
                    /* RETURN A MESSAGE TO THE FRONTEND WITH MESSAGE THAT OTP ALREADY SENT */
                    return {
                        verificationOtpAlreadySent: `Hi ${username} an otp is already sent to your email ${email}. Make sure to check the spam or junk folder`
                    };
                };
                /* SEND EMAIL FOR VERIFICATION */
                try {
                    /* SEND THE MAIL TO THE USER WITH OTP FOR VERIFICATION */
                    sendMail(email, otp, username);
                    /* MAIL IS SENT RETURN THIS MESSAGE TO THE FRONTEND */
                    return {
                        verificationOtpSent: `Hi ${username} an otp is sent to your ${email}. Use that to verify your identity.`
                    }
                } catch (error) {
                    return {
                        failedToSendVerificationOtp: `Hi ${username} an error occured during verification process`
                    }
                }
            };
        };

        if (createType === "IDENTITY_VERIFY_CREATE") {
            /* GET THE USER ENTERED OTP FROM THE FORM */
            const otp = formData.get('otp');
            /* FIND THE PENDING USER DOCUMENT FROM THE DATABASE WITH THE 'OTP' */
            const validOTP = await PendingUser.findOne({ otp: otp });
            /* IF A DOCUMENT IS FOUND WITH THAT OTP THAT MEANS OTP IS CORRECT SIGN IN THE USER ASSIGN THE USER JWT */
            if (validOTP) {
                /* NOW CREATE THE USER DOCUMENT IN THE DATABASE. THEN STORE THE COOKIE IN THE BROWSER AND CREATE A SESSION DOCUMENT IN THE DATABASE THEN DELETE THAT PENDING USER DOCUMENT FROM THE DATABASE */
                /* STORE THE PENDING USER DATA IN THE USER VARIABLE */
                const user = await PendingUser.findOne({ otp: otp });
                /* CREATE THE USER DOCUMENT IN THE DATABASE */
                /* GENERATE THE UNIQUE USER ID */
                const userID = uuidv4();
                /* GET THE PASSWORD FROM THE PENDING USER DOCUMENT */
                const password = user.password;
                /* GET THE email FROM THE PENDING USER DOCUMENT */
                const email = user.email;
                /* GET THE username FROM THE PENDING USER DOCUMENT */
                const username = user.username;
                /* CREATE A NEW USER DOCUMENT WITH THE ABOVE DATA */
                const newUser = new User({
                    _id: userID,
                    username: username,
                    email: email,
                    password: password,
                });
                /* SAVE THE NEW USER IN THE DOCUMENT */
                await newUser.save();
                /* ASSIGN THE JWT */
                await signUserJWT(newUser);
                /* SEND EMAIL TO CLIENR */
                // await sendAccountCreatedMail(email, username)
                /* DELETE THE PENDING USER DOCUMENT FROM THE DATABASE */
                await PendingUser.findByIdAndDelete(validOTP._id)
                /* LOG THE MESSAGE TO THE CONSOLE THAT SIGN IN IS SUCCESS. ALSO RETURN A MESSAGE TO THE FRONTENT */
                console.log(`Hi ${user.username} your account is created`);
                /* RETURNING THE MESSAGE TO THE FRONTEND */
                return {
                    accountCreatedSuccess: `Hi ${user.username} your account is created`
                }
            } else {
                /* LOG THE ERROR THAT NO DOCUMENT IN THE DATABASE IS FOUND WITH THE USER ENTERED OTP */
                console.log("Incorrect OTP");
                /* RETURNING MESSAGE TO THE FRONTEND */
                return {
                    invalidVerificationOTP: "Incorrect OTP"
                }
            }
        };

    };

    /* LOGIC FOR SIGN IN METHOD */
    if (type === "SIGNIN") {
        /* SIGNIN METHOD INITIATED. LOG THE DATA */
        console.log("SIGN IN METHOD INITIATED");

        /* FORM DATA OR USER INPUTS */
        const signInType = formData.get('signInType');
        /* PRINTING THE DATA IN THE CONSOLE */
        console.log("SIGN IN TYPE = " + signInType);

        const username = formData.get('username') as string;
        /* PRINTING THE DATA IN THE CONSOLE */
        console.log("USERNAME = " + username);

        const password = formData.get('password');
        /* PRINTING THE DATA IN THE CONSOLE */
        console.log("PASSWORD = " + password);

        /* CHECK THE SIGNIN TYPE */
        if (signInType === "IDENTITY_SIGNIN") {
            /* CHECK IF USER EXISTS IN THE DATABASE */
            const user = await User.findOne({ username: username });
            /* IF USER EXISTS THEN CONTINUE TO THE NEXT STEP ELSE RETURN ERROR WITH MESSAGE - USER NOT EXISTS */
            if (user) {
                /* NOW CHECK IF THE PASSWORD IS CORRECT OR NOT USING BCRYPT.*/
                const validPassword = await bcrypt.compare(password as string, user?.password || "");
                /* IF PASSOWRD IF CORRECT THEN CHECK IF USER HAS 2FA ENABLED OR NOT. IF ENABLED SEND THE VERIFICATION EMAIL ELSE LOG IN THE USER CREATE THE SESSION IN DB AND COOKIE IN THE BROWSER */
                if (validPassword) {
                    const twoFA = user.isTwoFactorEnabled
                    if (twoFA) {
                        /* GET THE USER EMAIL - REQUIRED FOR SENDING EMAIL */
                        const email = user.email;
                        /* GENERATE THE OTP */
                        const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 5);
                        const otp = nanoid();
                        /* SAVE THE OTP IN THE DATABASE ALONG WITH USER'S USERNAME AND EMAIL */
                        try {
                            /* GENERATE OTP DOCUMENT ID FOR MONGODB */
                            const pendingUserDocID = uuidv4();
                            /* PENDING USER DOCUMENT DATA ...TO BE SAVED IN DATABASE */
                            const pendingUser = new PendingUser({
                                _id: pendingUserDocID,
                                otp: otp,
                                username: username,
                                email: email,
                            });
                            /* SAVE THE PENDING USER DATA IN THE DATABASE */
                            await pendingUser.save();

                        } catch (error) {
                            /* CATCH ERROR WHICH OCCURS DURING SAVING PENDING USER DOCUMENT IN THE DATABASE */
                            console.log("FAILED TO SAVE THE OTP IN THE DATABASE", error);
                            /* RETURN A MESSAGE TO THE FRONTEND WITH MESSAGE THAT OTP ALREADY SENT */
                            return {
                                otpAlreadySent: `Hi ${username} an otp is already sent to your email ${email}. Make sure to check the spam or junk folder`
                            }
                        }
                        try {
                            /* SEND THE MAIL TO THE USER WITH OTP FOR VERIFICATION */
                            sendMail(email, otp, username);
                            /* MAIL IS SENT RETURN THIS MESSAGE TO THE FRONTEND */
                            return {
                                otpSentForSignIn: `Hi ${username} an otp is sent to your ${email}. Use that to verify your identity.`
                            }
                        } catch (error) {
                            return {
                                failedToSendVerificationOtp: `Hi ${username} an error occured during verification process`
                            }
                        }
                    } else {
                        /* TWO FACTOR IS NOT ENABLED. SIGNING IN THE USER. ASSIGNING THE JWT TO THE USER AND SAVE THE SESSION TO THE DATABASE */
                        await signUserJWT(user);

                    }
                } else {
                    /* IF PASSWORD IS WRONG THEN LOG THE ERROR */
                    console.log(`hi ${username} your password didn't matched.`);
                    /* ALSO RETURN A MESSAGE TO THE USER THAT THE PASSWORD IS WRONG */
                    return {
                        incorrectPassword: `hi ${username} your password didn't matched.`
                    }
                }
            } else {
                /* IF NO USER IS FOUND THEN LOG THE ERROR */
                console.log(`User ${username} is not registered with us`);
                /* ALSO RETURN A MESSAGE TO THE USER THAT THE USERNAME IS NOT REGISTERED WITH US */
                return {
                    noUserFound: `User ${username} is not registered with us`
                }
            }
        }
        /* LOGIC TO VERIFY THE USERS OTP AND SIGN IN THE USER */
        if (signInType === "IDENTITY_VERIFY_SIGNIN") {
            /* GET THE USER ENTERED OTP FROM THE FORM */
            const otp = formData.get('otp');
            /* FIND THE PENDING USER DOCUMENT FROM THE DATABASE WITH THE 'OTP' */
            const validOTP = await PendingUser.findOne({ otp: otp });
            /* IF A DOCUMENT IS FOUND WITH THAT OTP THAT MEANS OTP IS CORRECT SIGN IN THE USER ASSIGN THE USER JWT */
            if (validOTP) {
                /* NOW FIND THE USER DOCUMENT FROM THE DATABASE REQUIRED FOR STORING COOKIE IN THE BROWSER. STORE THE COOKIE IN THE BROWSER AND CREATE A SESSION DOCUMENT IN THE DATABASE THEN DELETE THAT PENDING USER DOCUMENT FROM THE DATABASE */
                const user = await User.findOne({ username: validOTP.username })
                /* ASSIGN THE JWT */
                await signUserJWT(user);
                /* DELETE THE PENDING USER DOCUMENT FROM THE DATABASE */
                await PendingUser.findByIdAndDelete(validOTP._id)
                /* LOG THE MESSAGE TO THE CONSOLE THAT SIGN IN IS SUCCESS. ALSO RETURN A MESSAGE TO THE FRONTENT */
                console.log(`Hi ${user.username} you are signed in now`);
                /* SEND THE EMAIL NOTIFICATION TO THE USER ABOUT THE LOGIN */
                // await sendLoginNotification(validOTP.email, validOTP.username);
                /* RETURNING THE MESSAGE TO THE FRONTEND */
                return {
                    signInSuccess: `Hi ${user.username} you are signed in now`
                }
            } else {
                /* LOG THE ERROR THAT NO DOCUMENT IN THE DATABASE IS FOUND WITH THE USER ENTERED OTP */
                console.log("Incorrect OTP");
                /* RETURNING MESSAGE TO THE FRONTEND */
                return {
                    invalidOTP: "Incorrect OTP"
                };
            };
        };
    };
    /* LOGIC FOR SIGN IN METHOD ENDS */



    if (type === "LOGOUT") {
        /* GET THE SESSION ID FROM THE USE SESSION HOOK. REQUIRED FOR DELETING THE SESSION DOCUMENT IN THE DATABASE */
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const user = useSession()
        console.log("GOT THE SESSION INFO OF CURRENT USER", user?.sessionId);

        const logoutType = formData.get('logoutType')
        console.log('\x1b[32m%s\x1b[0m', "LOGOUT TYPE = ", logoutType);

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
        if (logoutType === "REVOKE") {
            try {
                console.log("LOGOUT TYPE = REVOKE INITIATED");
                console.log("DATA REQUIRED FOR REVOKING SESSION (GOT FROM FORM): ");

                const revokingSessionId = formData.get('revokingSessionId')
                console.log('REVOKING SESSION ID = ', revokingSessionId);
                const revokingSessionToken = formData.get('revokingSessionToken')
                console.log("REVOKING SESSION TOKEN = ", revokingSessionToken);
                const username = formData.get('username')
                console.log("USER'S USERNAME = ", username);
                const userId = formData.get('userId')
                console.log("USERS USER ID = ", userId);

                // eslint-disable-next-line react-hooks/rules-of-hooks
                const user = useSession()
                if (user) {
                    console.log("USER SESSION FOUND. USERNAME = ", user.username);
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
                };
            };
        };
    };
}



async function signUserJWT(user: any) {
    console.log("SIGNING JWT TO THE USER");

    const sessionId = uuidv4();
    console.log("A UNIQUE SESSION ID IS CREATED ", sessionId);
    const userIp = await ip()
    console.log("GOT THE USER IP ", userIp);
    const tokenData = {
        _id: user._id,
        ip: userIp,
        sessionId: sessionId,
        username: user.username,
        role: user.role,
        isTwoFactorEnabled: user.isTwoFactorEnabled,
    }
    console.log("HERE IS TOKEN DATA (BELOW) - ");
    console.log("USER ID = ", tokenData._id);
    console.log("USER IP = ", tokenData.ip);
    console.log("USER SESSION ID = ", tokenData.sessionId);
    console.log("USER USERNAME = ", tokenData.username);
    console.log("USER ROLE = ", tokenData.role);




    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '12h' });
    console.log("TOKEN GENERATED FOR USER WITH USER INFO (EXPIRES IN 12h) = ", token);
    cookies().set('User', token, {
        httpOnly: true,
        // domain: ".vercel.app",
        secure: true,
        priority: 'high',
        path: '/',
        maxAge: 36000,
        sameSite: 'strict',
    })
    console.log("COOKIE CREATED IN THE BROWSER WITH VALIDITY OF 10 Hr");

    const newSession = new Session({
        _id: sessionId,
        token: token,
        ipAddress: userIp,
        username: user.username,
        userId: user._id,
    })
    await newSession.save()
    revalidatePath('/identity')
    console.log("USER SESSION SUCCESSFULLY CREATED IN THE DATABASE WITH THE FOLLOWING DATA = ", newSession);

}