import express from 'express'
import {fetchUserReactionController, deleteUserReactionController, insertUserReactionController, updateUserReactionController, fetchUserReactionControllerWithAnimeTitles} from '../controllers/userReactionController.js';
import { supabaseAuthMiddleware } from '../middlewares/supabaseMiddleware.js';

const router = express.Router();

router.get('/', fetchUserReactionController);
router.get('/with-titles', supabaseAuthMiddleware, fetchUserReactionControllerWithAnimeTitles);
router.post('/', supabaseAuthMiddleware, insertUserReactionController);
router.put('/:reactionId', supabaseAuthMiddleware, updateUserReactionController);
router.delete('/:reactionId', supabaseAuthMiddleware, deleteUserReactionController);

export default router;