import express from 'express';
import {getRecommendations, getRecommendationsWithInput} from '../controllers/reccommendationController.js';

const router = express.Router();

router.get('/', getRecommendations);
router.post('/userInput', getRecommendationsWithInput);

export default router;