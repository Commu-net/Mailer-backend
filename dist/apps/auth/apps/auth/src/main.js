var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_dotenv = __toESM(require("dotenv"));
var import_cors = __toESM(require("cors"));
var import_mongo = require("@auth/mongo");
var import_passport = __toESM(require("passport"));
var import_userRoutes = __toESM(require("./routes/userRoutes"));
var import_morgan = __toESM(require("morgan"));
var import_express_session = __toESM(require("express-session"));
var import_utils = require("@auth/utils");
var import_mongo2 = require("@auth/mongo");
var import_passport_google_oauth2 = require("passport-google-oauth2");
import_dotenv.default.config({
  path: "../../../.env"
});
(0, import_mongo.connectToDb)();
const app = (0, import_express.default)();
const corsOptions = {
  origin: "https://commu-net.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200
};
app.use((0, import_cors.default)(corsOptions));
app.use(import_express.default.json());
app.use((0, import_morgan.default)("dev"));
app.use(
  (0, import_express_session.default)({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(import_passport.default.initialize());
app.use(import_passport.default.session());
app.use("/api/v1/user", import_userRoutes.default);
import_passport.default.use(new import_passport_google_oauth2.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.DOMAIN}/api/v1/user/auth/google/callback`,
    passReqToCallback: true
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
      const ifuserExists = await import_mongo2.User.findOne({ googleId: profile.id });
      console.log(refreshToken);
      console.log(accessToken);
      if (ifuserExists) {
        ifuserExists.acessToken = accessToken;
        ifuserExists.rToken = refreshToken;
        await ifuserExists.save();
        done(null, ifuserExists);
      } else {
        const user = await import_mongo2.User.create({
          name: profile.displayName,
          email: profile.email,
          picture: profile.picture,
          sub: profile.sub,
          domain: profile.domain,
          googleId: profile.id,
          acessToken: accessToken,
          rToken: refreshToken,
          emailSelected: []
        });
        await user.save();
        done(null, user);
      }
    } catch (error) {
      done(new import_utils.Apperror(error.message, 400), null);
    }
  }
));
import_passport.default.serializeUser(function(user, done) {
  done(null, user._id);
});
import_passport.default.deserializeUser(async function(id, done) {
  const user = await import_mongo2.User.findById(id);
  if (user) {
    return done(null, user);
  }
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("*", (req, res) => {
  res.send("404 Not Found");
});
app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});
const host = process.env.HOST ?? "127.0.0.1";
const port = process.env.AUTH_PORT ? Number(process.env.AUTH_PORT) : 4e3;
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
//# sourceMappingURL=main.js.map
