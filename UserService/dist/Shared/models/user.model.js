"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userModel = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
        lowercase: true,
        unique: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter a valid email"]
    },
    sub: {
        type: Number,
    },
    picture: {
        type: String
    },
    domain: {
        type: String,
        trim: true,
        maxlength: 50
    },
    googleId: {
        type: String,
        trim: true,
        maxlength: 50
    }
});
exports.default = mongoose_1.default.model("User", userModel);
