import express from  "express"
import protect from "../middleWare/authMiddleware.js"
import postController from "../controller/postController.js"

import savePostController from "../controller/savePostController.js"
import commentController from "../controller/commentController.js"


const router = express.Router({mergeParams : true})

router.get("/" , protect.forUser , postController.getPosts)
router.post("/" , protect.forUser , postController.generateAndPost)
router.get("/:pid" , protect.forUser , postController.getPost)
router.put("/:pid" , protect.forUser , postController.likeAndUnlikePost)
router.post("/:pid" , protect.forUser , postController.reportPost)


//SAVE POST ROUTES
router.post("/:pid/save" ,protect.forUser , savePostController.savePost)

//COMMENT POST ROUTES
router.get("/:pid/comments" ,protect.forUser , commentController.getComments)
router.post("/:pid/comments" ,protect.forUser , commentController.addComment)
router.delete("/:pid/comments/:cid" ,protect.forUser , commentController.removeComment)


export default router