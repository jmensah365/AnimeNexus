import express from 'express';
import {getRecommendations, getRecommendationsWithInput, insertRecommendations, fetchRecommendations, getDailySpinReccommendation} from '../controllers/reccommendationController.js';

const router = express.Router();

router.get('/', fetchRecommendations);
router.post('/ai', getRecommendations);
router.post('/input-ai', getRecommendationsWithInput);
router.post('/', insertRecommendations);
router.post('/daily-spin', getDailySpinReccommendation);


export default router;