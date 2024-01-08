import { Response } from 'express';

interface AuthenticatedRequest extends Request{
    user? : any;
}

const  isLoggedIn =  (req : AuthenticatedRequest, res : Response, next : any ) =>   {
    
    if(req.user)  {
        next();
        
    }
    else  { 
        res.status(401).send();
    }
}

export {isLoggedIn} ;