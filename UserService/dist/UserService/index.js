"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_middleware_1 = __importDefault(require("../Shared/middlewares/error.middleware"));
const dotenv_1 = __importDefault(require("dotenv"));
require("../Shared/config/google.config");
dotenv_1.default.config({
    path: "../.env",
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// app.use(cors())
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/v1/user", user_routes_1.default);
app.use("*", (req, res) => {
    res.send("404 Not Found");
});
app.use(error_middleware_1.default);
const port = 4000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
