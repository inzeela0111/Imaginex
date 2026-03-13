import Post from "../models/postModel.js"
import Saved from "../models/savedPostModel.js"

//SAVE  POST
 const savePost = async(req , res) => {
    const userId = req.user._id
    const postId = req.params.pid
     
    //Check if Post Is Exists
    const post = await Post.findById(postId)

    if(!post){
        res.status(404)
        throw new Error("POST NOT FOUND!...")
    }

    //Check if post is already saved
    const saveExists = await Saved.findOne({user : userId})

    if(saveExists){
        res.status(409)
        throw new Error("Post Already Saved !...")
    }

    //Create Save Post
    const savedPost = new Saved({ 
        user : userId ,
        post : postId
    })
    await savedPost.save()
    await savedPost.populate('post')

    if(!savedPost){
        res.status(409)
        throw new Error("Post Not Saved!...")
    }
    res.status(201).json(savedPost)
}

//GET SAVE POST
 const getSavePosts = async(req , res) => {
    const userId = req.user._id
    const allMySavedPosts = await Saved.find({user : userId }).populate('post')

    if(!allMySavedPosts){
        res.status(404)
        throw new Error(" SAVED POSTS NOT FOUND...")
    }
    res.status(200).json(allMySavedPosts)

}

//DELETE SAVED POSTS
const removeSavedPost = async(req,res) => {
    await Saved.findOneAndDelete(req.params.pid)
    res.status(200).json({
        _id : req.params.pid ,
        msg : "Saved Post Removed "

    })
}



const savePostController = {savePost , getSavePosts , removeSavedPost}

export default savePostController