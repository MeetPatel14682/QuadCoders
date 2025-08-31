import { Router } from "express";
const router=Router();
import { getHistory,getHistoryByUserId,createHistory } from "../controllers/history.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


router.get('/', getHistory);
router.get('/:userId', getHistoryByUserId);
router.route('/').post(createHistory);

export default router;