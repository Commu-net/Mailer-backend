import { Router } from "express";
import { Request, Response } from "express";

import { getAllEmail, sendMail , sendMass} from "../controllers/email.controllers";

import { authMiddleWare } from "@auth/ErrorMiddleware";
const router: Router = Router();



// router.get("/mail", (req: Request, res: Response) => {
//     console.log("hello");
//     return res.status(200).json("post on this route");
// });

// router.post("/mail", sendMass );  //send mails with attachments 

// router.post("/send",sendMail); //send mail without attachments

router.route("/mail" ).get(  getAllEmail )

export default router;

