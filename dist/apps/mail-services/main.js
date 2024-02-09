/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const express_1 = __webpack_require__(2);
const email_controllers_1 = __webpack_require__(5);
const router = (0, express_1.Router)();
// router.get("/mail", (req: Request, res: Response) => {
//     console.log("hello");
//     return res.status(200).json("post on this route");
// });
router.route("/send").post(email_controllers_1.sendMass); //send mails with attachments 
router.route("/mail")
    .get(email_controllers_1.getAllEmail)
    .post(email_controllers_1.addEmail)
    .delete(email_controllers_1.removeEmail)
    .put(email_controllers_1.updateEmail);
exports["default"] = router;


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.updateEmail = exports.removeEmail = exports.addEmail = exports.getAllEmail = exports.sendMass = exports.sendMail = void 0;
const tslib_1 = __webpack_require__(1);
const mongo_1 = __webpack_require__(6);
const googleapis_1 = __webpack_require__(10);
const mail_composer_1 = tslib_1.__importDefault(__webpack_require__(11));
const formidable_1 = tslib_1.__importDefault(__webpack_require__(12));
const fs_1 = __webpack_require__(13);
const util_1 = __webpack_require__(14);
const utils_1 = __webpack_require__(15);
function sendMail(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            // Temporarily checking sending mail
            const user = yield mongo_1.User.findOne({ "email": "chahatsagar2003@gmail.com" });
            if (!user)
                return res.status(404).json({ "message": "User not found" });
            const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
            oauth2Client.setCredentials({
                access_token: user.acessToken,
                refresh_token: user.rToken,
            });
            const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oauth2Client });
            const mailOptions = {
                // to: 'chahatsagar22003@gmail.com',
                subject: 'Hello world',
                text: 'This email is sent from the command line',
            };
            const mailComposer = new mail_composer_1.default(mailOptions);
            const message = yield mailComposer.compile().build();
            yield gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: message.toString('base64')
                }
            });
            return res.status(200).json({ "message": "Email sent successfully" });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ "message": "Server side error" });
        }
    });
}
exports.sendMail = sendMail;
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const unlinkAsync = (0, util_1.promisify)(fs_1.unlink);
let tempDirectory = process.env.TEMP_FILE || "./apps/mail-services/src/temp";
function sendMass(req, res, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const form = (0, formidable_1.default)({
            minFileSize: 1,
            maxFiles: 5,
            maxFileSize: 10 * 1024 * 1024,
        });
        form.parse(req, (err, fields, files) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (err) {
                next(err);
                return;
            }
            const fileNames = [];
            try {
                yield Promise.all(Object.keys(files).map((key) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const filename = files[key][0].originalFilename;
                    const rawFile = (0, fs_1.readFileSync)(files[key][0].filepath);
                    yield writeFileAsync(tempDirectory.concat(`${filename}`), rawFile);
                    fileNames.push(filename);
                })));
                const emails = fields.emails[0].split(",");
                const sender = fields.sender[0];
                const subject = fields.subject[0];
                const text = fields.text[0];
                const user = yield mongo_1.User.findOne({ "email": sender });
                if (!user)
                    return res.status(404).json({ "message": "User not found" });
                yield Promise.all(emails.map((email) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield sendOneMail(email, sender, fileNames, subject, text, user, next);
                })));
                yield Promise.all(fileNames.map((element) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield unlinkAsync(tempDirectory + `${element}`);
                })));
                return res.status(200).json({ "message": "Successful" });
            }
            catch (error) {
                return next(new utils_1.Apperror("Token expired", 401));
            }
        }));
    });
}
exports.sendMass = sendMass;
function sendOneMail(mail, senderMail, fileNames, subject, text, user, next) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            // Temporarily checking sending mail
            if (!user)
                return new Error("User not found");
            const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
            oauth2Client.setCredentials({
                access_token: user.acessToken,
                refresh_token: user.rToken,
            });
            const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oauth2Client });
            const mailOptions = {
                to: mail,
                subject: subject,
                text: text,
                attachments: fileNames.length > 0 ? [
                    {
                        filename: fileNames[0],
                        path: tempDirectory + `${fileNames[0]}`,
                    }
                ] : [],
            };
            const mailComposer = new mail_composer_1.default(mailOptions);
            const message = yield mailComposer.compile().build();
            yield gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: message.toString('base64')
                }
            });
            console.log(`email send by ${senderMail}`);
        }
        catch (error) {
            console.log(2);
            return next(new utils_1.Apperror("Token expired", 401));
        }
    });
}
const getAllEmail = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.body.userEmail;
        const user = yield mongo_1.User.findOne({ email: userEmail }).populate('emailSelected');
        return new utils_1.ApiResponse(res, 200, "success", user.emailSelected);
    }
    catch (error) {
        return next(new utils_1.Apperror(error.message, 500));
    }
});
exports.getAllEmail = getAllEmail;
const addEmail = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.body.userEmail;
        const emails = req.body.email.split(",").map((email) => email.trim());
        const user = yield mongo_1.User.findOne({ email: userEmail });
        if (!user) {
            return next(new utils_1.Apperror("User not found", 404));
        }
        for (const email of emails) {
            const data = {
                email: email,
                currentDesignation: req.body.currentDesignation,
                name: req.body.name
            };
            let emailFound = yield mongo_1.Email.findOne({ email: email });
            if (!emailFound) {
                emailFound = yield mongo_1.Email.create(data);
                yield emailFound.save();
                user.emailSelected.push(emailFound._id);
                yield user.save();
            }
        }
        return new utils_1.ApiResponse(res, 200, "Emails added successfully");
    }
    catch (error) {
        console.log(error);
        return next(new utils_1.Apperror(error.message, 400));
    }
});
exports.addEmail = addEmail;
const removeEmail = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.body.userEmail;
        const deleteEmail = req.body.email;
        const email = yield mongo_1.Email.findOne({ email: deleteEmail });
        if (!email) {
            return new utils_1.ApiResponse(res, 200, "Email not found");
        }
        const user = yield mongo_1.User.findOne({ email: userEmail });
        if (!user) {
            return next(new utils_1.Apperror("User not found", 404));
        }
        user.emailSelected = user.emailSelected.filter((item) => item.toString() !== email._id.toString());
        yield email.deleteOne({ email: deleteEmail });
        yield user.save();
        return new utils_1.ApiResponse(res, 200, "Email removed successfully");
    }
    catch (error) {
        return next(new utils_1.Apperror(error.message, 400));
    }
});
exports.removeEmail = removeEmail;
const updateEmail = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.body.userEmail;
        const data = {
            email: req.body.email,
            currentDesignation: req.body.currentDesignation,
            name: req.body.name
        };
        const user = yield mongo_1.User.findOne({ email: userEmail });
        const email = yield mongo_1.Email.findOne({ email: data.email });
        if (!user) {
            return next(new utils_1.Apperror("User not found", 404));
        }
        if (!email) {
            const newEmail = yield mongo_1.Email.create(data);
            user.emailSelected.push(newEmail._id);
            yield email.save();
            yield user.save();
            return new utils_1.ApiResponse(res, 200, "Email added", null);
        }
        const updatedEmail = yield mongo_1.Email.findOneAndUpdate({ email: data.email }, data, { new: true });
        user.emailSelected.forEach((value, index) => {
            if (value === (updatedEmail === null || updatedEmail === void 0 ? void 0 : updatedEmail._id)) {
                user.emailSelected[index] = updatedEmail === null || updatedEmail === void 0 ? void 0 : updatedEmail._id;
            }
        });
        yield user.save();
        return new utils_1.ApiResponse(res, 200, "Email updated");
    }
    catch (error) {
        console.log(error);
        return next(new utils_1.Apperror(error.message, 500));
    }
});
exports.updateEmail = updateEmail;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.connectToDb = void 0;
const tslib_1 = __webpack_require__(1);
var mongo_1 = __webpack_require__(7);
Object.defineProperty(exports, "connectToDb", ({ enumerable: true, get: function () { return mongo_1.connectToDb; } }));
tslib_1.__exportStar(__webpack_require__(9), exports);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.connectToDb = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = tslib_1.__importDefault(__webpack_require__(8));
mongoose_1.default.set("strictQuery", false);
const connectToDb = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(process.env["MONGO_URL"])
        .then(() => console.log("Connected to DB"))
        .catch((err) => {
        console.log(err);
        process.exit(1);
    });
});
exports.connectToDb = connectToDb;


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Email = exports.User = void 0;
const tslib_1 = __webpack_require__(1);
const mongoose_1 = tslib_1.__importDefault(__webpack_require__(8));
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


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("googleapis");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("nodemailer/lib/mail-composer");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("formidable");

/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 14 */
/***/ ((module) => {

module.exports = require("util");

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
tslib_1.__exportStar(__webpack_require__(16), exports);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
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


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const errorMiddleware = (err, req, res, next) => {
    const errMsg = err.errMsg || "Error has occured";
    const errStatus = err.errStatus || 500;
    res.status(errStatus).json({
        message: errMsg,
        status: errStatus,
    });
};
exports["default"] = errorMiddleware;


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("morgan");

/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("express-session");

/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("passport");

/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("cors");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(1);
const express_1 = tslib_1.__importDefault(__webpack_require__(2));
const path = tslib_1.__importStar(__webpack_require__(3));
const emailRoutes_1 = tslib_1.__importDefault(__webpack_require__(4));
const errorMiddleware_1 = tslib_1.__importDefault(__webpack_require__(17));
const mongo_1 = __webpack_require__(6);
const morgan_1 = tslib_1.__importDefault(__webpack_require__(18));
const express_session_1 = tslib_1.__importDefault(__webpack_require__(19));
const passport_1 = tslib_1.__importDefault(__webpack_require__(20));
const cors_1 = tslib_1.__importDefault(__webpack_require__(21));
const app = (0, express_1.default)();
(0, mongo_1.connectToDb)();
const corsOptions = {
    origin: 'https://commu-net.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 8 * 60 * 60 * 1000, secure: true }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use("/api/v1/", emailRoutes_1.default);
app.use('/assets', express_1.default.static(path.join(__dirname, 'assets')));
app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to mailer!' });
});
const PORT = process.env.EMAIL_PORT || "3000";
const HOST = process.env.HOST || "127.0.0.1";
const server = app.listen(Number(PORT), HOST, () => {
    app.use(errorMiddleware_1.default);
    console.log(`Listening on port ${PORT}`);
});
server.on('error', console.error);

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;