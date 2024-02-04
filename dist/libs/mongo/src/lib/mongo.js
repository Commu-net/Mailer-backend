"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDb = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
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
//# sourceMappingURL=mongo.js.map