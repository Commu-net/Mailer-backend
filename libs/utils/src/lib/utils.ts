
import { Response } from "express";
class ApiResponse {
    constructor( res  :Response , statusCode: number, message : string, data : object) {


        res.status(statusCode).json({
            statusCode,
            message,
            data
        });
        
    }
}

class Apperror extends Error   {
  status: number;

  constructor(message: string, status: number) {
      super(message);
      this.status = status;
      Error.captureStackTrace(this, this.constructor);
  }
}
export  {Apperror , ApiResponse};
