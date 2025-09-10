import express from 'express';
import {getWatchlistController, insertWatchlistController, removeWatchlistController, updateWatchlistController, getWatchlistControllerWithAnimeTitles, removeWatchlistByAnimeIdController} from '../controllers/watchlistController.js';
import { supabaseAuthMiddleware } from '../middlewares/supabaseMiddleware.js';

const router = express.Router();

/*
    The supabase auth middleware is used to ensure a user is authenticated before each request in protected routes.
 */

router.get('/', supabaseAuthMiddleware, getWatchlistController);
router.get('/with-titles', supabaseAuthMiddleware, getWatchlistControllerWithAnimeTitles);
router.post('/', supabaseAuthMiddleware, insertWatchlistController);
router.delete('/:watchListId', supabaseAuthMiddleware, removeWatchlistController);
router.delete('/anime-id/:animeId', supabaseAuthMiddleware, removeWatchlistByAnimeIdController)
router.put('/:watchListId', supabaseAuthMiddleware, updateWatchlistController);

export default router;