import mongoose from "mongoose";

const userModel = new  mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        maxlength : 50
    },
    email  :{
        type : String,
        required : true,
        trim : true,
        maxlength : 50,
        lowercase : true ,
        unique : true ,
        match : [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , "Please enter a valid email"]
    }, 
    sub  : {
        type : Number ,
    }, 
    picture : {
        type : String
    
    }, 
    domain :{
        type : String ,
        trim : true ,
        maxlength : 50
    
    }, 
    googleId : {
        type : String ,
        trim : true ,
        maxlength : 50
    
    }
    
})


export default mongoose.model("User" , userModel) ;