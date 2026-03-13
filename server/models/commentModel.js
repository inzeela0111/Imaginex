import mongoose from "mongoose";

const commenSchema =new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required :  true
    },
    post : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Post",
        required :  true
    },
    text : {
        type : String ,
        required : true
    }
},{
    timestamps : true
})

const Comment = mongoose.model("Comment" , commenSchema)

export default Comment