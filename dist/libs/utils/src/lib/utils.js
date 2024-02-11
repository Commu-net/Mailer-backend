"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = exports.Apperror = void 0;
class ApiResponse {
    constructor(res, statusCode, message, data = null) {
        res.status(statusCode).json({
            statusCode,
            message,
            data
        });
    }
}
exports.ApiResponse = ApiResponse;
class Apperror extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        console.log(message);
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.Apperror = Apperror;
//# sourceMappingURL=utils.js.map