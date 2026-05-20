import express from "express";
import creditRequestController from "../controller/creditRequestController.js";
import protect from "../middleWare/authMiddleware.js";

const router = express.Router();

router.post("/", protect.forUser, creditRequestController.createCreditRequest);

export default router;
