
import fs from "node:fs";
import path from "node:path"
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import uploadToCloudinary from "../middleWare/cloudinaryMiddleware.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Report from "../models/reportModel.js"
import Notification from "../models/notificationModel.js";



const __dirname = path.dirname(fileURLToPath(import.meta.url))




const sendNewPostNotifications = async (userId, newPostId) => {
  try {
    const creator = await User.findById(userId).populate('followers');
    if (creator && creator.followers && creator.followers.length > 0) {
      const notifications = creator.followers.map(follower => ({
        recipient: follower._id || follower,
        sender: userId,
        type: "new_post",
        post: newPostId
      }));
      await Notification.insertMany(notifications);
    }
  } catch (err) {
    console.error("Error creating new post notifications:", err);
  }
};

const generateAndPost = async (req, res) => {
  let userId = req.user._id;
  let newPost;

  try {
    const { prompt, caption, imageLink, action } = req.body;

    // 1. GENERATE ONLY
    if (action === 'generate') {
      if (!prompt) {
        res.status(409);
        throw new Error("Kindly Provide Prompt to Generate image");
      }

      // Fetch user to check and update credits
      const user = await User.findById(userId);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      if (user.credits <= 0) {
        res.status(403);
        throw new Error("You do not have enough credits to generate an image.");
      }

      // URL encoded prompt for pollination
      const encodedPrompt = encodeURIComponent(prompt);
      const randomSeed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${randomSeed}&width=1024&height=1024&nologo=true`;

      // FETCH IMAGE FROM POLLINATION
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        res.status(500);
        throw new Error("Failed to generate image from Pollination");
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Save locally
      const filename = crypto.randomUUID() + ".jpg";
      const filePath = path.join(__dirname, "../generated-content", filename);
      
      // WRITE FILE INTO SERVER
      fs.writeFileSync(filePath, buffer);
      
      // UPLOAD TO CLOUDINARY
      const uploadedImage = await uploadToCloudinary(filePath);

      // REMOVE FROM SERVER
      fs.unlinkSync(filePath);

      // Decrement user credit
      user.credits -= 1;
      await user.save();

      return res.status(200).json({ imageLink: uploadedImage.secure_url, credits: user.credits });
    }

    // 2. POST SAVED IMAGE
    if (action === 'post' || imageLink) {
      const linkToSave = imageLink || req.body.imageLink;
      const finalPrompt = prompt || caption || "Generated artwork";
      const finalCaption = caption || prompt || "Generated artwork";

      newPost = new Post({
        user: userId,
        imageLink: linkToSave,
        caption: finalCaption
      });

      await newPost.save();
      await newPost.populate('user');

      // Trigger New Post notification to all followers
      await sendNewPostNotifications(userId, newPost._id);

      return res.status(201).json(newPost);
    }

    // 3. BACKWARD COMPATIBILITY DEFAULT
    if (!prompt || !caption) {
      res.status(409);
      throw new Error("Kindly Provide Prompt to Generate image");
    }

    // Fetch user to check and update credits
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.credits <= 0) {
      res.status(403);
      throw new Error("You do not have enough credits to generate an image.");
    }

    // URL encoded prompt for pollination
    const encodedPrompt = encodeURIComponent(prompt);
    const randomSeed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${randomSeed}&width=1024&height=1024&nologo=true`;

    const response = await fetch(imageUrl);
    if (!response.ok) {
      res.status(500);
      throw new Error("Failed to generate image from Pollination");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = crypto.randomUUID() + ".jpg";
    const filePath = path.join(__dirname, "../generated-content", filename);
    fs.writeFileSync(filePath, buffer);
    
    const uploadedImage = await uploadToCloudinary(filePath);
    fs.unlinkSync(filePath);

    // Decrement user credit
    user.credits -= 1;
    await user.save();

    newPost = new Post({
      user: userId,
      imageLink: uploadedImage.secure_url,
      caption: caption
    });

    await newPost.save();
    await newPost.populate('user');

    // Trigger New Post notification to all followers
    await sendNewPostNotifications(userId, newPost._id);

    return res.status(201).json({
      ...newPost.toJSON(),
      credits: user.credits
    });

  } catch (error) {
    console.log(error);
    if (res.statusCode === 200 || res.statusCode === 201) {
      res.status(409);
    }
    throw new Error(error.message || "POST NOT CREATED!.......");
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

  // Trigger Like Notification (exclude self-likes)
  try {
    const postCreatorId = post.user?._id || post.user;
    if (postCreatorId && postCreatorId.toString() !== currentUser._id.toString()) {
      await Notification.create({
        recipient: postCreatorId,
        sender: currentUser._id,
        type: "like",
        post: post._id
      });
    }
  } catch (notificationErr) {
    console.error("Error creating like notification:", notificationErr);
  }
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


const deletePost = async (req, res) => {
    const postId = req.params.pid;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }

    // Checking if the user is the owner of the post
    // Assuming post.user is an ObjectId. If it's populated, it might be an object, but we get the ID.
    const postOwnerId = post.user?._id || post.user;
    if (postOwnerId.toString() !== userId.toString()) {
        res.status(401);
        throw new Error("Not authorized to delete this post");
    }

    // Delete the post and its related reports/notifications
    await Report.deleteMany({ post: postId });
    await Notification.deleteMany({ post: postId });
    
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully", id: postId });
};






const postController = {generateAndPost , getPosts , getPost , likeAndUnlikePost , reportPost, deletePost}

export default postController;
