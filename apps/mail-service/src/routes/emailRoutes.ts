import { Router } from "express";
import { Request, Response, NextFunction } from "express";

import { sendMail , sendMass} from "../controllers/email.controllers";

const router: Router = Router();

router.get("/mail", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json("post on this route");
});

router.post("/mail", sendMass);  //send mails with attachments 

router.post("/send",sendMail); //send mail without attachments

export default router;

