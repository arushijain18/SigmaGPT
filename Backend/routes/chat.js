import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse, { getGroqTranscription } from "../utils/openai.js"; // CHANGED: import getGroqTranscription too
import passport from "passport";
import multer from "multer"; // NEW: handles multipart/form-data (audio file uploads)

const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

// NEW: stores the uploaded audio in memory (as a Buffer) instead of writing it to disk —
// fine here since we immediately forward it to Groq and don't need to keep the file
const upload = multer({ storage: multer.memoryStorage() });

router.post("/test", async(req,res) =>{
// leave as-is, or delete this route entirely — it's just a test route
});

// get all threads
router.get("/thread", auth, async(req,res) =>{
try
    {
const threads = await Thread.find({ userId: req.user._id }).sort({ updatedAt: -1 });
res.json(threads);
    }
catch(err)
    {
console.log(err);
res.status(500).json({error:"failed to save in DB"});
}
});

router.get("/thread/:threadId", auth, async(req,res) =>{
const {threadId} = req.params;

try{
const thread = await Thread.findOne({ threadId, userId: req.user._id });
if(!thread)
    {
return res.status(404).json({error: "Thread not found"});
    }
res.json(thread.messages);
}
catch(err)
    {
console.log(err);
res.status(500).json({error:"Failed to fetch chat"});
    }
});

router.delete("/thread/:threadId", auth, async(req,res) =>{
const{threadId} = req.params;
try
    {
const deletedThread =await Thread.findOneAndDelete({ threadId, userId: req.user._id });
if(!deletedThread)
            {
return res.status(404).json({error:"Thread not found"});
            }
res.status(200).json({error:"Thread deleted successfully"});
    }catch(err)
    {
console.log(err);
res.status(500).json({error:"Failed to delete chat"});
    }
});

router.post("/chat", auth, async(req,res) =>{
const {threadId, message}= req.body;

if(!threadId || !message)
    {
return res.status(400).json({error:"missing required fields"});
    }
try{
let thread= await Thread.findOne({ threadId, userId: req.user._id });
if(!thread){
thread=new Thread({
userId: req.user._id,
threadId,
title:message,
messages: [{role:"user", content:message}]
                });
            } else{
thread.messages.push({role:"user", content:message})
            }

const assistantReply = await getOpenAIAPIResponse(message);
thread.messages.push({role:"assistant", content:assistantReply});
thread.updatedAt= new Date();

await thread.save();
res.json({reply:assistantReply});

        }catch(err){
console.log(err);
res.status(500).json({error: "something went wrong"});
        }
});

// NEW: voice transcription route
// auth        → same JWT check as your other routes, ensures only logged-in users can use this
// upload.single("audio") → multer middleware that reads the uploaded file from the
//                           "audio" field of the incoming FormData and puts it on req.file
router.post("/transcribe", auth, upload.single("audio"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No audio provided" });
       console.log("file size:", req.file.buffer.length); 
    // req.file.buffer  → the raw audio bytes multer captured in memory
    // req.file.mimetype → e.g. "audio/webm", tells Groq how to interpret the file
    const text = await getGroqTranscription(req.file.buffer, req.file.mimetype);
    res.json({ text });
});

export default router;