import express from 'express';
import {getRecommendations, getRecommendationsWithInput, insertRecommendations, fetchRecommendations} from '../controllers/reccommendationController.js';

const router = express.Router();

router.get('/', getRecommendations);
router.get('/fetch', fetchRecommendations);
router.post('/userInput', getRecommendationsWithInput);
router.post('/insert', insertRecommendations);

export default router;