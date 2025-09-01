import express from 'express';
import {getWatchlistController, insertWatchlistController, removeWatchlistController, updateWatchlistController, getWatchlistControllerWithAnimeTitles} from '../controllers/watchlistController.js';
import { supabaseAuthMiddleware } from '../middlewares/supabaseMiddleware.js';

const router = express.Router();

router.get('/', supabaseAuthMiddleware, getWatchlistController);
router.get('/with-titles', supabaseAuthMiddleware, getWatchlistControllerWithAnimeTitles);
router.post('/', supabaseAuthMiddleware, insertWatchlistController);
router.delete('/:watchListId', supabaseAuthMiddleware, removeWatchlistController);
router.put('/:watchListId', supabaseAuthMiddleware, updateWatchlistController);

export default router;