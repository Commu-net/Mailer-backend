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
    },

    emailSelected : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'Emails'
    }
    
});

const emailModel = new mongoose.Schema({
    email : {
        type : String,
        maxlength : 50,
        unique : true
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
    acessToken? : string
    rToken? : string,
    id?:string
}

interface emailI{
    email? : string
}


type userInterface = userI;
type emailInterface = emailI;

const User  =  mongoose.model("User" , userModel) ;
export { User , userInterface , emailInterface} ;   