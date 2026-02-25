import User from "../models/userModels.js"

const followUserRequest = async(req , res) => {

    let targetUser = await User.findById(req.params.uid) //jisko follow krna h
    let currentUser= await User.findById(req.user._id) //jo follow krega

// check if both users exists
if(!targetUser || !currentUser){
    res.status(404)
    throw new Error("User not Found")

}    

//Add follower
targetUser.followers.push(currentUser._id)
await targetUser.save()

res.status(200).json(targetUser).select("-password")

}




const followController = {followUserRequest}

export default followController
