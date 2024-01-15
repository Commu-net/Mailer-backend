import express ,{ Express , Request , Response} from "express";
import * as dotenv from 'dotenv';
import router from './routes/emailRoutes';
import errorMiddleware from "./middlewares/errorMiddleware";

dotenv.config();

const app : Express = express();
const PORT : string | 8080 = process.env.PORT || 8080;

app.use("/api/v1",router);

app.get("/",(req : Request , res : Response) => {
    return res.json("Hellow");
});

app.use(errorMiddleware);

connectToDb();

app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
});
