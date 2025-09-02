import express from 'express';
import {getRecommendations, getRecommendationsWithInput, insertRecommendations, fetchRecommendations, getDailySpinReccommendation} from '../controllers/reccommendationController.js';
import { supabaseAuthMiddleware } from '../middlewares/supabaseMiddleware.js';

const router = express.Router();

/*
    The supabase auth middleware is used to ensure a user is authenticated before each request in protected routes.
 */

    
router.get('/', supabaseAuthMiddleware, fetchRecommendations);
router.post('/ai', supabaseAuthMiddleware, getRecommendations);
router.post('/input-ai', supabaseAuthMiddleware, getRecommendationsWithInput);
router.post('/', supabaseAuthMiddleware, insertRecommendations);
router.post('/daily-spin', supabaseAuthMiddleware, getDailySpinReccommendation);


export default router;