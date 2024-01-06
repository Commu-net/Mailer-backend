"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const isLoggedIn = (req, res, next) => {
    if (req === null || req === void 0 ? void 0 : req.user) {
        next();
    }
    else {
        res.status(401)
            .send("You are not authenticated");
    }
};
exports.isLoggedIn = isLoggedIn;
