
const authGoogle = async (req , res, next ) => {
    try {

        passport.authenticate("google", {scope: ["profile" ,"email"  ]})(req,res , next) ;
        
    } catch (error) {
        return next (new Apperror(error.message , 400));
    }

}

const googleCallback  =  (req ,res , next ) => {
    try {
        
        passport.authenticate("google", {
            successRedirect: `${process.env.DOMAIN}/api/v1/user/auth/google/success`,
            failureRedirect: `${process.env.DOMAIN}/api/v1/user/auth/google/failure`,
        })(req, res, next);
    } catch (error) {
        return next(new Apperror(error.message , 400));
    }
}

const googleSuccess = (req , res , next ) => {
    try {
        console.log(req.user)   
        res.redirect(`${process.env.CLIENT_URL}`)
    } catch (error) {
        return next (new Apperror(error.message , 400));
    }
}



const googleFailure = (req , res , next ) => {
    return next (new Apperror("You are not authenticated" , 400));
}

const logout  = ( req ,res, next ) => {
    try {
        if (req.session) {
            req.session.destroy((err) => {
              if (err) {
                console.log(err);
              }
              req.user = null;
            });
            req.logout((err) => {
                if (err) {
                    console.log(err);
                }
            });
            return new ApiResponse(res , 200 , "Success" , "You are logged out");
          } else {
            req.logout((err) => {
              if (err) {
                console.log(err);
              }
            });
            return new ApiResponse(res , 200 , "Success" , "You are logged out");
          }  
    } catch (error) {
        return next (new Apperror(error.message , 400));
    }
}



const getUserData = (req, res, next ) => { 
    try {
        if(req.user) {
            console.log(req.user) ;
            
            return new ApiResponse(res , 200 , "Success" , req.user);
        }else{
            return new ApiResponse(res , 400 , "failure" , "No user data");
        }
    } catch (error) {
        return next(new Apperror(error.message , 400));
    }
}

export  {
    authGoogle , googleCallback ,
    googleSuccess , googleFailure ,
    logout , getUserData
}