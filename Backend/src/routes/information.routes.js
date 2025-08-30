import {Router} from "express";
import { createInformation,
  getInformationByLicense,
  updateInformationByLicense,
  deleteInformationByLicense, } from "../controllers/information.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

router.use(verifyJWT); // Apply the verifyJWT middleware to all routes in this router
const router = Router();
router.route('/information').post(createInformation);
router.route('/information/:license').get(getInformationByLicense);
router.route('/information/:license').patch(updateInformationByLicense);
router.route('/information/:license').delete(deleteInformationByLicense);
export default router;