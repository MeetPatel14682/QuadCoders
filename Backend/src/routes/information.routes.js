import {Router} from "express";
import { createInformation,
  getInformation,
  updateInformation,
  deleteInformation, } from "../controllers/information.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.use(verifyJWT); // Apply the verifyJWT middleware to all routes in this router
router.route('/information').post(createInformation);
router.route('/information/:license').get(getInformation);
router.route('/information/:license').patch(updateInformation);
router.route('/information/:license').delete(deleteInformation);
export default router;