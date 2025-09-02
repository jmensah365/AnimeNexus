import express from 'express';
import { fetchAnimeListByAgeRating, fetchAnimeListByCategory, fetchAnimeListByName, fetchAnimeListBySeasonYear, fetchAnimeListByStatus, fetchAnimeListBySeason, addAnimeMetadata, getAnimeData, fetchAnimeEpisodes, fetchAllCategories } from '../controllers/animeController.js';
import { supabaseAuthMiddleware } from '../middlewares/supabaseMiddleware.js';

//this file exposes the API endpoints
const router = express.Router();

/*
    The supabase auth middleware is used to ensure a user is authenticated before each request in protected routes.
 */

    
router.get("/category/:category", fetchAnimeListByCategory);
router.get("/name/:name", fetchAnimeListByName);
router.get("/age-rating/:age-rating", fetchAnimeListByAgeRating);
router.get("/season-year/:year", fetchAnimeListBySeasonYear);
router.get("/status/:status", fetchAnimeListByStatus); //types of statuses: current, upcoming, or finished
router.get("/season/:season", fetchAnimeListBySeason);
router.post("/insert-metadata", supabaseAuthMiddleware, addAnimeMetadata );
router.get("/get-anime", supabaseAuthMiddleware, getAnimeData);
router.get('/episodes', fetchAnimeEpisodes);
router.get("/categories", fetchAllCategories)

export default router;