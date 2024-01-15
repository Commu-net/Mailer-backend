import express from 'express';
import dotenv from 'dotenv';
dotenv.config({
  path: '../../../.env',

});
import { connectToDb } from '@auth/mongo';



connectToDb();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
