"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
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
    emailSelected: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'Emails'
    }
});
const emailModel = new mongoose_1.default.Schema({
    email: {
        type: String,
        maxlength: 50,
        unique: true
    }
});
const User = mongoose_1.default.model("User", userModel);
exports.User = User;
const Emails = mongoose_1.default.model("Emails", emailModel);
//# sourceMappingURL=user.model.js.map