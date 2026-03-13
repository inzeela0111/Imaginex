import Post from "../models/postModel.js"
import User from "../models/userModel.js"
import Report from "../models/reportModel.js"

const getAllUser = async(req,res) => {
    const users = await User.find()
    if(!users){
        res.status(404)
        throw new Error("USER NOT FOUND !")
    }

    res.status(200).json(users)
}

const getAllPosts = async(req,res) => {
    const posts = await Post.find()
    if(!posts){
        res.status(404)
        throw new Error("Posts Not Found !...")
    }
    res.status(200).json(posts)
}

const updatePost = async(req,res) => {
       let postId = req.params.pid

    const post = await Post.findById(postId)

    if(!post){
        res.status(404)
        throw new Error("Post NOT FOUND !")
    }

    let updatedPost = await Post.findByIdAndUpdate(postId , req.body , {new : true})

     if(!updatedPost){
        res.status(409)
        throw new Error("POST NOT UPDATED !")
    }
    
    res.status(200).json(updatedPost)
}

const getReports = async(req,res) => {
    const reports = await Report.find()
    if(!reports){
        res.status(404)
        throw new Error("Reports Not Found !...")
    }
    res.status(200).json(reports)
}

const updateUser = async(req,res) => {
    let userId = req.params.uid

    const user = await User.findById(userId)

    if(!user){
        res.status(404)
        throw new Error("USER NOT FOUND !")
    }

    let updatedUser = await User.findByIdAndUpdate(userId , {isActive: user.isActive ? false : true} , {new : true})

     if(!updateUser){
        res.status(409)
        throw new Error("USER NOT UPDATED !")
    }
    
    res.status(200).json(updatedUser)

}


const adminController = {getAllUser , getAllPosts , updatePost , getReports , updateUser}

export default adminController