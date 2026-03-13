import express from "express"
import adminController from "../controller/adminController.js"
import protect from "../middleWare/authMiddleware.js"

const router = express.Router()

router.get("/user" , protect.forAdmin ,  adminController.getAllUser)
router.get("/post" , protect.forAdmin ,  adminController.getAllPosts)
router.get("/reports" , protect.forAdmin ,  adminController.getReports)
router.put("/user/:uid" , protect.forAdmin ,  adminController.updateUser)
router.put("/post/:pid" , protect.forAdmin ,  adminController.updatePost)

export default router