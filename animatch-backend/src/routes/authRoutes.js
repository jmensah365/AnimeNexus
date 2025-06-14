import express from 'express';
import { changeEmail, changePassword, refreshToken, userSignIn, userSignOut, userSignUp, validateSession} from '../controllers/userAuthController.js';


const router = express.Router();

router.get("/validateSession", validateSession);
router.post("/signUp", userSignUp);
router.post("/signIn", userSignIn);
router.post("/signOut", userSignOut);
router.put("/updateEmail", changeEmail);
router.put("/updatePassword", changePassword);
router.post("/refreshToken", refreshToken);

export default router;