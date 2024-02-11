/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { User, Email, userInterface, emailInterface } from "@auth/mongo";
import { google } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer";
import formidable from 'formidable';
import { readFileSync, stat, unlink, writeFile } from "fs";
import { Buffer } from "buffer";
import { promisify } from "util";
import { ApiResponse, Apperror } from "@auth/utils";
import session from "express-session";
import { appRootPath } from "nx/src/devkit-exports";

interface RequestWithSession extends Request {
    user: any;
    // logout(arg0: (err: Error) => void): unknown;
    session: session.Session & Partial<session.SessionData> & { user?: any };
}
export async function sendMail(req: RequestWithSession, res: Response) {
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
            // to: 'chahatsagar22003@gmail.com',
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

const writeFileAsync = promisify(writeFile);
const unlinkAsync = promisify(unlink);

let tempDirectory = process.env.TEMP_FILE || "./apps/mail-services/src/temp";

export async function sendMass(req: RequestWithSession, res: Response, next: NextFunction) {
    const form: any = formidable({
        minFileSize: 1,
        maxFiles: 5,
        maxFileSize: 10 * 1024 * 1024,
    });



    form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) {
            next(err);
            return;
        }

        const fileNames: string[] = [];

        try {

            await Promise.all(Object.keys(files).map(async (key: any) => {
                const filename: string = files[key][0].originalFilename;
                const rawFile: Buffer = readFileSync(files[key][0].filepath);

                await writeFileAsync(tempDirectory.concat(`${filename}`), rawFile);
                fileNames.push(filename);
            }));

            const emails: string[] = fields.emails[0].split(",");
            const sender: string = fields.sender[0];
            const subject: string = fields.subject[0];
            const text: string = fields.text[0];

            const user: userInterface | null = await User.findOne({ "email": sender });

            if (!user) return res.status(404).json({ "message": "User not found" });

            await Promise.all(emails.map(async (email: string) => {
                await sendOneMail(email, sender, fileNames, subject, text, user, next);
            }));

            await Promise.all(fileNames.map(async (element: string) => {
                await unlinkAsync(tempDirectory + `${element}`);
            }));

            return res.status(200).json({ "message": "Successful" });
        } catch (error : any) {
            return next(new Apperror("Token expired",401));
        }
    });
}

async function sendOneMail(mail: string, senderMail: string, fileNames: string[], subject: string, text: string, user: userInterface , next : NextFunction) {
    try {
        // Temporarily checking sending mail

        if (!user) return new Error("User not found");

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
            to: mail,
            subject: subject,
            text: text,
            attachments: fileNames.length > 0 ? [
                {
                    filename: fileNames[0],
                    path: tempDirectory + `${fileNames[0]}`,
                }
            ] : [],
        };

        const mailComposer = new MailComposer(mailOptions);
        const message = await mailComposer.compile().build();

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: message.toString('base64')
            }
        });
        console.log(`email send by ${senderMail}`);

    } catch (error: any) {
        console.log(2)
        return next(new Apperror("Token expired",401));
    }
}

export const getAllEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userEmail : any = req.query.userEmail;

        if(!userEmail) next(new Apperror("userEmail not missng",401));

        const user: userInterface | null = await User.findOne({ email: userEmail }).populate('emailSelected');
        
        if(!user) next(new Apperror("User not found",404));

        return new ApiResponse(res, 200, "success", user.emailSelected);

    } catch (error : any) {
        return next(new Apperror(error.message, 500));
    }
}

interface dataInterface {
    email : string,
    currentDesignation? : string,
    name : string
}

type postData = dataInterface;

export const addEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userEmail: string = req.body.userEmail;
        const data: postData[] | null = req.body.data;
        if (!userEmail) return next(new Apperror("no userEmail provided", 404));
        if (!data || data.length == 0) return next(new Apperror("no data provided", 401));

        const user: userInterface | null = await User.findOne({ email: userEmail });

        if (!user) return next(new Apperror("no user found", 404));
        console.log(data);
        for (const value of data) {
            
            let email: emailInterface | null = await Email.findOne({ email: value.email });
            if (!email) {
                console.log(value);
                email = await Email.create(value);
                await email.save();
                console.log(email._id);
                user.emailSelected.push(email._id);
            }
            else{
                console.log("else");
                user.emailSelected = user.emailSelected.filter((value) => {
                    if(value.toString() !== email._id.toString()) return true;
                });
                user.emailSelected.push(email._id);
                
            }
        }

        await user.save();

        return new ApiResponse(res, 200, "Emails added successfully");

    } catch (error) {
        console.log(error);
        return next(new Apperror(error.message, 400));
    }
};


export const removeEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userEmail: string = req.body.userEmail;
        const deleteEmail: string = req.body.email;

        const email: emailInterface = await Email.findOne({ email: deleteEmail });

        if (!email) {
            return new ApiResponse(res, 200, "Email not found");
        }
        const user: userInterface = await User.findOne({ email: userEmail });

        if (!user) {
            return next(new Apperror("User not found", 404));
        }

        user.emailSelected = user.emailSelected.filter((item) => item.toString() !== email._id.toString());
        await email.deleteOne({ email: deleteEmail });
        
        await user.save();

        return new ApiResponse(res, 200, "Email removed successfully");

    } catch (error) {
        return next(new Apperror(error.message, 400));
    }
}

export const updateEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userEmail: string = req.body.userEmail;
        const data = {
            email: req.body.email as string,
            currentDesignation: req.body.currentDesignation as string,
            name: req.body.name as string
        }

        const user: userInterface | null = await User.findOne({ email: userEmail });
        const email: emailInterface | null = await Email.findOne({ email: data.email });

        if (!user) {
            return next(new Apperror("User not found", 404));
        }

        if (!email) {
            const newEmail: emailInterface | null = await Email.create(data);
            user.emailSelected.push(newEmail._id);
            await email.save();
            await user.save();
            return new ApiResponse(res, 200, "Email added", null);
        }

        const updatedEmail: emailInterface | null = await Email.findOneAndUpdate({ email: data.email }, data, { new: true });
        user.emailSelected.forEach((value, index) => {
            if (value === updatedEmail?._id) {
                user.emailSelected[index] = updatedEmail?._id;
            }
        });
        await user.save();

        return new ApiResponse(res, 200, "Email updated");

    } catch (error) {
        console.log(error);
        return next(new Apperror(error.message, 500));
    }
};

