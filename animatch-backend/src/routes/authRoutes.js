import express from 'express';
import { changeEmail, changePassword, refreshToken, userSignIn, userSignOut, userSignUp, validateSession} from '../controllers/userAuthController.js';


const router = express.Router();

router.get("/validate-session", validateSession);
router.post("/signup", userSignUp);
router.post("/sign-in", userSignIn);
router.post("/sign-out", userSignOut);
router.put("/update-email", changeEmail);
router.put("/update-password", changePassword);
router.post("/refresh-token", refreshToken);

export default router;