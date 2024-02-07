import { Response } from "express";
declare class ApiResponse {
    constructor(res: Response, statusCode: number, message: string, data?: object | null);
}
declare class Apperror extends Error {
    status: number;
    constructor(message: string, status: number);
}
export { Apperror, ApiResponse };
