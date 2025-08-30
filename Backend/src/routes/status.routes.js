import { Router } from "express";
const router=Router();
import { getStatus, createStatus, updateAmount,changeMonthYear, updateCredits } from "../controllers/status.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


router.use(verifyJWT) //Apply the verifyJWT middleware to all routes in this router

router.get('/', getStatus);
router.post('/createStatus', createStatus);
router.patch('/updateAmount/:userId', updateCredits);
router.patch('/changeMonthYear/:userId', changeMonthYear);


export default router;