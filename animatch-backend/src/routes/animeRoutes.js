import express from 'express';
import { fetchAnimeListByAgeRating, fetchAnimeListByCategory, fetchAnimeListByName, fetchAnimeListBySeasonYear, fetchAnimeListByStatus, fetchAnimeListBySeason, addAnimeMetadata, getAnimeData, fetchAnimeEpisodes, fetchAllCategories } from '../controllers/animeController.js';

//this file exposes the API endpoints
const router = express.Router();

router.get("/category/:category", fetchAnimeListByCategory);
router.get("/name/:name", fetchAnimeListByName);
router.get("/age-rating/:age-rating", fetchAnimeListByAgeRating);
router.get("/season-year/:year", fetchAnimeListBySeasonYear);
router.get("/status/:status", fetchAnimeListByStatus); //types of statuses: current, upcoming, or finished
router.get("/season/:season", fetchAnimeListBySeason);
router.post("/insert-metadata", addAnimeMetadata );
router.get("/get-anime", getAnimeData);
router.get('/episodes', fetchAnimeEpisodes);
router.get("/categories", fetchAllCategories)

export default router;