"use server"
import nodemailer from 'nodemailer';


export async function sendAccountCreatedMail(email: string, username: string) {
    try {
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "nityam950@gmail.com",
                pass: "wnwt thlv ziro foxp"
            }
        });


        const mailOptions = {
            from: 'nityam950@gmail.com',
            to: email,
            subject: `Hi ${username} your account is created`,
            html: ` <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: auto; max-width: 600px; padding: 20px; border: 1px solid #181818; border-radius: 20px;">
    <div style="text-align: center;">
      <div style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">skip auth</div>
      <div style="font-size: 18px; margin-bottom: 10px;">Hi ${username}! your account is created at skip platform.</div>
              <a href="https://auth-iskips-projects.vercel.app" style="text-decoration:none;background-color: #181818; color: ghostwhite; font-weight: 500; font-size: 24px; padding: 8px 20px; border-radius: 20px; display: inline-block; margin-bottom: 20px;">Profile</a>
    </div>
    <div style="font-size: 14px; border-top: 1px solid #181818; padding-top: 10px; text-align: center;">
      © 2024 skip dev, Silver Valley Bihar, India
    </div>
  </div>`
        }

        const mailresponse = await transport.sendMail
            (mailOptions);
        console.log("MAIL SENT");

        return mailresponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
}