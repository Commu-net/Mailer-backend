
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
export default ApiResponse;