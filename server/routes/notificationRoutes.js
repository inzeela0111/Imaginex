import express from "express";
import notificationController from "../controller/notificationController.js";
import protect from "../middleWare/authMiddleware.js";

const router = express.Router();

router.get("/", protect.forUser, notificationController.getNotifications);
router.get("/unread-count", protect.forUser, notificationController.getUnreadCount);
router.put("/read", protect.forUser, notificationController.markAsRead);

export default router;
