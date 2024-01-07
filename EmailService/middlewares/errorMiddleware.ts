import { Request, Response, NextFunction } from "express";

interface ErrorMessage{
    errMsg? : string,
    errStatus? : number
}

const errorMiddleware = (err: ErrorMessage, req: Request, res: Response, next: NextFunction) => {

    const errMsg: string = err.errMsg || "Error has occured";
    const errStatus: number = err.errStatus || 500;

    res.status(errStatus).json({
        message :  errMsg,
        status : errStatus,
    })
};

export default errorMiddleware;