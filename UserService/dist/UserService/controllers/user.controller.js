"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserData = exports.logout = exports.googleFailure = exports.googleSuccess = exports.googleCallback = exports.authGoogle = void 0;
const passport_1 = __importDefault(require("passport"));
const Apperror_util_1 = __importDefault(require("../../Shared/utils/Apperror.util"));
const ApiResponse_util_1 = __importDefault(require("../../Shared/utils/ApiResponse.util"));
const authGoogle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
    }
    catch (error) {
        return next(new Apperror_util_1.default(error.message, 400));
    }
});
exports.authGoogle = authGoogle;
const googleCallback = (req, res, next) => {
    try {
        passport_1.default.authenticate("google", {
            successRedirect: `${process.env.DOMAIN}/api/v1/user/auth/google/success`,
            failureRedirect: `${process.env.DOMAIN}/api/v1/user/auth/google/failure`,
        })(req, res, next);
    }
    catch (error) {
        return next(new Apperror_util_1.default(error.message, 400));
    }
};
exports.googleCallback = googleCallback;
const googleSuccess = (req, res, next) => {
    try {
        console.log(req.user);
        res.redirect(`${process.env.CLIENT_URL}`);
    }
    catch (error) {
        return next(new Apperror_util_1.default(error.message, 400));
    }
};
exports.googleSuccess = googleSuccess;
const googleFailure = (req, res, next) => {
    return next(new Apperror_util_1.default("You are not authenticated", 400));
};
exports.googleFailure = googleFailure;
const logout = (req, res, next) => {
    try {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                }
                req.user = undefined;
            });
            req.logout((err) => {
                if (err) {
                    console.log(err);
                }
            });
            return new ApiResponse_util_1.default(res, 200, "Success", { message: "You are logged out" });
        }
        else {
            req.logout((err) => {
                if (err) {
                    console.log(err);
                }
            });
            return new ApiResponse_util_1.default(res, 200, "Success", { message: "You are logged out" });
        }
    }
    catch (error) {
        return next(new Apperror_util_1.default(error.message, 400));
    }
};
exports.logout = logout;
const getUserData = (req, res, next) => {
    try {
        if (req.user) {
            console.log(req.user);
            return new ApiResponse_util_1.default(res, 200, "Success", req.user);
        }
        else {
            return new ApiResponse_util_1.default(res, 400, "failure", { message: "No user data" });
        }
    }
    catch (error) {
        return next(new Apperror_util_1.default(error.message, 400));
    }
};
exports.getUserData = getUserData;
