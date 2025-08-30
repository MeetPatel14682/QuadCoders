import { Router } from "express";
const router = Router();
import  { getInformation, insertInformation, updateInformation }  from "../controllers/own_backend.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";



router.route('/ownBackend').get(getInformation);
router.route('/ownBackend').post(insertInformation);
router.route('/ownBackend/:id').patch(updateInformation);

export default router;