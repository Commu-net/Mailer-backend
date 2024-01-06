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
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const Apperror_util_js_1 = __importDefault(require("../utils/Apperror.util.js"));
dotenv_1.default.config();
const GoogleStrategy = passport_google_oauth2_1.Strategy;
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.DOMAIN}/api/v1/user/auth/google/callback`,
}, function (request, accessToken, refreshToken, profile, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ifuserExists = yield user_model_1.default.findOne({ googleId: profile.id });
            if (ifuserExists) {
                done(null, ifuserExists);
            }
            else {
                const user = yield user_model_1.default.create({
                    name: profile.displayName,
                    email: profile.email,
                    picture: profile.picture,
                    sub: profile.sub,
                    domain: profile.domain,
                    googleId: profile.id
                });
                yield user.save();
                done(null, user);
            }
        }
        catch (error) {
            return next(new Apperror_util_js_1.default("Error in making a new User", 400));
        }
    });
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user._id);
});
passport_1.default.deserializeUser(function (id, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield user_model_1.default.findById(id);
        if (user) {
            return done(null, user);
        }
    });
});
