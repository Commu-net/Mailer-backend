import mongoose, { ObjectId } from "mongoose";

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
    
    },
    acessToken : {
        type : String,
    },

    rToken : {
        type : String
    }
    
})
interface userI{
    _id :ObjectId, 
    name: string;
    email: string;
    sub?: number;
    picture?: string;
    domain?: string;
    googleId?: string;
    accessToken? : string
    rToken? : string,
    id?:string
}


type userInterface = userI;


const User  =  mongoose.model("User" , userModel) ;
export { User , userInterface } ;   