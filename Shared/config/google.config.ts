import { Strategy, StrategyOptions, VerifyCallback } from "passport-google-oauth2";
import passport from "passport";
import dotenv from "dotenv";
import User from "../models/user.model";
import Apperror from "../utils/Apperror.util.js";
import { Request } from 'express';
dotenv.config({
  path: "../.env",
});
console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);
console.log(process.env.DOMAIN);
const GoogleStrategy = Strategy;

passport.use(new GoogleStrategy <StrategyOptions>  ({
    clientID: process.env.GOOGLE_CLIENT_ID as any,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as any,
    callbackURL: `${process.env.DOMAIN}/api/v1/user/auth/google/callback` as string ,
  },
  async function(request: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const ifuserExists = await User.findOne({ googleId: profile.id });
      if (ifuserExists) {
        done(null, ifuserExists);
      } else {
        const user = await User.create({
          name: profile.displayName,
          email: profile.email,
          picture: profile.picture,
          sub: profile.sub,
          domain: profile.domain,
          googleId: profile.id
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