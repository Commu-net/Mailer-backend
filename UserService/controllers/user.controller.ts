import passport from "passport"; 
import {Request , Response , NextFunction} from "express"; 
import Apperror from "../../Shared/utils/Apperror.util";
import ApiResponse from "../../Shared/utils/ApiResponse.util";

import session from 'express-session';
const authGoogle = async (req : Request , res :  Response, next : NextFunction ) => {
    try {

        passport.authenticate("google", {scope: ["profile" ,"email"  ]})(req,res , next) ;
        
    } catch (error : any) {
        return next (new Apperror(error.message , 400));
    }

}

const googleCallback  =  (req : Request ,res : Response , next : NextFunction ) => {
    try {
        
        passport.authenticate("google", {
            successRedirect: `${process.env.DOMAIN}/api/v1/user/auth/google/success`,
            failureRedirect: `${process.env.DOMAIN}/api/v1/user/auth/google/failure`,
        })(req, res, next);
    } catch (error : any) {
        return next(new Apperror(error.message , 400));
    }
}

const googleSuccess = (req : Request , res : Response , next : NextFunction ) => {
    try {
        console.log(req.user)   
        res.redirect(`${process.env.CLIENT_URL}`)
    } catch (error : any) {
        return next (new Apperror(error.message , 400));
    }
}



const googleFailure = (  req : Request, res : Response , next : NextFunction ) => {
    return next (new Apperror("You are not authenticated" , 400));
}


interface RequestWithSession extends Request {
    session: session.Session & Partial<session.SessionData> & { user?: any };
  }
const logout = (req: RequestWithSession, res: Response, next: NextFunction) => {
    try {
        if (req.session) {
            req.session.destroy((err: Error) => {
              if (err) {
                console.log(err);
              }
              req.user = undefined;
            });
            req.logout((err: Error) => {
                if (err) {
                    console.log(err);
                }
            });
            return new ApiResponse(res , 200 , "Success" , {message : "You are logged out"});
          } else {
            req.logout((err: Error) => {
              if (err) {
                console.log(err);
              }
            });
            return new ApiResponse(res , 200 , "Success" , {message : "You are logged out"});
          }  
    } catch (error : any) {
        return next(new Apperror(error.message , 400));
    }
}



const getUserData = (req : Request , res : Response, next : NextFunction ) => { 
    try {
        if(req.user) {
            console.log(req.user) ;
            
            return new ApiResponse(res , 200 , "Success" , req.user);
        }else{
            return new ApiResponse(res , 400 , "failure" , {message : "No user data"});
        }
    } catch (error :any) {
        return next(new Apperror(error.message , 400));
    }
}

export  {
    authGoogle , googleCallback ,
    googleSuccess , googleFailure ,
    logout , getUserData
}