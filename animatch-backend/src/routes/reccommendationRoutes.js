import express from 'express';
import {getRecommendations, getRecommendationsWithInput, insertRecommendations, fetchRecommendations, getDailySpinReccommendation} from '../controllers/reccommendationController.js';

const router = express.Router();

router.get('/fetch-recommendations', fetchRecommendations);
router.post('/recommendations/ai', getRecommendations);
router.post('/recommendations/input-ai', getRecommendationsWithInput);
router.post('/recommendations', insertRecommendations);
router.post('/recommendations/daily-spin', getDailySpinReccommendation);


export default router;