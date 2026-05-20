import Post from "../models/postModel.js"
import User from "../models/userModel.js"
import Report from "../models/reportModel.js"
import CreditRequest from "../models/creditRequestModel.js"
import Notification from "../models/notificationModel.js"

const getAllUser = async(req,res) => {
    // Populate posts count or other things if needed. For now simple find.
    const users = await User.find().select('-password')
    if(!users){
        res.status(404)
        throw new Error("USER NOT FOUND !")
    }

    res.status(200).json(users)
}

const getAllPosts = async(req,res) => {
    const posts = await Post.find().populate('user', 'name username avatar')
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
    const reports = await Report.find().populate('user', 'name username avatar').populate('post')
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

const updateCredits = async(req,res) => {
    let userId = req.params.uid;
    const { credits } = req.body;
    
    if (credits === undefined) {
        res.status(400);
        throw new Error("Please provide credits value");
    }

    let updatedUser = await User.findByIdAndUpdate(userId, { credits }, { new: true }).select('-password');
    if(!updatedUser){
        res.status(404);
        throw new Error("User not found");
    }
    res.status(200).json(updatedUser);
}

const deletePost = async(req, res) => {
    let postId = req.params.pid;
    const post = await Post.findById(postId);
    
    if(!post){
        res.status(404);
        throw new Error("Post not found");
    }
    
    await Report.deleteMany({ post: postId });
    await post.deleteOne();
    
    res.status(200).json({ message: "Post deleted successfully", id: postId });
}

const deleteReport = async(req, res) => {
    let reportId = req.params.rid;
    const report = await Report.findByIdAndDelete(reportId);
    
    if(!report){
        res.status(404);
        throw new Error("Report not found");
    }
    
    res.status(200).json({ message: "Report deleted successfully", id: reportId });
}

const getCreditRequests = async(req, res) => {
    const requests = await CreditRequest.find().populate("user", "name username avatar email");
    res.status(200).json(requests);
}

const processCreditRequest = async(req, res) => {
    const { action } = req.body; // 'approve' or 'reject'
    const requestId = req.params.id;

    const request = await CreditRequest.findById(requestId).populate("user");
    if (!request) {
        res.status(404);
        throw new Error("Credit request not found");
    }

    if (request.status !== "pending") {
        res.status(400);
        throw new Error("Request already processed");
    }

    if (action === "approve") {
        request.status = "approved";
        
        // Add credits to user
        const user = await User.findById(request.user._id);
        user.credits += request.amount;
        await user.save();

        // Send notification
        await Notification.create({
            recipient: user._id,
            type: "system",
            text: `Admin added ${request.amount} credits to your account.`
        });
    } else if (action === "reject") {
        request.status = "rejected";
        
        // Send notification
        await Notification.create({
            recipient: request.user._id,
            type: "system",
            text: `Your request for ${request.amount} credits was rejected.`
        });
    } else {
        res.status(400);
        throw new Error("Invalid action");
    }

    await request.save();
    res.status(200).json(request);
}

const adminController = {getAllUser , getAllPosts , updatePost , getReports , updateUser, updateCredits, deletePost, deleteReport, getCreditRequests, processCreditRequest}

export default adminController