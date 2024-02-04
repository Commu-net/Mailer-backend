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
var user_controller_exports = {};
__export(user_controller_exports, {
  authGoogle: () => authGoogle,
  getUserData: () => getUserData,
  googleCallback: () => googleCallback,
  googleFailure: () => googleFailure,
  googleSuccess: () => googleSuccess,
  logout: () => logout
});
module.exports = __toCommonJS(user_controller_exports);
var import_passport = __toESM(require("passport"));
var import_utils = require("@auth/utils");
const authGoogle = async (req, res, next) => {
  try {
    import_passport.default.authenticate("google", {
      scope: ["profile", "email", "https://www.googleapis.com/auth/gmail.compose"],
      accessType: "offline",
      approvalPrompt: "force"
    })(req, res, next);
  } catch (error) {
    return next(new import_utils.Apperror(error.message, 400));
  }
};
const googleCallback = (req, res, next) => {
  try {
    import_passport.default.authenticate("google", {
      successRedirect: `${process.env.DOMAIN}/api/v1/user/auth/google/success`,
      failureRedirect: `${process.env.DOMAIN}/api/v1/user/auth/google/failure`
    })(req, res, next);
  } catch (error) {
    return next(new import_utils.Apperror(error.message, 400));
  }
};
const googleSuccess = (req, res, next) => {
  try {
    console.log(req.user);
    res.redirect(`${process.env.CLIENT_URL}`);
  } catch (error) {
    return next(new import_utils.Apperror(error.message, 400));
  }
};
const googleFailure = (req, res, next) => {
  return next(new import_utils.Apperror("You are not authenticated", 400));
};
const logout = (req, res, next) => {
  try {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        }
        req.user = void 0;
      });
      req.logout((err) => {
        if (err) {
          console.log(err);
        }
      });
      return new import_utils.ApiResponse(res, 200, "Success", { message: "You are logged out" });
    } else {
      req.logout((err) => {
        if (err) {
          console.log(err);
        }
      });
      return new import_utils.ApiResponse(res, 200, "Success", { message: "You are logged out" });
    }
  } catch (error) {
    return next(new import_utils.Apperror(error.message, 400));
  }
};
const getUserData = (req, res, next) => {
  try {
    if (req.user) {
      console.log(req.user);
      const user = req.user;
      const data = {
        name: user.name,
        email: user.email,
        googleId: user.googleId
      };
      return new import_utils.ApiResponse(res, 200, "Success", data);
    } else {
      return new import_utils.ApiResponse(res, 400, "failure", { message: "No user data" });
    }
  } catch (error) {
    return next(new import_utils.Apperror(error.message, 400));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authGoogle,
  getUserData,
  googleCallback,
  googleFailure,
  googleSuccess,
  logout
});
//# sourceMappingURL=user.controller.js.map
