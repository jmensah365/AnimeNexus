import express from 'express';
import {getRecommendations, getRecommendationsWithInput, insertRecommendations, fetchRecommendations, getDailySpinReccommendation} from '../controllers/reccommendationController.js';

const router = express.Router();

router.get('/', getRecommendations);
router.get('/fetch', fetchRecommendations);
router.post('/userInput', getRecommendationsWithInput);
router.post('/insert', insertRecommendations);
router.post('/dailySpin', getDailySpinReccommendation);


export default router;