import express from "express";
import { createOrder, transferToReceiver } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/transfer", transferToReceiver);

export default router;
