"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    constructor(res, statusCode, message, data) {
        res.status(statusCode).json({
            statusCode,
            message,
            data
        });
    }
}
exports.default = ApiResponse;
