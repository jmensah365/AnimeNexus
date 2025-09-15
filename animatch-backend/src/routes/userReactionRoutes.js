import express from 'express'
import {fetchUserReactionController, deleteUserReactionController, insertUserReactionController, updateUserReactionController, fetchUserReactionControllerWithAnimeTitles, deleteReactionByAnimeIdController} from '../controllers/userReactionController.js';
import { supabaseAuthMiddleware } from '../middlewares/supabaseMiddleware.js';

const router = express.Router();

/*
    The supabase auth middleware is used to ensure a user is authenticated before each request in protected routes.
 */

router.get('/', fetchUserReactionController);
router.get('/with-titles', supabaseAuthMiddleware, fetchUserReactionControllerWithAnimeTitles);
router.post('/', supabaseAuthMiddleware, insertUserReactionController);
router.put('/:reactionId', supabaseAuthMiddleware, updateUserReactionController);
router.delete('/:reactionId', supabaseAuthMiddleware, deleteUserReactionController);
router.delete('/anime-id/:animeId', supabaseAuthMiddleware, deleteReactionByAnimeIdController);

export default router;