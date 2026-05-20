import express from "express"
import profileController from "../controller/profileController.js"
import protect from "../middleWare/authMiddleware.js"

const router = express.Router()

router.get("/followers" , protect.forUser , profileController.getMyFollowers)
router.get("/followings" , protect.forUser , profileController.getMyFollowings)
router.get("/all" , protect.forUser , profileController.getAllUsers)

router.get("/:name" ,  profileController.getProfile)


export default router