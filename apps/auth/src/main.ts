import express  , {Express , Request , Response  } from 'express';
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config({
  path: '../../../.env',

});
import { connectToDb } from '@auth/mongo';
import passport from "passport"
import userRoutes from "./routes/userRoutes";
import morgan from "morgan" ;

import session from "express-session"
import { Apperror } from '@auth/utils';
import {User} from "@auth/mongo"
import {Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth2"

connectToDb();



const app: Express = express();

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
  })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(cors())
app.use("/api/v1/user", userRoutes);


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: `${process.env.DOMAIN}/api/v1/user/auth/google/callback` as string,
    passReqToCallback: true, 
    
  },
  async function(request: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const ifuserExists = await User.findOne({ googleId: profile.id });
      console.log(refreshToken);
      console.log(accessToken);
      if (ifuserExists) {
        ifuserExists.acessToken = accessToken;
        ifuserExists.rToken = refreshToken;
        await ifuserExists.save();
        done(null, ifuserExists);
      } else {
        const user = await User.create({
          name: profile.displayName,
          email: profile.email,
          picture: profile.picture,
          sub: profile.sub,
          domain: profile.domain,
          googleId: profile.id,
          acessToken : accessToken,
          rToken : refreshToken,
          emailSelected : []
        });
        await user.save();
        done(null, user);
      }
    } catch (error:any) {
      done(new Apperror(error.message, 400), null);
    }
  }
));

passport.serializeUser(function(user: any, done: (error: any, id?: any) => void) {
  done(null, user._id);
});

passport.deserializeUser(async function(id: any, done: (error: any, user?: any) => void) {
  const user = await User.findById(id);
  if (user) {
    return done(null, user);
  }
});





app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});


app.use("*", (req: Request, res: Response) => {
  res.send("404 Not Found");
}) 
// app.use(errorMiddleware)


app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});
const host = process.env.HOST ?? '127.0.0.1';
const port = process.env.AUTH_PORT ? Number(process.env.AUTH_PORT) : 4000;

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});