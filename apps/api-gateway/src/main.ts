/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express  , { Request , Response }from 'express';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 8 * 60 * 60 * 1000, secure:true }
  })
);
app.use(passport.initialize());
app.use(passport.session());  
app.use(express.json());
app.use(morgan('dev'));
interface RequestWithSession extends Request {
  user: any;
  // logout(arg0: (err: Error) => void): unknown;
  session: session.Session & Partial<session.SessionData> & { user?: any };
}
app.get('/' , (req  : RequestWithSession, res  :Response  ) => {
  console.log(req.user);
    res.send('API GATEWAY')
})

const routes = {
    '/user':'http://localhost:4000/api/v1/',
    '/mail' : 'http://localhost:3000/api/v1',
}
for(const route in routes){
    const target = routes[route];
    app.use(route , createProxyMiddleware({target}))
}


const port =  3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
