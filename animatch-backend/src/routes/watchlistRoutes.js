import express from 'express';
import {getWatchlistController, insertWatchlistController, removeWatchlistController, updateWatchlistController, getWatchlistControllerWithAnimeTitles} from '../controllers/watchlistController.js';

const router = express.Router();

router.get('/', getWatchlistController);
router.get('/with-titles', getWatchlistControllerWithAnimeTitles);
router.post('/', insertWatchlistController);
router.delete('/:watchListId', removeWatchlistController);
router.put('/:watchListId', updateWatchlistController);

export default router;