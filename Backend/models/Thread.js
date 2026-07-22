import mongoose from "mongoose";

// this is the message schema that has been used to create a thread and will data data drom mongodb  database and cross verify it using the message schema thata the all deatails are correct 
const MessageSchema = new mongoose.Schema({
    role:{
        type:String,
        enum:["user","assistant"],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    timestamp:
    {
  type:Date,
  default:Date.now
    }
});
// this is the thread schema that has been used to create a thread and will data data drom mongodb  database and cross verify it using the thread schema thata the all deatails are correct 
const ThreadSchema = new mongoose.Schema({

    //  INSERT THIS — links every thread to the user who owns it
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    threadId:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        default:"New Chat"
    },
    messages:[MessageSchema],
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    },
});


const Thread = mongoose.model("Thread", ThreadSchema);
export default Thread;