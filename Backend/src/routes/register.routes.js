import { Router } from "express";
const router=Router();
import  { registerUser, loginUser, logoutUser, updatedUser, changePassword,refreshTokenHandler } from "../controllers/register.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/updateUser').patch(verifyJWT, updatedUser);
router.route('/changePassword').patch(verifyJWT, changePassword);
router.route('/refreshToken').post(refreshTokenHandler);


export default router;