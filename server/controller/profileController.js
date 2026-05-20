import Post from "../models/postModel.js"
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


/*
const getProfile = async (req, res) => {

    const { name } = req.params
    const user = await User.findOne({ name: name }).populate('followers').populate('following')
    const posts = await Post.find({ user : user._id})

    if (!user || !posts) {
        res.status(404)
        throw new Error('User Not Found! , Posts Not Found!')
    }

    const profile = {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        credits: user.credits,
        posts: posts,
        createdAt: user.createdAt
    }


    res.status(200).json(profile)


}
*/

const getProfile = async (req, res) => {
    const { name } = req.params;
    
    // Case-insensitive query to find the user
    const user = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
        .populate('followers')
        .populate('following');

    if (!user) {
        res.status(404);
        throw new Error('User Not Found!');
    }

    const posts = await Post.find({ user: user._id });

    const profile = {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        credits: user.credits,
        posts: posts,
        createdAt: user.createdAt
    };

    res.status(200).json(profile);
}



const getMyFollowings = async(req,res) => {
     const user = await User.findById(req.user.id).populate('following')

    if(!user){
        res.status(404)
        throw new Error(" USER NOT FOUND")
    }
   
     res.status(200).json(user.following)
    res.send("YOUR FOLLOWINGS")
}

const getAllUsers = async (req, res) => {
    const users = await User.find({}, 'name email bio avatar followers following')
    if (!users) {
        res.status(404)
        throw new Error("Users not found")
    }
    res.status(200).json(users)
}

const profileController = {getMyFollowers ,getProfile , getMyFollowings, getAllUsers}
export default profileController
























// import Post from "../models/postModel.js";
// import User from "../models/userModel.js";


// // ✅ Get My Followers
// const getMyFollowers = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate("followers");

//     if (!user) {
//       return res.status(404).json({ message: "User Not Found" });
//     }

//     res.status(200).json(user.followers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ Get My Followings
// const getMyFollowings = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate("following");

//     if (!user) {
//       return res.status(404).json({ message: "User Not Found" });
//     }

//     res.status(200).json(user.following);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ Get Profile by Name
// const getProfile = async (req, res) => {
//   try {
//     const { name } = req.params;

//     const user = await User.findOne({ name })
//       .populate("followers")
//       .populate("following");

//     // 🔴 IMPORTANT: check before using user._id
//     if (!user) {
//       return res.status(404).json({ message: "User Not Found!" });
//     }

//     const posts = await Post.find({ user: user._id });

//     const profile = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       bio: user.bio,
//       followers: user.followers,
//       following: user.following,
//       credits: user.credits,
//       posts: posts,
//       createdAt: user.createdAt,
//     };

//     res.status(200).json(profile);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const profileController = {
//   getMyFollowers,
//   getMyFollowings,
//   getProfile,
// };

// export default profileController;








