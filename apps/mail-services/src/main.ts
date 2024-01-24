/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { Express , Request , Response} from "express";
import * as dotenv from 'dotenv';
import router from './routes/emailRoutes';
import errorMiddleware from "./middlewares/errorMiddleware";
import {connectToDb} from "@auth/mongo";


const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use("/api/v1",router);

app.use(errorMiddleware);

connectToDb();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to mailer!' });
});

const PORT : string = process.env.EMAIL_PORT ||  "3000";
const HOST : string = process.env.HOST || "127.0.0.1";

const server = app.listen(Number(PORT) ,HOST , () => {
    console.log(`Listening on port ${PORT}`);

});
server.on('error', console.error);
