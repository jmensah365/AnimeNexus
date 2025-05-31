import express from 'express';
import {getWatchlistController, insertWatchlistController, removeWatchlistController, updateWatchlistController, getWatchlistControllerWithAnimeTitles} from '../controllers/watchlistController.js';

const router = express.Router();

router.get('/', getWatchlistController);
router.get('/withTitles', getWatchlistControllerWithAnimeTitles);
router.post('/insertWatchlist', insertWatchlistController);
router.delete('/removeWatchlist/:watchListId', removeWatchlistController);
router.put('/updateWatchlist/:watchListId', updateWatchlistController);

export default router;