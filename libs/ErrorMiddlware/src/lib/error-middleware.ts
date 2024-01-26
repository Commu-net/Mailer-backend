import { Request, Response, NextFunction } from 'express';

interface ErrorMessage{
    errMsg? : string,
    errStatus? : number
}

const errorMiddleware = (err: ErrorMessage, req: Request, res: Response) => {

    const errMsg: string = err.errMsg || "Error has occured";
    const errStatus: number = err.errStatus || 500;

    res.status(errStatus).json({
        message :  errMsg,
        status : errStatus,
    })
};


interface AuthRequest extends Request {
  user: object;
  
}

function authMiddleWare(req: AuthRequest, res: Response, next: NextFunction) {
  console.log("auth middleware" , req.user)
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      success: true,
      message: "unauthorized"
    });
  }
  
  return; 
}
export {errorMiddleware, authMiddleWare};
