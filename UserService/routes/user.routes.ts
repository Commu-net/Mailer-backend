import express, { Router } from "express" ;

const router  =    express.Router() ;

router.route("/").get((req, res) => {
    res.send(
      `<a href="${process.env.DOMAIN}/api/v1/user/auth/google" > dkjbfd </a>`
    );
  });
  router.route("/auth/google/")
      .get(authGoogle);
  
  router.route("/auth/google/callback/")
      .get(googleCallback);
  
  router.route("/auth/google/success")
      .get(googleSuccess);
  
  router.route("/auth/google/failure")
      .get(googleFailure);
  
  router.route("/logout")
      .get(logout); 
  router.route("/getuser")
      .get(getUserData);


export default Router; 
