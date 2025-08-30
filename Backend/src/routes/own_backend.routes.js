import { Router } from "express";
const router = Router();
import { getOwnBackend, createOwnBackend, updateOwnBackend } from "../controllers/own_backend.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


router.use(verifyJWT); // Apply the verifyJWT middleware to all routes in this router

router.route('/ownBackend').get(getOwnBackend);
router.route('/ownBackend').post(createOwnBackend);
router.route('/ownBackend/:id').patch(updateOwnBackend);

export default router;