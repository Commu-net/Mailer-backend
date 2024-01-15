import express ,{ Express , Request , Response} from "express";
import * as dotenv from 'dotenv';
import router from './routes/emailRoutes';
import errorMiddleware from "./middlewares/errorMiddleware";
import connectToDb from "./config/mongo.db.config";

dotenv.config(
    {
        path : "../.env"
    }
);

const app : Express = express();
const PORT : string = process.env.PORT || "8080";

app.use("/api/v1",router);

app.get("/",(req : Request , res : Response) => {
    return res.json("Hello");
});

app.use(errorMiddleware);

connectToDb();

app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
});
