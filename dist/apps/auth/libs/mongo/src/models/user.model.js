var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var user_model_exports = {};
__export(user_model_exports, {
  Email: () => Email,
  User: () => User
});
module.exports = __toCommonJS(user_model_exports);
var import_mongoose = __toESM(require("mongoose"));
const userModel = new import_mongoose.default.Schema({
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
    unique: true
  },
  sub: {
    type: Number
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
    type: String
  },
  rToken: {
    type: String
  },
  emailSelected: [{
    type: import_mongoose.default.Schema.Types.ObjectId,
    ref: "Email"
  }]
});
const emailModel = new import_mongoose.default.Schema({
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
const User = import_mongoose.default.model("User", userModel);
const Email = import_mongoose.default.model("Email", emailModel);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Email,
  User
});
//# sourceMappingURL=user.model.js.map
