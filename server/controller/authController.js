import user from "../models/userModels.js";
import User from "../models/userModels.js";
import bcrypt from "bcryptjs";

const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
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
  let user = await User.create({ name, email, phone, password : hashedPassword });

  if (!user) {
    res.status(400);
    throw new Error("User Not Created");
  }

  res.status(201).json(user);

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
    res.status(200).json(user)
  }else{
    res.status(400)
    throw new Error("Invalid credentials!....")
  }

  }

const authController = { registerUser, loginUser };

export default authController;
