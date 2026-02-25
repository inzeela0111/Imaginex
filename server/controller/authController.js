import user from "../models/userModels.js";
import User from "../models/userModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
  const { name, email, phone, password , bio} = req.body;

  if (!name || !email || !phone || !password || !bio)    {
    res.status(409);
    throw new Error("Please Fill All Details !.....");
  }

  //Check if user already exits

  let emailExit = await User.findOne({ email: email });
  let phoneExit = await User.findOne({ phone: phone });

  if (emailExit || phoneExit) {
    res.status(409);
    throw new Error("User Already exits ! ........");
  }

  //Hash Password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password , salt);

  //REGISTER USER
  let user = await User.create({ name, email, phone, password : hashedPassword ,bio});

  if (!user) {
    res.status(400);
    throw new Error("User Not Created");
  }

  res.status(201).json({
    id : user._id,
    name : user.name ,
    bio : user.bio,
    email : user.email ,
    phone : user.phone ,
    isAdmin : user.isAdmin ,
    isActive : user.isActive , 
    credits : user.credits ,
    token : generateToken(user._id)

  });

  res.send("USER REGISTERED !...");
};



//Login user...........

const loginUser = async (req, res) => {

  const {email,password} = req.body;

  if ( !email || !password) {
    res.status(409);
    throw new Error("Please Fill All Details !.....");
  }

  //Check if user exits

  let user = await User.findOne({ email: email });

  if(user && await bcrypt.compare(password , user.password)){
    res.status(200).json({
    id : user._id,
    name : user.name ,
    email : user.email ,
    phone : user.phone ,
    isAdmin : user.isAdmin ,
    isActive : user.isActive , 
    credits : user.credits ,
    token : generateToken(user._id)

  })
  }else{
    res.status(400)
    throw new Error("Invalid credentials!....")
  }

  }

  //Protected controller

  const privateController = (req , res) => {
    // console.log(req.user)
    res.send("i am private controller " + req.user.name)
  }


  //Generate token

  const generateToken = (id) =>{
    return jwt.sign({id} , process.env.JWT_SECERT , {expiresIn : '30d'})
  }

const authController = { registerUser, loginUser , privateController};

export default authController;
