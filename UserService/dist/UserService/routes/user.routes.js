"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.route("/").get((req, res) => {
    console.log(process.env.DOMAIN);
    res.send(`<a href="${process.env.DOMAIN}/api/v1/user/auth/google" > dkjbfd </a>`);
});
router.route("/auth/google/")
    .get(user_controller_1.authGoogle);
router.route("/auth/google/callback/")
    .get(user_controller_1.googleCallback);
router.route("/auth/google/success")
    .get(user_controller_1.googleSuccess);
router.route("/auth/google/failure")
    .get(user_controller_1.googleFailure);
router.route("/logout")
    .get(user_controller_1.logout);
router.route("/getuser")
    .get(user_controller_1.getUserData);
exports.default = router;
