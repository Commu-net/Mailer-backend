import { NextFunction, Request, Response } from "express";
import User, { userInterface } from "../models/user.model";
import { google } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer";

export async function sendMail(req: Request, res: Response, next: NextFunction) {
    try {
        // Temporarily checking sending mail
        const user: userInterface | null = await User.findOne({ "email": "chahatsagar2003@gmail.com" });
        if (!user) return res.status(404).json({ "message": "User not found" });

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            // process.env.CLIENT_URL
        );
        
        oauth2Client.setCredentials({
            access_token: user.acessToken,
            refresh_token: user.rToken,
        });
        
        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        const mailOptions = {
            to: 'chahatsagar22003@gmail.com',
            cc: 'cc1@example.com, cc2@example.com',
            replyTo: 'amit@labnol.org',
            subject: 'Hello world',
            text: 'This email is sent from the command line',
        };

        const mailComposer = new MailComposer(mailOptions);
        const message = await mailComposer.compile().build();

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: message.toString('base64')
            }
        });

        return res.status(200).json({ "message": "Email sent successfully" });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ "message": "Server side error" });
    }
}




// const accessToken = await new Promise((resolve, reject) => {
//     oauth2Client.getAccessToken((err, token) => {
//       if (err) {
//         console.log("*ERR: ", err)
//         reject();
//       }
//       resolve(token); 
//     });
//   });
// console.log(accessToken);