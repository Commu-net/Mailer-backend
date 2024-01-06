import express  , {Express} from 'express';
const app  : Express= express();
const port = 3000;
import userRoutes from './routes/user.routes';
app.use("/api/v1/user/auth" , userRoutes); 



app.get('/', (req , res ) =>  {
    res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

