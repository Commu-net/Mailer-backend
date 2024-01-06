const  isLoggedIn =  (req : Request, res : Response, next : any ) =>   {
    
    
    
    if(req?.user)  {
        next( );
        
    }
    else  { 
        res.status(401)
        .send("You are not authenticated");
    }
}

export {isLoggedIn} ;