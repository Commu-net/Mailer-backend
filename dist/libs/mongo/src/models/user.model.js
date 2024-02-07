"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = exports.User = void 0;
const mongoose_1 = require("mongoose");
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
    },
    acessToken: {
        type: String,
    },
    rToken: {
        type: String
    },
    emailSelected: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Email'
        }]
});
const emailModel = new mongoose_1.default.Schema({
    email: {
        type: String,
        maxlength: 50,
        required: true,
        trim: true
    },
    name: {
        type: String,
        maxlength: 50,
        trim: true
    },
    currentDesignation: {
        type: String,
        maxlength: 50,
        trim: true
    },
    addedOn: {
        type: Date,
        default: Date.now()
    }
});
const User = mongoose_1.default.model("User", userModel);
exports.User = User;
const Email = mongoose_1.default.model("Email", emailModel);
exports.Email = Email;
//# sourceMappingURL=user.model.js.map