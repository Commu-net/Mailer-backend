/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { Express} from "express";
import dotenv from 'dotenv';
import router from './routes/emailRoutes';
import errorMiddleware from "./middlewares/errorMiddleware";
import {User, connectToDb} from "@auth/mongo";
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import cors from "cors";


const app : Express = express();

connectToDb();

const corsOptions = {
  origin: 'https://commu-net.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 8 * 60 * 60 * 1000, secure:true }
  })
);
app.use(passport.initialize());
app.use(passport.session());  
app.use("/api/v1/",router);

app.use('/assets', express.static(path.join(__dirname, 'assets')));


app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to mailer!' });
});

const PORT : string = process.env.EMAIL_PORT ||  "3000";
const HOST : string = process.env.HOST || "127.0.0.1";

const server = app.listen(Number(PORT) ,HOST , () => {
  app.use(errorMiddleware);
  console.log(`Listening on port ${PORT}`);
  
});
server.on('error', console.error);
