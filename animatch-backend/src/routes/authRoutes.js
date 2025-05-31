import express from 'express';
import { changeEmail, changePassword, refreshToken, userSignIn, userSignOut, userSignUp } from '../controllers/userAuthController.js';


const router = express.Router();

router.post("/signUp", userSignUp);
router.post("/signIn", userSignIn);
router.post("/signOut", userSignOut);
router.put("/updateEmail", changeEmail);
router.put("/updatePassword", changePassword);
router.post("/refreshToken", refreshToken);

export default router;