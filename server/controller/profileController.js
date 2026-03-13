import User from "../models/userModel.js"

const getMyFollowers = async(req,res) => {

    const user = await User.findById(req.user.id).populate('followers')

    if(!user){
        res.status(404)
        throw new Error(" USER NOT FOUND")
    }
   
     res.status(200).json(user.followers)

    res.send("YOUR FOLLOWERS")
}

const getMyFollowings = async(req,res) => {
     const user = await User.findById(req.user.id).populate('followings')

    if(!user){
        res.status(404)
        throw new Error(" USER NOT FOUND")
    }
   
     res.status(200).json(user.followings)
    res.send("YOUR FOLLOWINGS")
}

const profileController = {getMyFollowers , getMyFollowings}
export default profileController