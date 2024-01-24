

import express  , {Express} from 'express';
import morgan from 'morgan';
import mailRoutes from './routes/mail.routes';
import dotenv from 'dotenv';
import { connectToDb } from '@auth/mongo';
dotenv.config({
  path: '../../../.env',
});

const app  :Express = express();
connectToDb();
app.use(express.json());

app.use(morgan("dev")); 
app.use("/api" , mailRoutes)


const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
