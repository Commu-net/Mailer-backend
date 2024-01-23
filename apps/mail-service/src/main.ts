import express ,{ Express , Request , Response} from "express";
import * as dotenv from 'dotenv';
import router from './routes/emailRoutes';
import errorMiddleware from "./middlewares/errorMiddleware";
import {connectToDb} from "@auth/mongo";

dotenv.config(
    {
      path: '../../../.env',

    }
);

const app : Express = express();
const PORT : string = process.env.EMAIL_PORT ||  "8080";
const HOST : string = process.env.HOST || "127.0.0.1";

app.use("/api/v1",router);

app.get("/",(req : Request , res : Response) => {
    return res.json("Hello");
});

app.use(errorMiddleware);

connectToDb();

app.listen(Number(PORT) ,HOST , () => {
    console.log(`Listening on port ${PORT}`);
});