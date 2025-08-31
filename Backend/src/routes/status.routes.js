import { Router } from "express";
const router=Router();
import { getStatus, createStatus,changeMonthYear, updateCredits } from "../controllers/status.controllers.js";



router.get('/', getStatus);
router.post('/createStatus', createStatus);
router.patch('/updateAmount', updateCredits);
router.patch('/changeMonthYear/:userId', changeMonthYear);
router.get('/topten', getTopTenUsers);
router.get('/monthlytopten', getMonthlyTopTenUsers);
router.get('/yearlytopten', getYearlyTopTenUsers);


export default router;
