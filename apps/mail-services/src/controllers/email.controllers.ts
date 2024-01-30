/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import {User , userInterface } from "@auth/mongo";
import { google } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer";
import formidable from 'formidable';
import { readFileSync, unlink, writeFile } from "fs";
import { Buffer } from "buffer";
import { promisify } from "util";
import { ApiResponse, Apperror } from "@auth/utils";
import session from "express-session";

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

let  tempDirectory = process.env.TEMP_FILE || "./apps/mail-services/src/temp";

export async function sendMass(req: RequestWithSession, res: Response, next: NextFunction)  {
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

            await Promise.all(Object.keys(files).map(async (key : any) => {
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

            if(!user) return res.status(404).json({"message" : "User not found"});

            await Promise.all(emails.map(async (email: string) => {
                await sendOneMail(email, sender, fileNames, subject, text , user);
            }));

            await Promise.all(fileNames.map(async (element: string) => {
                await unlinkAsync(tempDirectory + `${element}`);
            }));

            return res.status(200).json({ "message": "Successful" });
        } catch (error) {
            console.log(error);
            next(error);
        }
    });
}

async function sendOneMail(mail : string , senderMail : string ,fileNames : string[] , subject : string , text : string , user : userInterface){
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
        console.log(error);
    }
}

export const getAllEmail = async ( req : RequestWithSession , res : Response , next : NextFunction)  =>{
    console.log (req);
    console.log(req.session) ;

    try {
        const email = "chahatsagar2003@gmail.com"
        const user  : userInterface= await User.findOne({ email});
        console.log(user);  
         return res.status(200).json({
            success : true, 
            emails :user.emailSelected
        });
        

    } catch (error) {
        
        return next(new Apperror(error.message , 400))

    }
}

export const addEmail  = async( req :Request,  res : Response, next  :NextFunction) => {
    try {
        // const email = req.params.email;
        const email = req.body.email;
        const userEmail  = req.body.userEmail;
        const user  :userInterface= await User.findOne({ email : userEmail}); 
        if(!user){
            return next(new Apperror("User not found", 404));
        }

        user.emailSelected.push(email);
        await user.save();  
        return new ApiResponse(res , 200 , "Email added successfully"); 

    } catch (error) {
        return next(new Apperror(error.message , 400))
    }
}
export const removeEmail =async ( req :Request , res:Response , next :NextFunction ) => {
    try {
        const userEmail = "chahatsagar2003@gmail.com" ;
        const email = "Jhatu@gmail.com";
        const user :userInterface = await User.findOne({ email : userEmail});
        user.emailSelected = user.emailSelected.filter((item) => item !== email);   

        await user.save();
        return new ApiResponse(res , 200 , "Email removed successfully" , user);
        
    } catch (error) {
        return next (new Apperror(error.message , 400)  )
    }
}

