import express ,{ Express , Request , Response} from "express";
import dotenv from "dotenv";

const app : Express = express();
const PORT = process.env.PORT || 8080;


app.get("/",(req : Request , res : Response) => {
    return res.json("Hellow");
});

app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
});
