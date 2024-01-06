import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config({
    path : "../.env"
});
import "./config/google.config"; 
import connectToDb from "./config/mongo.db.config";
connectToDb(); 


const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }
);
