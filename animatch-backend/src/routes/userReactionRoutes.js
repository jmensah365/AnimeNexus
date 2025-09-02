import express from 'express'
import {fetchUserReactionController, deleteUserReactionController, insertUserReactionController, updateUserReactionController, fetchUserReactionControllerWithAnimeTitles} from '../controllers/userReactionController.js';
import { supabaseAuthMiddleware } from '../middlewares/supabaseMiddleware.js';

const router = express.Router();

router.get('/', fetchUserReactionController);
router.get('/with-titles', supabaseAuthMiddleware, fetchUserReactionControllerWithAnimeTitles);
router.post('/', insertUserReactionController);
router.put('/:reactionId', updateUserReactionController);
router.delete('/:reactionId', deleteUserReactionController);

export default router;