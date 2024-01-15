import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth2";
import passport from "passport";
import dotenv from "dotenv";
import User , { userInterface } from "../models/user.model";
import Apperror from "../utils/Apperror.util";
import { Request } from 'express';

dotenv.config({
  path: "../.env",
});
console.log(process.env.GOOGLE_CLIENT_ID);
console.log(process.env.GOOGLE_CLIENT_SECRET);
console.log(process.env.DOMAIN);

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: `${process.env.DOMAIN}/api/v1/user/auth/google/callback` as string,
    passReqToCallback: true, 
  },
  async function(request: Request, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const ifuserExists = await User.findOne({ googleId: profile.id });
    
      if (ifuserExists) {
        ifuserExists.acessToken = accessToken;
        ifuserExists.save();
        done(null, ifuserExists);
      } else {
        console.log(accessToken);
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


