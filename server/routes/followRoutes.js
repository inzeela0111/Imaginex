import express from "express"
import followController from "../controller/folloowController.js"
import protect from "../middleWare/authMiddleware.js"

const router = express.Router()

 router.put("/:uid" , protect , followController.followUserRequest)

export default router