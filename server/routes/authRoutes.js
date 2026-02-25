import express from "express"
import authController from "../controller/authController.js"
import protect from "../middleWare/authMiddleware.js"


const router = express.Router()


router.post("/register" , authController.registerUser)
router.post("/login" , authController.loginUser)
router.post("/private" , protect , authController.privateController)



export default router