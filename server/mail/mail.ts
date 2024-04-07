"use server"
import nodemailer from 'nodemailer';


export async function sendMail(email: string, otp: string, username: string) {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "nityam950@gmail.com",
                pass: "wnwt thlv ziro foxp"
            }
        });


        const mailOptions = {
            from: 'hitesh@gmail.com',
            to: email,
            subject: `hi ${username} Verify your identity`,
            html: `hi here is your otp = ${otp}`
        }

        const mailresponse = await transport.sendMail
            (mailOptions);
        console.log("MAIL SENT");

        return mailresponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
}