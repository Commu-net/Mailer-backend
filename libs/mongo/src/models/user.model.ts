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

    emailSelected: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Email'
    }]
    
});

const emailModel = new mongoose.Schema({
    email : {
        type : String,
        maxlength : 50,
        required : true,
        trim : true
    },
    name : {
        type : String,
        maxlength : 50,
        trim : true
    },
    currentDesignation : {
        type : String,
        maxlength : 50,
        trim : true
    },
    addedOn :{
        type : Date,
        default : Date.now()
    }
})
interface userI extends mongoose.Document {
    _id :ObjectId, 
    name: string;
    email: string;
    sub?: number;
    picture?: string;
    domain?: string;
    googleId?: string;
    acessToken? : string
    rToken? : string,
    id?:string,
    emailSelected? : mongoose.Schema.Types.ObjectId[] | null
}

interface emailI extends mongoose.Document {
    email: string;
    name?: string;
    currentDesignation?: string;
    addedOn?: Date;
}


type userInterface = userI;
type emailInterface = emailI;

const User  =  mongoose.model("User" , userModel) ;
const Email = mongoose.model("Email" , emailModel);
export { User , Email ,userInterface , emailInterface} ;   