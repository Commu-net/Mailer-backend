import express, { Express, Request, Response, Router, RouterOptions } from "express";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import errorMiddleware from "../Shared/middlewares/error.middleware"
import dotenv from "dotenv";
import "../Shared/config/google.config";
dotenv.config({
  path: "../.env",
});
const app: Express = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/user", userRoutes  );


app.use("*", (req: Request, res: Response) => {
  res.send("404 Not Found");
}) 
app.use(errorMiddleware)

const port = 4000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
