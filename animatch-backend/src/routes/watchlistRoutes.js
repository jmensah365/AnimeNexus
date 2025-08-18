import express from 'express';
import {getWatchlistController, insertWatchlistController, removeWatchlistController, updateWatchlistController, getWatchlistControllerWithAnimeTitles} from '../controllers/watchlistController.js';

const router = express.Router();

router.get('/watchlists', getWatchlistController);
router.get('/watchlists/with-titles', getWatchlistControllerWithAnimeTitles);
router.post('/watchlists', insertWatchlistController);
router.delete('/watchlists/:watchListId', removeWatchlistController);
router.put('/watchlists/:watchListId', updateWatchlistController);

export default router;