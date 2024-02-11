var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var utils_exports = {};
__export(utils_exports, {
  ApiResponse: () => ApiResponse,
  Apperror: () => Apperror
});
module.exports = __toCommonJS(utils_exports);
class ApiResponse {
  constructor(res, statusCode, message, data = null) {
    res.status(statusCode).json({
      statusCode,
      message,
      data
    });
  }
}
class Apperror extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    console.log(message);
    Error.captureStackTrace(this, this.constructor);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ApiResponse,
  Apperror
});
