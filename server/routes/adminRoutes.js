import express from "express"
import adminController from "../controller/adminController.js"
import protect from "../middleWare/authMiddleware.js"

const router = express.Router()

router.get("/user" , protect.forAdmin ,  adminController.getAllUser)
router.get("/post" , protect.forAdmin ,  adminController.getAllPosts)
router.get("/reports" , protect.forAdmin ,  adminController.getReports)
router.put("/user/:uid" , protect.forAdmin ,  adminController.updateUser)
router.put("/user/:uid/credits" , protect.forAdmin ,  adminController.updateCredits)
router.get("/credit-requests" , protect.forAdmin ,  adminController.getCreditRequests)
router.put("/credit-requests/:id" , protect.forAdmin ,  adminController.processCreditRequest)
router.put("/post/:pid" , protect.forAdmin ,  adminController.updatePost)
router.delete("/post/:pid" , protect.forAdmin ,  adminController.deletePost)
router.delete("/report/:rid" , protect.forAdmin ,  adminController.deleteReport)

export default router