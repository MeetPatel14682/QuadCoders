import { Router } from "express";
const router=Router();
import { getHistory,getHistoryByUserId,createHistory } from "../controllers/history.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

router.use(verifyJWT) //Apply the verifyJWT middleware to all routes in this router

router.get('/', getHistory);
router.get('/:userId', getHistoryByUserId);
router.post('/createHistory', createHistory);

export default router;