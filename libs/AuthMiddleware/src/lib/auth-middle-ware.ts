
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user: object; 
}

function authMiddleWare(req: AuthRequest, res: Response, next: NextFunction) {
  console.log("auth middleware")
  console.log(req.user)
  
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
export { authMiddleWare}