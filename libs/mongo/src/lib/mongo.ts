import mongoose from "mongoose";

mongoose.set("strictQuery" ,false);

const connectToDb= async () => {

    await mongoose.connect(process.env["MONGO_URL"] as string)
        .then(() => console.log("Connected to DB"))
        .catch((err) => {
            console.log(err);
            process.exit(1);    
        })
}
export { connectToDb}; 