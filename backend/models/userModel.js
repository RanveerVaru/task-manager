import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    avatar : {
        type : String,
        default : "",
    },
    tasks : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Task"
    }]

} , {timestamps: true});

export const User =  mongoose.model("User", userSchema);