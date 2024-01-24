import { Request, Response } from "express";

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
export {errorMiddleware};
