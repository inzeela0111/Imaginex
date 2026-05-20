import User from "../models/userModel.js"
import Notification from "../models/notificationModel.js"

/*
const followUserRequest = async(req , res) => {

    let targetUser = await User.findById(req.params.uid) //jisko follow krna h
    let currentUser= await User.findById(req.user._id) //jo follow krega

// check if both users exists
if(!targetUser || !currentUser){
    res.status(404)
    throw new Error("User not Found")

}    


//Check if Already  Followed

if(targetUser.followers.includes(currentUser._id)){
    res.status(409)
    throw new Error ("Already Followed !.....")
}



//Add follower
targetUser.followers.push(currentUser._id)
await targetUser.save()


//Add Following
currentUser.followings.push(targetUser._id)
await currentUser.save()


res.status(200).json(targetUser).select("-password")

// res.send("FOLLOWED !....")

 }


//  ............................................................................................


const unfollowUserRequest = async(req , res) => {

    let targetUser = await User.findById(req.params.uid) //jisko follow krna h
    let currentUser= await User.findById(req.user._id) //jo follow krega

// check if both users exists
if(!targetUser || !currentUser){
    res.status(404)
    throw new Error("User not Found")
}    

//Check if Already  Un-Followed

if(!targetUser.followers.includes(currentUser._id)){
    res.status(409)
    throw new Error ("Already Un-Followed !.....")
}

//Remove follower
let updatedFollowerList = targetUser.followers.filter(follower => follower.toString() !== currentUser._id.toString())
targetUser.followers = updatedFollowerList
await targetUser.save()


//Remove Following
let updatedFollowingList = currentUser.followings.filter(follower => follower.toString() !== targetUser._id.toString())
currentUser.followings = updatedFollowingList
await currentUser.save()
 

res.status(200).json(targetUser).select("-password")

// res.send("Un-FOLLOWED !....")

 }
*/

const followUserRequest = async(req , res) => {
    let targetUser = await User.findById(req.params.uid) //jisko follow krna h
    let currentUser= await User.findById(req.user._id) //jo follow krega

    // check if both users exists
    if(!targetUser || !currentUser){
        res.status(404)
        throw new Error("User not Found")
    }    

    //Check if Already  Followed
    if(targetUser.followers.includes(currentUser._id)){
        res.status(409)
        throw new Error ("Already Followed !.....")
    }

    //Add follower
    targetUser.followers.push(currentUser._id)
    await targetUser.save()

    //Add Following (Corrected schema field: following instead of followings)
    currentUser.following.push(targetUser._id)
    await currentUser.save()

    // Create Follow Notification
    try {
        await Notification.create({
            recipient: targetUser._id,
            sender: currentUser._id,
            type: "follow"
        });
    } catch (notificationErr) {
        console.error("Error creating follow notification:", notificationErr);
    }

    res.status(200).json(targetUser)
}

const unfollowUserRequest = async(req , res) => {
    let targetUser = await User.findById(req.params.uid) //jisko follow krna h
    let currentUser= await User.findById(req.user._id) //jo follow krega

    // check if both users exists
    if(!targetUser || !currentUser){
        res.status(404)
        throw new Error("User not Found")
    }    

    //Check if Already  Un-Followed
    if(!targetUser.followers.includes(currentUser._id)){
        res.status(409)
        throw new Error ("Already Un-Followed !.....")
    }

    //Remove follower
    let updatedFollowerList = targetUser.followers.filter(follower => follower.toString() !== currentUser._id.toString())
    targetUser.followers = updatedFollowerList
    await targetUser.save()

    //Remove Following (Corrected schema field: following instead of followings)
    let updatedFollowingList = currentUser.following.filter(follower => follower.toString() !== targetUser._id.toString())
    currentUser.following = updatedFollowingList
    await currentUser.save()
     
    res.status(200).json(targetUser)
}



// const unfollowUserRequest = async(req , res) => {

//     let targetUser = await User.findById(req.params.uid) //jisko follow krna h
//     let currentUser= await User.findById(req.user._id) //jo follow krega

// // check if both users exists
// if(!targetUser || !currentUser){
//     res.status(404)
//     throw new Error("User not Found")

// }    


// //Check if Already  Followed

// // if(!targetUser.followers.includes(currentUser._id)){
// //     res.status(409)
// //     throw new Error ("Already Un-Followed !.....")
// // }



// //Remove follower
// let updatedFollowerList = targetUser.followers.filter(follower => follower !== currentUser._id)
//  console.log(updatedFollowerList)
// // await targetUser.save()


// //Remove Following
// let updatedFollowingList = currentUser.followings.filter(follower => follower._id !== targetUser._id)
// console.log(updatedFollowingList)
// // await currentUser.save()


// // res.status(200).json(targetUser).select("-password")

// res.send("UNFOLLOWED !....")

//  }

const followController = {followUserRequest ,  unfollowUserRequest}

export default followController



















