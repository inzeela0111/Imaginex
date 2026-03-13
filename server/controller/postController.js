import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import path from "node:path"
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import uploadToCloudinary from "../middleWare/cloudinaryMiddleware.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Report from "../models/reportModel.js"



const __dirname = path.dirname(fileURLToPath(import.meta.url))


// Take prompt and caption
// Generate image with ai model
// Store on local server 
// Upload on cloudinary
// Remove from server
// Respond with caption And post 



const generateAndPost = async (req, res) => {

let userId = req.user._id
let newPost 

 try {
     //GET PROMPT
     const {prompt , caption} = req.body;

     //CHECK IF PROMPT IS COMING IN BODY
  if (!prompt || !caption) {
    res.status(409);
    throw new Error("Kindly Provide Prompt to Generate image");
  }
  
  //INITIALIZE GOOGLE GEN AI INSTANCE
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  //API CALL TO GENERATE IMAGE 
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: prompt,
  });

   //LOOP THROUGH CORRECT RESPONSE
  for (const part of response.candidates[0].content.parts) {
    if (part.text) {
      console.log(part.text);
    } else if (part.inlineData) {
      const imageData = part.inlineData.data;
      //CONVERT TEXT TO IMAGE 
      const buffer = Buffer.from(imageData, "base64");

      //save locally
      const filename = crypto.randomUUID() + ".png"
      const filePath = path.join(__dirname, "../generated-content" , filename)
      //WRITE FILE INTO SERVER
      fs.writeFileSync(filePath, buffer)
      
      //UPLOAD TO CLOUDINARY
      const imageLink = await uploadToCloudinary(filePath)

      //REMOVE FROM SERVER
      fs.unlinkSync(filePath)

      console.log(userId , imageLink.secure_url , caption)

     //CREATE POST
       
        newPost = new Post({
          user : userId ,
          imageLink : imageLink.secure_url,
          caption : caption
        })
      
        //SAVE TO DB
        await newPost.save()
        console.log("POST SAVED IN DB:", newPost)
        //AGGREGATE  USER DETAILS IN NEWPOST OBJECT
        await newPost.populate('user')
      
    }
  }

  res.status(201).json(newPost)

 } catch (error) {
  console.log(error)
    res.status(409)
    throw new Error("POST NOT CREATED!.......")
 }


};


const getPosts = async(req , res) => {
   const posts = await Post.find().populate('user')

   if(!posts){
    res.status(404)
    throw new Error("POSTS NOT FOUND !....")
   }
   res.status(200).json(posts)
}


const getPost = async(req , res) => {
   const post = await Post.findById(req.params.pid).populate('user')

   if(!post){
    res.status(404)
    throw new Error("POST NOT FOUND !....")
   }
   res.status(200).json(post)
}


const likeAndUnlikePost = async(req , res) => {
  let currentUser= await User.findById(req.user._id)

  // check if users exists
if(!currentUser){
    res.status(404)
    throw new Error("User not Found")
}  

//CHECK IF POST EXITS
 const post = await Post.findById(req.params.pid).populate('user')

   if(!post){
    res.status(404)
    throw new Error("POST NOT FOUND !....")
   }

//Check if Already  Followed

if(post.likes.includes(currentUser._id)){
    //dislike
    //Remove follower from likes
let updatedLikesList = post.likes.filter(like => like.toString() !== currentUser._id.toString())
post.likes = updatedLikesList
await post.save()
}else{
  //like
  //Add follower in liked
post.likes.push(currentUser._id)
await post.save()
}

// Populate after save using the Post model directly
    await Post.populate(post, { path: 'likes' })


res.status(200).json(post)

}


const reportPost = async(req , res) => {
      const {text} = req.body
      const postId = req.params.pid
      const userId = req.user._id

      if(!text){
        res.status(409)
        throw new Error("Please Enter Text ! ")
      }

      const newReport = new Report({
           user : userId ,
           post : postId ,
           text : text
      })

      await newReport.save()
      await newReport.populate("user")
      await newReport.populate("post")

      if(!newReport){
        res.status(409)
        throw new Error("Unable to Report this Post")
      }
      res.status(201).json(newReport)
}






const postController = {generateAndPost , getPosts , getPost , likeAndUnlikePost , reportPost}

export default postController;
